<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ProductTransformationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
      $token = $this->extractToken($request);

      if (!$token) {
        return response()->json(['message' => 'Authorization token required'], 401);
      }

      $response = Http::withHeaders([
        'Authorization' => $token,
      ])->get(config('services.konovo.url') . '/products');

      if (!$response->successful()) {
        Log::error('Konovo API error: ' . $response->body());
        return response()->json(['message' => 'Internal server error'], 500);
      }

      $products = $response->json();
      $transformedProducts = $this->productTransformationService->transform($products);

      return response()->json($transformedProducts);
    } catch (\Exception $e) {
      Log::error('Products endpoint error: ' . $e->getMessage());
      return response()->json(['message' => 'Internal server error'], 500);
    }
  }

  protected function extractToken(Request $request): ?string
  {
    $authorization = $request->header('Authorization');

    if (!$authorization || !str_starts_with($authorization, 'Bearer ')) {
      return NULL;
    }

    return $authorization;
  }

}
