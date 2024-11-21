<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UniversityController;
use \App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureTokenIsValid;

Route::middleware([\Tymon\JWTAuth\Http\Middleware\Authenticate::class])->group(function() {
    // Admin routes - Admin can access these routes and all others
    Route::middleware([\App\Http\Middleware\RoleMiddleware::class . ':Admin'])->group(function () {
        Route::delete('/posts/{id}', [PostController::class, 'destroyPost']);
        Route::get('/forums', [PostController::class, 'getForums']);
    });

    // User-specific routes - Admin can also access these routes
    Route::middleware([\App\Http\Middleware\RoleMiddleware::class . ':User'])->group(function () {
        Route::get('/user', [\App\Http\Controllers\ProfileController::class, 'show']);
    });

    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);


    // Post CRUD routes
    Route::put('/posts/{id}', [PostController::class, 'updatePost']);
    Route::post('/posts', [PostController::class, 'insertPost']);

    // Forum CRUD routes
    Route::put('/forums/{id}', [PostController::class, 'updateForum']);
    Route::delete('/forums/{id}', [PostController::class, 'destroyForum']);
    Route::post('/forums', [PostController::class, 'insertForum']);

    // Comment CRUD routes
    Route::post('/comments', [PostController::class, 'insertComment']);
    Route::put('/comments/{id}', [PostController::class, 'updateComment']);
    Route::delete('/comments/{id}', [PostController::class, 'destroyComment']);

});

// Public routes (no authentication required)
Route::controller(AuthController::class)->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    Route::get('/test', 'test');


    Route::get('/comments', [PostController::class, 'getComments']);

    //Fourms CRUD
    Route::get('/forums/{forum_id}/posts', [PostController::class, 'getPostsByForum']);

    //Posts CRUD
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{id}', [PostController::class, 'showPost']);

    //University CRUD
    Route::get('/universities', [UniversityController::class, 'getUniversities']);
    Route::get('/statuses', [UniversityController::class, 'getStatuses']);
    Route::get('/universities/{id}/programs', [UniversityController::class, 'getPrograms']);
});
