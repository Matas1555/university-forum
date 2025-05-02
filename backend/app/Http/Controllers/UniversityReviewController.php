<?php

namespace App\Http\Controllers;

use App\Models\University;
use App\Models\UniversityReview;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UniversityReviewController extends Controller
{
    /**
     * Get all reviews for a specific university with pagination
     *
     * @param int $universityId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getReviews($universityId)
    {
        $university = University::findOrFail($universityId);
        $userId = Auth::id();

        $userReview = null;
        if ($userId) {
            $userReview = UniversityReview::where('university_id', $universityId)
                ->where('user_id', $userId)
                ->with(['user:id,username,status_id,avatar'])
                ->with('user.status:id,name')
                ->first();
        }

        $otherReviews = UniversityReview::where('university_id', $universityId)
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

        if ($review->quality_rating !== null) {
            $ratings['quality'] = $review->quality_rating;
        }
        if ($review->facilities_rating !== null) {
            $ratings['facilities'] = $review->facilities_rating;
        }
        if ($review->opportunities_rating !== null) {
            $ratings['opportunities'] = $review->opportunities_rating;
        }
        if ($review->community_rating !== null) {
            $ratings['community'] = $review->community_rating;
        }
        if ($review->dormitories_rating !== null) {
            $ratings['dormitories'] = $review->dormitories_rating;
        }
        if ($review->events_rating !== null) {
            $ratings['events'] = $review->events_rating;
        }
        if ($review->cafeteria_rating !== null) {
            $ratings['cafeteria'] = $review->cafeteria_rating;
        }
        if ($review->library_rating !== null) {
            $ratings['library'] = $review->library_rating;
        }
        if ($review->sports_rating !== null) {
            $ratings['sports'] = $review->sports_rating;
        }
        if ($review->international_rating !== null) {
            $ratings['international'] = $review->international_rating;
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
            'overallRating' => $review->overall_rating
        ];
    }

    /**
     * Create a new review for a university
     *
     * @param \Illuminate\Http\Request $request
     * @param int $universityId
     * @return \Illuminate\Http\JsonResponse
     */
    public function createReview(Request $request, $universityId)
    {
        $validator = Validator::make($request->all(), [
            'comment' => 'nullable|string',
            'ratings' => 'nullable|array',
            'ratings.*' => 'required|numeric|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $university = University::findOrFail($universityId);
        $userId = Auth::id();

        $existingReview = UniversityReview::where('university_id', $universityId)
            ->where('user_id', $userId)
            ->first();

        if ($existingReview) {
            return response()->json([
                'error' => 'You have already reviewed this university',
                'existingReview' => $this->formatReview($existingReview)
            ], 422);
        }

        $review = new UniversityReview();
        $review->university_id = $universityId;
        $review->user_id = $userId;
        $review->comment = $request->comment;

        $ratings = $request->ratings ?? [];
        $totalRating = 0;
        $ratingCount = 0;

        foreach ($ratings as $category => $value) {
            $columnName = $category . '_rating';
            $review->$columnName = $value;
            $totalRating += $value;
            $ratingCount++;
        }

        $review->overall_rating = $ratingCount > 0 ? $totalRating / $ratingCount : null;

        try {
            if (!$review->save()) {
                return response()->json(['error' => 'Failed to save review'], 500);
            }

            $this->updateUniversityRatings($universityId);

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
                'university_id' => $universityId
            ]);

            return response()->json(['error' => 'Failed to create review'], 500);
        }
    }

    /**
     * Update university's average ratings based on all reviews
     */
    private function updateUniversityRatings($universityId)
    {
        $university = University::findOrFail($universityId);
        $reviews = UniversityReview::where('university_id', $universityId)->get();

        if ($reviews->count() > 0) {
            $ratingFields = [
                'quality_rating',
                'facilities_rating',
                'opportunities_rating',
                'community_rating',
                'dormitories_rating',
                'events_rating',
                'cafeteria_rating',
                'library_rating',
                'sports_rating',
                'international_rating'
            ];

            foreach ($ratingFields as $field) {
                $average = $reviews->whereNotNull($field)->avg($field);
                $university->$field = $average;
            }

            // Only consider reviews with overall_rating that is not null
            $ratingsCount = $reviews->whereNotNull('overall_rating')->count();
            if ($ratingsCount > 0) {
                $university->rating = $reviews->whereNotNull('overall_rating')->avg('overall_rating');
            } else {
                $university->rating = null;
            }

            $university->rating_count = $reviews->count();
            $university->save();
        }
    }

    /**
     * Get average ratings by category for a university
     *
     * @param int $universityId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategoryAverages($universityId)
    {
        $university = University::findOrFail($universityId);

        $averages = [
            'quality' => $university->quality_rating,
            'facilities' => $university->facilities_rating,
            'opportunities' => $university->opportunities_rating,
            'community' => $university->community_rating,
            'dormitories' => $university->dormitories_rating,
            'events' => $university->events_rating,
            'cafeteria' => $university->cafeteria_rating,
            'library' => $university->library_rating,
            'sports' => $university->sports_rating,
            'international' => $university->international_rating
        ];

        return response()->json([
            'averages' => $averages,
            'reviewCount' => $university->rating_count
        ]);
    }

    /**
     * Delete a university review
     *
     * @param int $reviewId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteReview($reviewId)
    {
        $userId = Auth::id();
        $review = UniversityReview::findOrFail($reviewId);

        if ($review->user_id !== $userId && !Auth::user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized to delete this review'], 403);
        }

        $universityId = $review->university_id;

        try {
            if (!$review->delete()) {
                return response()->json(['error' => 'Failed to delete review'], 500);
            }

            $this->updateUniversityRatings($universityId);

            $user = User::find($review->user_id);
            $user->reputation -= 10;
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
}
