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

        // Start building the query
        $query = Lecturer::select('id', 'name', 'profession', 'faculty_id', 'university_id', 'overall_rating')
                    ->with([
                        'university:id,name', 
                        'faculty:id,name'
                    ]);

        // Apply search filter if provided
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('profession', 'like', "%{$search}%");
            });
        }

        // Apply university filter if provided
        if ($universityId) {
            $query->where('university_id', $universityId);
        }

        // Apply faculty filter if provided
        if ($facultyId) {
            $query->where('faculty_id', $facultyId);
        }

        // Apply sorting
        $validSortFields = ['name', 'overall_rating'];
        $sortBy = in_array($sortBy, $validSortFields) ? $sortBy : 'overall_rating';
        $sortOrder = $sortOrder === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Paginate the results
        $lecturers = $query->paginate($perPage);

        // Transform the data to include university and faculty names
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
        
        $reviews = $lecturer->reviews()
            ->with('user:id,username,status_id,avatar')
            ->with('user.status:id,name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'user' => [
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
            'lecture_quality_rating' => 'required|numeric|min:0|max:5',
            'availability_rating' => 'required|numeric|min:0|max:5',
            'friendliness_rating' => 'required|numeric|min:0|max:5',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $lecturer = Lecturer::findOrFail($lecturer_id);
        
        $review = new LecturerReview();
        $review->lecturer_id = $lecturer_id;
        $review->user_id = Auth::id();
        $review->comment = $request->comment;
        $review->lecture_quality_rating = $request->lecture_quality_rating;
        $review->assessment_fairness_rating = $request->assessment_fairness_rating;
        $review->availability_rating = $request->availability_rating;
        $review->friendliness_rating = $request->friendliness_rating;
        $review->overall_rating = $request->overall_rating;
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
            

            $lecturer->overall_rating = ($lecturer->lecture_quality_rating + 
                                        $lecturer->assessment_fairness_rating + 
                                        $lecturer->availability_rating + 
                                        $lecturer->friendliness_rating) / 4;
                                        
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
} 