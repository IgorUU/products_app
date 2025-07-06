<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UserAuthController extends Controller
{
  public function login(Request $request): JsonResponse
  {
    $response = Http::post(config('services.konovo.url') . '/' . LOGIN_ENDPOINT, [
      'username' => $request->input('username'),
      'password' => $request->input('password'),
    ]);

    if ($response->successful()) {
      $response_data = $response->json();

      if (!isset($response_data['token'])) {
        Log::error('No token found in the response.');
        return response()->json(['message' => 'Authentication failed'], 500);
      }

      return response()->json([
        'message' => 'Login successful',
      ])->cookie(
        'auth_token',
        $response_data['token'],
        60 * 24 * 2,
        '/',
        null,
        false,
        true,
        false,
        'strict'
      );
    }

    Log::error('Login failed: ' . $response->body());
    return response()->json(['message' => 'Invalid credentials'], 401);
  }

  public function logout(): JsonResponse
  {
    return response()->json([
      'message' => 'Logged out successfully',
    ])->cookie('auth_token', '', -1);
  }

  public function user(Request $request): JsonResponse
  {
    $token = $request->cookie('auth_token');

    if (!$token) {
      return response()->json(['authenticated' => false], 401);
    }

    return response()->json([
      'authenticated' => true,
    ]);
  }
}
