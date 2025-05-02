<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UniversityController;
use \App\Http\Controllers\PostController;
use \App\Http\Controllers\ProfileController;
use \App\Http\Controllers\UserController;
use \App\Http\Controllers\FacultyController;
use \App\Http\Controllers\ProgramsController;
use App\Http\Controllers\RecommendationController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureTokenIsValid;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\LecturerController;
use App\Http\Controllers\UniversityReviewController;
use App\Http\Controllers\ProgramReviewController;

// Public routes (no authentication required)
Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/refresh-token', 'refreshToken');
    Route::get('/test', 'test');
});


Route::get('/posts', [PostController::class, 'getPosts']); // View all posts (guest, user, etc.)
Route::get('/postsExtended', [PostController::class, 'getPostsExtended']); // View all posts with additional information (guest, user, etc.)
Route::get('/posts/{id}', [PostController::class, 'showPost']); // View a specific post
Route::get('/posts/{post_id}/comments', [PostController::class, 'getPostComments']); // View comments for a specific post
Route::get('/forums/{forum_id}/posts', [PostController::class, 'getPostsByForum']); // View posts by forum
Route::get('/forums', [PostController::class, 'getForums']); // View forums
Route::get('/comments', [PostController::class, 'getComments']); // View all comments
Route::get('/universities', [UniversityController::class, 'getUniversities']); // View universities
Route::get('/universities/{id}/faculties', [UniversityController::class, 'getFaculties']); // View faculties
Route::get('/universities/{id}/faculties-with-programs', [UniversityController::class, 'getFacultiesWithPrograms']); // View faculties with nested programs
Route::get('/statuses', [UniversityController::class, 'getStatuses']); // View statuses
Route::get('/faculties/{id}/programs', [FacultyController::class, 'getPrograms']); // View programs
Route::post('/recommendations/filter', [RecommendationController::class, 'filterPrograms']); // Filter programs based on user preferences
// AI-powered recommendations routes
Route::post('/recommendations/ai', [RecommendationController::class, 'getAIRecommendations']);
Route::get('/programs/{id}/orientation-analysis', [RecommendationController::class, 'analyzeProgramOrientation']);
Route::post('/activities/analyze-relevance', [RecommendationController::class, 'analyzeActivitiesRelevance']);

Route::post('/refresh-token', [AuthController::class, 'refreshToken']); // Refresh token
Route::get('/users', [\App\Http\Controllers\UserController::class, 'getUsers']); // View users
Route::get('/categories', [CategoryController::class, 'getCategories']); // View categories
Route::get('/roles', [\App\Http\Controllers\RolesController::class, 'getRoles']); // View roles
Route::get('/status', [\App\Http\Controllers\StatusController::class, 'getStatus']); // View status
Route::get('/programs/{id}', [\App\Http\Controllers\ProgramsController::class, 'getProgramDetails']); //View program
Route::get('/programs/{id}/reviews', [ProgramsController::class, 'getProgramReviews']); // Get reviews for a program
Route::get('/programs/{id}/category-averages', [ProgramReviewController::class, 'getCategoryAverages']); // Get program rating averages by category
Route::get('/lecturers', [LecturerController::class, 'getLecturers']); // Get all lecturers
Route::get('/lecturers/top-rated', [LecturerController::class, 'getTopRatedLecturers']);
Route::get('/lecturers/{id}', [LecturerController::class, 'getLecturer']); // Get specific lecturer with reviews
Route::get('/faculties/{id}/lecturers', [LecturerController::class, 'getLecturersByFaculty']); // Get lecturers by faculty
Route::get('/profiles', [ProfileController::class, 'getProfiles']); // View profiles
Route::get('/universities/{id}/reviews', [UniversityReviewController::class, 'getReviews']); // Get reviews for a university
Route::get('/universities/{id}/category-averages', [UniversityReviewController::class, 'getCategoryAverages']); // Get rating averages by category
Route::post('/user/avatar', [ProfileController::class, 'uploadAvatar']);
Route::get('/user/avatar', [ProfileController::class, 'getAvatar']);
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
    Route::post('/posts/{post}/like', [PostController::class, 'like']); //Likes a post
    Route::post('/posts/{post}/dislike', [PostController::class, 'dislike']); //Dislikes a post
    Route::get('/user/post-interactions', [PostController::class, 'getUserPostInteractions']); // Get user's post interactions

    // Post routes
    Route::post('/posts', [PostController::class, 'insertPost']); // Create a new post
    Route::put('/posts/{post}', [PostController::class, 'updatePost']); // Update a post
    Route::delete('/posts/{post}', [PostController::class, 'destroyPost']); // Delete a post

    // Comment routes
    Route::post('/comments', [PostController::class, 'insertComment']); // Create a new comment
    Route::put('/comments/{comment}', [PostController::class, 'updateComment']); // Update a comment
    Route::delete('/comments/{comment}', [PostController::class, 'destroyComment']); // Delete a comment
    Route::post('/comments/{id}/like', [PostController::class, 'likeComment']);
    Route::post('/comments/{id}/dislike', [PostController::class, 'dislikeComment']);
    Route::get('/user/comment-interactions', [PostController::class, 'getUserCommentInteractions']);

    // Forum routes
    Route::post('/forums', [PostController::class, 'insertForum']); // Create a new forum
    Route::put('/forums/{forum}', [PostController::class, 'updateForum']); // Update a forum
    Route::delete('/forums/{forum}', [PostController::class, 'destroyForum']); // Delete a forum

    // University routes
    Route::post('/universities', [UniversityController::class, 'createUniversity']); // Create a new university
    Route::put('/universities/{university}', [UniversityController::class, 'updateUniversity']); // Update a university
    Route::delete('/universities/{university}', [UniversityController::class, 'destroyUniversity']); // Delete a university

    // Profile routes
    Route::put('/profiles/{user}', [ProfileController::class, 'updateProfile']); // Update a user's profile
    Route::delete('/profiles/{user}', [ProfileController::class, 'destroyProfile']); // Delete a user's profile

    // User routes
    Route::put('/users/{user}', [UserController::class, 'updateUser']); // Update user
    Route::delete('/users/{user}', [UserController::class, 'deleteUser']); // Delete user

    //Category routes
    Route::put('/categories/{category}', [CategoryController::class, 'updateCategory']);
    Route::post('/categories', [CategoryController::class, 'insertCategory']);
    Route::delete('/categories/{category}', [CategoryController::class, 'deleteCategory']);

    // Lecturer auth routes
    Route::post('/lecturers/{id}/reviews', [LecturerController::class, 'createReview']); // Create a review for a lecturer
    Route::put('/lecturers/{id}', [LecturerController::class, 'updateLecturer']); // Update a lecturer
    Route::delete('/lecturer-reviews/{id}', [LecturerController::class, 'deleteReview']); // Delete a lecturer review

    // University reviews routes
    Route::middleware('auth:api')->post('/universities/{id}/reviews', [UniversityReviewController::class, 'createReview']); // Create a review
    Route::delete('/university-reviews/{id}', [UniversityReviewController::class, 'deleteReview']); // Delete a university review

    // Program reviews routes
    Route::post('/programs/{id}/reviews', [ProgramReviewController::class, 'createReview']); // Create a program review
    Route::put('/program-reviews/{id}', [ProgramReviewController::class, 'updateReview']); // Update a program review
    Route::delete('/program-reviews/{id}', [ProgramReviewController::class, 'deleteReview']); // Delete a program review
    Route::get('/programs/{id}/user-reviewed', [ProgramReviewController::class, 'hasUserReviewed']); // Check if user has reviewed

});
