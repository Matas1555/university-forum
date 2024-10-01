<?php

use App\Http\Controllers\Api\EntityController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureTokenIsValid;


Route::controller(AuthController::class)->group(function () {
    Route::get('/auth/login', 'login');
    Route::post('/auth/register', 'register');
    Route::get('/auth/logout', 'logout');
    Route::post('/auth/refresh', 'refresh');
});

//More Laravel way would be to just include Route::apiResource('entities', EntityController::class);
// this is done to include aliases to standard laravel path such as index -> to entity/list

Route::controller(EntityController::class)->group(function () {
    Route::get('entity/list','index');
    Route::post('entity/create', 'store');
    Route::get('entity/load', 'show');
    Route::post('entity/update', 'update');
    Route::get('entity/delete', 'destroy');
});
