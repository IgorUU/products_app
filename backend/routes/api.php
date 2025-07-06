<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserAuthController;
use Illuminate\Support\Facades\Route;

const LOGIN_ENDPOINT = 'login';

Route::post('/login', [UserAuthController::class, 'login']);
Route::post('/logout', [UserAuthController::class, 'logout']);
Route::get('/user', [UserAuthController::class, 'user']);
Route::get('/products', [ProductController::class, 'index']);
