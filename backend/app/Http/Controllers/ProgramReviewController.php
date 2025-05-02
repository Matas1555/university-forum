<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\ProgramReview;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProgramReviewController extends Controller
{
    /**
     * Get all reviews for a specific program with pagination
     *
     * @param int $programId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getReviews($programId)
    {
        $program = Program::findOrFail($programId);
        $userId = Auth::id();

        $userReview = null;
        if ($userId) {
            $userReview = ProgramReview::where('program_id', $programId)
                ->where('user_id', $userId)
                ->with(['user:id,username,status_id,avatar'])
                ->with('user.status:id,name')
                ->first();
        }

        $otherReviews = ProgramReview::where('program_id', $programId)
            ->when($userId, function($query) use ($userId) {
                return $query->where('user_id', '!=', $userId);
            })
            ->with(['user:id,username,status_id,avatar'])
            ->with('user.status:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $formattedReviews = collect();

        if ($userReview) {
            $formattedReviews->push($this->formatReview($userReview));
        }

        foreach ($otherReviews as $review) {
            $formattedReviews->push($this->formatReview($review));
        }

        return response()->json($formattedReviews, 200);
    }

    /**
     * Format a review for response
     */
    private function formatReview($review)
    {
        $ratings = [];

        if ($review->course_content_rating !== null) {
            $ratings['course_content'] = $review->course_content_rating;
        }
        if ($review->practical_sessions_rating !== null) {
            $ratings['practical_sessions'] = $review->practical_sessions_rating;
        }
        if ($review->professional_skills_rating !== null) {
            $ratings['professional_skills'] = $review->professional_skills_rating;
        }
        if ($review->difficulty_rating !== null) {
            $ratings['difficulty'] = $review->difficulty_rating;
        }
        if ($review->student_community_rating !== null) {
            $ratings['student_community'] = $review->student_community_rating;
        }

        return [
            'id' => $review->id,
            'user' => [
                'id' => $review->user->id,
                'username' => $review->user->username,
                'status' => $review->user->status ? $review->user->status->name : null,
                'profilePic' => $review->user->avatar
            ],
            'date' => $review->created_at->format('Y-m-d'),
            'comment' => $review->comment,
            'ratings' => $ratings,
            'rating' => $review->overall_rating ?? null
        ];
    }

    /**
     * Create a new review for a program
     *
     * @param \Illuminate\Http\Request $request
     * @param int $programId
     * @return \Illuminate\Http\JsonResponse
     */
    public function createReview(Request $request, $programId)
    {
        $validator = Validator::make($request->all(), [
            'comment' => 'required_without:ratings|nullable|string',
            'ratings' => 'nullable|array',
            'ratings.*' => 'nullable|numeric|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $program = Program::findOrFail($programId);
        $userId = Auth::id();

        $existingReview = ProgramReview::where('program_id', $programId)
            ->where('user_id', $userId)
            ->first();

        if ($existingReview) {
            return response()->json([
                'error' => 'You have already reviewed this program',
                'existingReview' => $this->formatReview($existingReview)
            ], 422);
        }

        $review = new ProgramReview();
        $review->program_id = $programId;
        $review->user_id = $userId;
        $review->comment = $request->comment;
        
        // Process category ratings
        $validRatings = [];
        if (isset($request->ratings) && is_array($request->ratings) && count($request->ratings) > 0) {
            $ratings = $request->ratings;
            if (isset($ratings['course_content'])) {
                $review->course_content_rating = $ratings['course_content'];
                $validRatings[] = $ratings['course_content'];
            }
            if (isset($ratings['practical_sessions'])) {
                $review->practical_sessions_rating = $ratings['practical_sessions'];
                $validRatings[] = $ratings['practical_sessions'];
            }
            if (isset($ratings['professional_skills'])) {
                $review->professional_skills_rating = $ratings['professional_skills'];
                $validRatings[] = $ratings['professional_skills'];
            }
            if (isset($ratings['difficulty'])) {
                $review->difficulty_rating = $ratings['difficulty'];
                $validRatings[] = $ratings['difficulty'];
            }
            if (isset($ratings['student_community'])) {
                $review->student_community_rating = $ratings['student_community'];
                $validRatings[] = $ratings['student_community'];
            }
        }
        
        // Calculate the overall rating as the average of all category ratings
        if (count($validRatings) > 0) {
            $review->overall_rating = round(array_sum($validRatings) / count($validRatings), 1);
        } else {
            // If no ratings are provided, set overall_rating to null
            $review->overall_rating = null;
        }

        try {
            if (!$review->save()) {
                return response()->json(['error' => 'Failed to save review'], 500);
            }

            $this->updateProgramRatings($programId);

            $user = User::find($userId);
            $user->reputation += 10;
            if (!$user->save()) {
                \Log::error('Failed to update user reputation points', [
                    'user_id' => $userId,
                    'review_id' => $review->id
                ]);
            }

            return response()->json([
                'message' => 'Review created successfully',
                'review' => $this->formatReview($review)
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Error creating review', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
                'program_id' => $programId
            ]);

            return response()->json(['error' => 'Failed to create review: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update a program review
     *
     * @param \Illuminate\Http\Request $request
     * @param int $reviewId
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateReview(Request $request, $reviewId)
    {
        $validator = Validator::make($request->all(), [
            'comment' => 'required_without:ratings|nullable|string',
            'ratings' => 'nullable|array',
            'ratings.*' => 'nullable|numeric|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $userId = Auth::id();
        $review = ProgramReview::findOrFail($reviewId);

        if ($review->user_id !== $userId) {
            return response()->json(['error' => 'Unauthorized to update this review'], 403);
        }

        $review->comment = $request->comment;
        
        // Reset all category ratings first
        $review->course_content_rating = null;
        $review->practical_sessions_rating = null;
        $review->professional_skills_rating = null;
        $review->difficulty_rating = null;
        $review->student_community_rating = null;
        
        // Process category ratings
        $validRatings = [];
        if (isset($request->ratings) && is_array($request->ratings) && count($request->ratings) > 0) {
            $ratings = $request->ratings;
            if (isset($ratings['course_content'])) {
                $review->course_content_rating = $ratings['course_content'];
                $validRatings[] = $ratings['course_content'];
            }
            if (isset($ratings['practical_sessions'])) {
                $review->practical_sessions_rating = $ratings['practical_sessions'];
                $validRatings[] = $ratings['practical_sessions'];
            }
            if (isset($ratings['professional_skills'])) {
                $review->professional_skills_rating = $ratings['professional_skills'];
                $validRatings[] = $ratings['professional_skills'];
            }
            if (isset($ratings['difficulty'])) {
                $review->difficulty_rating = $ratings['difficulty'];
                $validRatings[] = $ratings['difficulty'];
            }
            if (isset($ratings['student_community'])) {
                $review->student_community_rating = $ratings['student_community'];
                $validRatings[] = $ratings['student_community'];
            }
        }
        
        // Calculate the overall rating as the average of all category ratings
        if (count($validRatings) > 0) {
            $review->overall_rating = round(array_sum($validRatings) / count($validRatings), 1);
        } else {
            // If no ratings are provided, set overall_rating to null
            $review->overall_rating = null;
        }

        try {
            if (!$review->save()) {
                return response()->json(['error' => 'Failed to update review'], 500);
            }

            $this->updateProgramRatings($review->program_id);

            return response()->json([
                'message' => 'Review updated successfully',
                'review' => $this->formatReview($review)
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Error updating review', [
                'error' => $e->getMessage(),
                'review_id' => $reviewId
            ]);

            return response()->json(['error' => 'Failed to update review'], 500);
        }
    }

    /**
     * Delete a program review
     *
     * @param int $reviewId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteReview($reviewId)
    {
        $userId = Auth::id();
        $review = ProgramReview::findOrFail($reviewId);

        if ($review->user_id !== $userId && !Auth::user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized to delete this review'], 403);
        }

        $programId = $review->program_id;

        try {
            if (!$review->delete()) {
                return response()->json(['error' => 'Failed to delete review'], 500);
            }

            $this->updateProgramRatings($programId);

            // Decrease user's reputation points
            $user = User::find($review->user_id);
            $user->reputation -= 5;
            if (!$user->save()) {
                \Log::error('Failed to update user reputation points after review deletion', [
                    'user_id' => $review->user_id,
                    'review_id' => $reviewId
                ]);
            }

            return response()->json([
                'message' => 'Review deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Error deleting review', [
                'error' => $e->getMessage(),
                'review_id' => $reviewId
            ]);

            return response()->json(['error' => 'Failed to delete review'], 500);
        }
    }

    /**
     * Check if a user has reviewed a program
     *
     * @param int $programId
     * @return \Illuminate\Http\JsonResponse
     */
    public function hasUserReviewed($programId)
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['hasReviewed' => false], 200);
        }

        $review = ProgramReview::where('program_id', $programId)
            ->where('user_id', $userId)
            ->first();

        return response()->json([
            'hasReviewed' => $review !== null,
            'review' => $review ? $this->formatReview($review) : null
        ], 200);
    }

    /**
     * Update program's average ratings based on all reviews
     */
    private function updateProgramRatings($programId)
    {
        $program = Program::findOrFail($programId);
        $reviews = ProgramReview::where('program_id', $programId)->get();

        if ($reviews->count() > 0) {
            $ratingFields = [
                'course_content_rating',
                'practical_sessions_rating',
                'professional_skills_rating',
                'difficulty_rating',
                'student_community_rating'
            ];

            foreach ($ratingFields as $field) {
                $average = $reviews->whereNotNull($field)->avg($field);
                $program->$field = $average;
            }

            // Calculate average of only non-null overall ratings
            $ratingsWithValues = $reviews->whereNotNull('overall_rating');
            if ($ratingsWithValues->count() > 0) {
                $program->rating = $ratingsWithValues->avg('overall_rating');
            } else {
                $program->rating = 0;
            }
            
            $program->rating_count = $reviews->count();
            $program->save();
        } else {
            $program->course_content_rating = null;
            $program->practical_sessions_rating = null;
            $program->professional_skills_rating = null;
            $program->difficulty_rating = null;
            $program->student_community_rating = null;
            $program->rating = 0;
            $program->rating_count = 0;
            $program->save();
        }
    }

    /**
     * Get average ratings by category for a program
     *
     * @param int $programId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategoryAverages($programId)
    {
        $program = Program::findOrFail($programId);

        $averages = [
            'course_content' => $program->course_content_rating,
            'practical_sessions' => $program->practical_sessions_rating,
            'professional_skills' => $program->professional_skills_rating,
            'difficulty' => $program->difficulty_rating,
            'student_community' => $program->student_community_rating
        ];

        return response()->json([
            'averages' => $averages,
            'overall' => $program->rating,
            'count' => $program->rating_count
        ], 200);
    }
}
