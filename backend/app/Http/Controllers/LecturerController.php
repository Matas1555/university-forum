<?php

namespace App\Http\Controllers;

use App\Models\Lecturer;
use App\Models\LecturerReview;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LecturerController extends Controller
{
    /**
     * Get all lecturers with optional filtering and pagination
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLecturers(Request $request)
    {
        // Get query parameters for filtering
        $search = $request->query('search', '');
        $universityId = $request->query('university_id');
        $facultyId = $request->query('faculty_id');
        $sortBy = $request->query('sort_by', 'overall_rating');
        $sortOrder = $request->query('sort_order', 'desc');
        $perPage = $request->query('per_page', 12);

        $query = Lecturer::select('id', 'name', 'profession', 'faculty_id', 'university_id', 'overall_rating')
                    ->with([
                        'university:id,name',
                        'faculty:id,name'
                    ]);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('profession', 'like', "%{$search}%");
            });
        }

        if ($universityId) {
            $query->where('university_id', $universityId);
        }

        if ($facultyId) {
            $query->where('faculty_id', $facultyId);
        }

        $validSortFields = ['name', 'overall_rating'];
        $sortBy = in_array($sortBy, $validSortFields) ? $sortBy : 'overall_rating';
        $sortOrder = $sortOrder === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $lecturers = $query->paginate($perPage);

        $transformedData = $lecturers->through(function ($lecturer) {
            return [
                'id' => $lecturer->id,
                'name' => $lecturer->name,
                'profession' => $lecturer->profession,
                'faculty' => $lecturer->faculty->name,
                'university' => $lecturer->university->name,
                'rating' => $lecturer->overall_rating,
                'faculty_id' => $lecturer->faculty_id,
                'university_id' => $lecturer->university_id
            ];
        });

        return response()->json($transformedData, 200);
    }

    public function getLecturer($id)
    {
        $lecturer = Lecturer::findOrFail($id);
        $userId = Auth::id();

        $reviews = $lecturer->reviews()
            ->with('user:id,username,status_id,avatar')
            ->with('user.status:id,name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($review) {
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
                    'ratings' => [
                        'friendliness_rating' => $review->friendliness_rating,
                        'availability_rating' => $review->availability_rating,
                        'lecture_quality_rating' => $review->lecture_quality_rating,
                    ]
                ];
            });
        
        if ($userId) {
            $userReview = $reviews->filter(function ($review) use ($userId) {
                return $review['user']['id'] === $userId;
            })->values();
            
            $otherReviews = $reviews->filter(function ($review) use ($userId) {
                return $review['user']['id'] !== $userId;
            })->values();
            
            $reviews = $userReview->merge($otherReviews);
        }

        $response = [
            'id' => $lecturer->id,
            'name' => $lecturer->name,
            'age' => $lecturer->age,
            'profession' => $lecturer->profession,
            'faculty' => $lecturer->faculty->name,
            'university' => $lecturer->university->name,
            'overallRating' => $lecturer->overall_rating,
            'ratings' => [
                'friendliness' => $lecturer->friendliness_rating,
                'clarity' => $lecturer->lecture_quality_rating,
                'availability' => $lecturer->availability_rating,
                'overall_rating' => $lecturer->overall_rating,
            ],
            'reviews' => $reviews
        ];

        return response()->json($response, 200);
    }

    public function getLecturersByFaculty($faculty_id)
    {
        $lecturers = Lecturer::where('faculty_id', $faculty_id)->get();
        return response()->json($lecturers, 200);
    }

    public function createReview(Request $request, $lecturer_id)
    {
        $validator = Validator::make($request->all(), [
            'comment' => 'required|string',
            'ratings' => 'nullable|array',
            'ratings.lecture_quality' => 'nullable|numeric|min:0|max:5',
            'ratings.availability' => 'nullable|numeric|min:0|max:5',
            'ratings.friendliness' => 'nullable|numeric|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lecturer = Lecturer::findOrFail($lecturer_id);
        $userId = Auth::id();

        // Check if the user has already reviewed this lecturer
        $existingReview = LecturerReview::where('lecturer_id', $lecturer_id)
            ->where('user_id', $userId)
            ->first();

        if ($existingReview) {
            return response()->json([
                'error' => 'You have already reviewed this lecturer',
            ], 422);
        }

        $review = new LecturerReview();
        $review->lecturer_id = $lecturer_id;
        $review->user_id = $userId;
        $review->comment = $request->comment;

        $ratings = $request->ratings ?? [];
        $review->lecture_quality_rating = $ratings['lecture_quality'] ?? null;
        $review->availability_rating = $ratings['availability'] ?? null;
        $review->friendliness_rating = $ratings['friendliness'] ?? null;

        $validRatings = array_filter([$review->lecture_quality_rating, $review->availability_rating, $review->friendliness_rating]);
        $review->overall_rating = count($validRatings) > 0 ? array_sum($validRatings) / count($validRatings) : null;

        $review->save();

        $this->updateLecturerRatings($lecturer_id);

        return response()->json(['message' => 'Review created successfully'], 201);
    }

    public function updateLecturer(Request $request, $id)
    {
        $lecturer = Lecturer::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:100',
            'age' => 'sometimes|required|integer',
            'profession' => 'sometimes|required|string|max:100',
            'faculty_id' => 'sometimes|required|exists:faculties,id',
            'university_id' => 'sometimes|required|exists:universities,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lecturer->update($request->all());

        return response()->json(['message' => 'Lecturer updated successfully'], 200);
    }

    private function updateLecturerRatings($lecturer_id)
    {
        $lecturer = Lecturer::findOrFail($lecturer_id);
        $reviews = LecturerReview::where('lecturer_id', $lecturer_id)->get();

        if ($reviews->count() > 0) {
            $lecturer->lecture_quality_rating = $reviews->avg('lecture_quality_rating');
            $lecturer->availability_rating = $reviews->avg('availability_rating');
            $lecturer->friendliness_rating = $reviews->avg('friendliness_rating');

            // Calculate overall rating only from non-null ratings
            $ratingSum = 0;
            $ratingCount = 0;

            if ($lecturer->lecture_quality_rating) {
                $ratingSum += $lecturer->lecture_quality_rating;
                $ratingCount++;
            }

            if ($lecturer->assessment_fairness_rating) {
                $ratingSum += $lecturer->assessment_fairness_rating;
                $ratingCount++;
            }

            if ($lecturer->availability_rating) {
                $ratingSum += $lecturer->availability_rating;
                $ratingCount++;
            }

            if ($lecturer->friendliness_rating) {
                $ratingSum += $lecturer->friendliness_rating;
                $ratingCount++;
            }

            $lecturer->overall_rating = $ratingCount > 0 ? $ratingSum / $ratingCount : null;
            $lecturer->rating_count = $reviews->count();
            $lecturer->save();
        }
    }

    public function getTopRatedLecturers()
    {
        $lecturers = Lecturer::select('id', 'name', 'university_id', 'overall_rating', 'rating_count')
            ->with('university:id,name')
            ->orderBy('overall_rating', 'desc')
            ->take(5)
            ->get()
            ->map(function ($lecturer) {
                return [
                    'id' => $lecturer->id,
                    'name' => $lecturer->name,
                    'university' => $lecturer->university->name,
                    'rating' => $lecturer->overall_rating,
                    'rating_count' => $lecturer->rating_count
                ];
            });

        return response()->json($lecturers, 200);
    }

    /**
     * Delete a lecturer review
     *
     * @param int $reviewId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteReview($reviewId)
    {
        $review = LecturerReview::findOrFail($reviewId);
        $userId = Auth::id();

        // Check if the user is authorized to delete this review
        if ($review->user_id !== $userId && !Auth::user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized to delete this review'], 403);
        }

        $lecturerId = $review->lecturer_id;

        try {
            $review->delete();

            // Update the lecturer's ratings after deletion
            $this->updateLecturerRatings($lecturerId);

            return response()->json(['message' => 'Review deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete review'], 500);
        }
    }
}
