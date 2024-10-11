<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UniversityController;
use \App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/logout',[AuthController::class,'logout']);

});

Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::get('/test', "test");
});

Route::controller(UniversityController::class)->group(function () {
    Route::get('/universities', [UniversityController::class, 'getUniversities']);
    Route::get('/statuses', [UniversityController::class, 'getStatuses']);
    Route::get('/universities/{id}/programs', [UniversityController::class, 'getPrograms']);
});

// Post CRUD
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'showPost']);
Route::put('/posts/{id}', [PostController::class, 'updatePost']);
Route::delete('/posts/{id}', [PostController::class, 'destroyPost']);
Route::post('/posts', [PostController::class, 'insertPost']);

// Forum CRUD
Route::get('/forums', [PostController::class, 'getForums']);
Route::get('/forums/{forum_id}/posts', [PostController::class, 'getPostsByForum']);
Route::put('/forums/{id}', [PostController::class, 'updateForum']);
Route::delete('/forums/{id}', [PostController::class, 'destroyForum']);
Route::post('/forums', [PostController::class, 'insertForum']);

// Comment CRUD
Route::get('/comments', [PostController::class, 'getComments']);
Route::post('/comments', [PostController::class, 'insertComment']);
Route::put('/comments/{id}', [PostController::class, 'updateComment']);
Route::delete('/comments/{id}', [PostController::class, 'destroyComment']);
