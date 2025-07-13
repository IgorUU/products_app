<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ProductTransformationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;


class ProductController extends Controller
{

  public function __construct(
    protected ProductTransformationService $productTransformationService
  ) {}

  /**
   * Returns transformed and filtered products.
   */
  public function getProducts(Request $request): JsonResponse
  {
    try {
      $token = $request->cookie('auth_token');

      if (!$token) {
        return response()->json(['message' => 'Authorization token required'], 401);
      }

      $products = $this->getAllProducts($request, $token);

      if (empty($products)) {
        return response()->json(['message' => 'Internal server error'], 500);
      }

      $filtered_products = $this->applyFilters(collect($products), $request);
      return response()->json($filtered_products);
    } catch (\Exception $e) {
      Log::error('Products endpoint error: ' . $e->getMessage());
      return response()->json(['message' => 'Internal server error'], 500);
    }
  }

  /**
   * Returns the product with the specified ID.
   */
  public function getProductById(Request $request, string $product_id): JsonResponse
  {
    try {
      $token = $request->cookie('auth_token');

      if (!$token) {
        return response()->json(['message' => 'Authorization token required'], 401);
      }

      $products = $this->getAllProducts($request, $token);

      if (empty($products)) {
        return response()->json(['message' => 'Internal server error'], 500);
      }

      $product = collect($products)->firstWhere('sif_product', $product_id);

      if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
      }

      return response()->json($product);
    } catch (\Exception $e) {
      Log::error('Products endpoint error: ' . $e->getMessage());
      return response()->json(['message' => 'Internal server error'], 500);
    }
  }

  /**
   * Get all products from the API.
   */
  protected function getAllProducts(Request $request, string $token): array
  {
    return Cache::remember('all_products', 1800, function () use ($request, $token) {
      $response = Http::withHeaders([
        'Authorization' => "Bearer {$token}",
      ])->get(config('services.products.url') . '/products');

      if (!$response->successful()) {
        Log::error('Products API error ' . $response->body());
        return [];
      }

      $products = $response->json();
      return $this->productTransformationService->transform($products);
    });
  }

  /**
   * Get product categories.
   */
  public function getCategories(Request $request): JsonResponse
  {
    try {
      $token = $request->cookie('auth_token');

      if (!$token) {
        return response()->json(['message' => 'Authorization token required'], 401);
      }

      $categories = Cache::remember('product_categories', 3600, function () use ($token) {
        $response = Http::withHeaders([
          'Authorization' => "Bearer {$token}",
        ])->get(config('services.products.url') . '/products');

        if (!$response->successful()) {
          Log::error('Products API error: ' . $response->body());
          return [];
        }

        $products = $response->json();

        return collect($products)
          ->pluck('categoryName')
          ->filter()
          ->unique()
          ->values()
          ->toArray();
      });

      return response()->json($categories);
    } catch (\Exception $e) {
      Log::error('Categories endpoint error: ' . $e->getMessage());
      return response()->json(['message' => 'Internal server error'], 500);
    }
  }

  /**
   * Apply category and search filters to the products collection.
   */
  protected function applyFilters(Collection $products, Request $request): array
  {
    if ($request->has('category') && $request->filled('category')) {
      $products = $products->filter(fn($product) => isset($product['categoryName']) && strtolower($product['categoryName']) === strtolower($request->category));
    }

    if ($request->has('search') && $request->filled('search')) {
      $search_term = strtolower($request->search);
      $products = $products->filter(function ($product) use ($search_term) {
        $product_name = strtolower($product['naziv'] ?? '');
        $product_description = strtolower($product['description'] ?? '');

        return str_contains($product_name, $search_term) || str_contains($product_description, $search_term);
      });
    }

    return $products->values()->toArray();
  }
}
