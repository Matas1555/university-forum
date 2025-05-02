<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\ProgramReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProgramsController extends Controller
{
    public function getPrograms()
    {
        $programs = Program::all();

        $programs->each(function ($program) {
            $program->university_name = $program->university->name;
            unset($program->university, $program->university_id);
        });

        return response()->json($programs,200);
    }

    public function getProgramDetails($id)
    {
        try {
            $program = Program::with(['university', 'faculty'])
                ->findOrFail($id);

            return response()->json([
                'id' => $program->id,
                'title' => $program->title,
                'description' => $program->description,
                'program_length' => $program->program_length,
                'degree_type' => $program->magistras ? "Magistras" : "Bakalauras",
                'rating' => $program->rating,
                'rating_count' => $program->rating_count,
                'additional_information_link' => $program->additional_information_link,
                'student_count' => $program->student_count,
                'yearly_cost' => $program->yearly_cost,
                'course_content_rating' => $program->course_content_rating,
                'practical_sessions_rating' => $program->practical_sessions_rating,
                'professional_skills_rating' => $program->professional_skills_rating,
                'difficulty_rating' => $program->difficulty_rating,
                'student_community_rating' => $program->student_community_rating,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Program not found: ' . $e->getMessage()], 404);
        }
    }

    public function getProgramReviews($id)
    {
        try {
            $program = Program::findOrFail($id);
            $userId = Auth::id();

            $userReview = null;
            if ($userId) {
                $userReview = ProgramReview::where('program_id', $id)
                    ->where('user_id', $userId)
                    ->with(['user:id,username,status_id,avatar'])
                    ->with('user.status:id,name')
                    ->first();
            }

            $otherReviews = ProgramReview::where('program_id', $id)
                ->when($userId, function($query) use ($userId) {
                    return $query->where('user_id', '!=', $userId);
                })
                ->with(['user:id,username,status_id,avatar'])
                ->with('user.status:id,name')
                ->orderBy('created_at', 'desc')
                ->get();

            $reviews = collect();

            if ($userReview) {
                $reviews->push($this->formatReview($userReview));
            }

            foreach ($otherReviews as $review) {
                $reviews->push($this->formatReview($review));
            }

            return response()->json($reviews, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error retrieving program reviews: ' . $e->getMessage()], 500);
        }
    }

    private function formatReview($review)
    {
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
            'rating' => $review->overall_rating,
            'course_content_rating' => $review->course_content_rating,
            'practical_sessions_rating' => $review->practical_sessions_rating,
            'professional_skills_rating' => $review->professional_skills_rating,
            'difficulty_rating' => $review->difficulty_rating,
            'student_community_rating' => $review->student_community_rating
        ];
    }
}
