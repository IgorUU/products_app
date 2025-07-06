<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ProductTransformationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;


class ProductController extends Controller
{

  public function __construct(
    protected ProductTransformationService $productTransformationService
  ) {}

  public function index(Request $request): JsonResponse
  {
    try {
      $token = $request->cookie('auth_token');

      if (!$token) {
        return response()->json(['message' => 'Authorization token required'], 401);
      }

      $response = Http::withHeaders([
        'Authorization' => "Bearer {$token}",
      ])->get(config('services.konovo.url') . '/products');

      if (!$response->successful()) {
        Log::error('Konovo API error: ' . $response->body());
        return response()->json(['message' => 'Internal server error'], 500);
      }

      $products = $response->json();
      $transformed_products = $this->productTransformationService->transform($products);
      $filtered_products = $this->applyFilters(collect($transformed_products), $request);

      return response()->json($filtered_products);
    } catch (\Exception $e) {
      Log::error('Products endpoint error: ' . $e->getMessage());
      return response()->json(['message' => 'Internal server error'], 500);
    }
  }

  /**
   * Apply category and search filters to the products collection.
   */
  protected function applyFilters(Collection $products, Request $request): array
  {
    if ($request->has('category') && $request->category !== '') {
      $products = $products->filter(fn($product) => isset($product['categoryName']) && strtolower($product['categoryName']) === strtolower($request->category));
    }

    if ($request->has('search') && $request->search !== '') {
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
