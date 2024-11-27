<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UniversityController;
use \App\Http\Controllers\PostController;
use \App\Http\Controllers\ProfileController;
use \App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureTokenIsValid;
use Illuminate\Support\Facades\DB;

// Public routes (no authentication required)
Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/refresh-token', 'refreshToken');
    Route::get('/test', 'test');
});


Route::get('/posts', [PostController::class, 'getPosts']); // View all posts (guest, user, etc.)
Route::get('/posts/{id}', [PostController::class, 'showPost']); // View a specific post
Route::get('/forums/{forum_id}/posts', [PostController::class, 'getPostsByForum']); // View posts by forum
Route::get('/forums', [PostController::class, 'getForums']); // View forums
Route::get('/comments', [PostController::class, 'getComments']); // View all comments
Route::get('/universities', [UniversityController::class, 'getUniversities']); // View universities
Route::get('/statuses', [UniversityController::class, 'getStatuses']); // View statuses
Route::get('/universities/{id}/programs', [UniversityController::class, 'getPdrograms']); // View programs
Route::post('/refresh-token', [AuthController::class, 'refreshToken']); // Refresh token
Route::get('/users', [\App\Http\Controllers\UserController::class, 'getUsers']); // View users
Route::get('/categories', [CategoryController::class, 'getCategories']); // View categories
Route::get('/programs', [\App\Http\Controllers\ProgramsController::class, 'getPrograms']); // View programs
Route::get('/roles', [\App\Http\Controllers\RolesController::class, 'getRoles']); // View roles
Route::get('/status', [\App\Http\Controllers\StatusController::class, 'getStatus']); // View status
Route::get('/tables/{table}/columns', function ($table) { //return the columns of a table
    try {
        $columns = DB::getSchemaBuilder()->getColumnListing($table);

        $excludedColumns = ['created_at', 'updated_at', 'password'];
        $filteredColumns = array_filter($columns, function ($column) use ($excludedColumns) {
            return !in_array($column, $excludedColumns);
        });

        return response()->json(['columns' => array_values($filteredColumns)]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Table not found'], 404);
    }
});




// Routes that require authentication
Route::middleware('auth:api')->group(function () {

    // User-specific routes
    Route::post('/logout', [AuthController::class, 'logout']); // Logout

    // Post routes
    Route::post('/posts', [PostController::class, 'insertPost']); // Create a new post
    Route::put('/posts/{post}', [PostController::class, 'updatePost']); // Update a post
    Route::delete('/posts/{post}', [PostController::class, 'destroyPost']); // Delete a post

    // Comment routes
    Route::post('/comments', [PostController::class, 'insertComment']); // Create a new comment
    Route::put('/comments/{comment}', [PostController::class, 'updateComment']); // Update a comment
    Route::delete('/comments/{comment}', [PostController::class, 'destroyComment']); // Delete a comment

    // Forum routes
    Route::post('/forums', [PostController::class, 'insertForum']); // Create a new forum
    Route::put('/forums/{forum}', [PostController::class, 'updateForum']); // Update a forum
    Route::delete('/forums/{forum}', [PostController::class, 'destroyForum']); // Delete a forum

    // University routes
    Route::post('/universities', [UniversityController::class, 'createUniversity']); // Create a new university
    Route::put('/universities/{university}', [UniversityController::class, 'updateUniversity']); // Update a university
    Route::delete('/universities/{university}', [UniversityController::class, 'destroyUniversity']); // Delete a university

    // Profile routes
    Route::put('/profiles/{user}', [ProfileController::class, 'update']); // Update a user's profile
    Route::delete('/profiles/{user}', [ProfileController::class, 'destroy']); // Delete a user's profile

    // User routes
    Route::put('/users/{user}', [UserController::class, 'updateUser']);
    Route::delete('/users/{user}', [UserController::class, 'deleteUser']);

    //Category routes
    Route::put('/categories/{category}', [CategoryController::class, 'updateCategory']);
    Route::post('/categories', [CategoryController::class, 'insertCategory']);
    Route::delete('/categories/{category}', [CategoryController::class, 'deleteCategory']);

});
