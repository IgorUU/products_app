<?php

use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

const LOGIN_ENDPOINT = 'login';

Route::post('/login', function (Request $request) {
  $response = Http::post(config('services.konovo.url') . '/' . LOGIN_ENDPOINT, [
    'username' => $request->input('username'),
    'password' => $request->input('password'),
  ]);

  if ($response->successful()) {
    return response()->json([
      'token' => $response['token']
    ]);
  }

  Log::error('Login failed: ' . $response->body());
  return response()->json(['message' => 'Invalid credentials'], 401);
});

Route::get('/products', [ProductController::class, 'index']);
