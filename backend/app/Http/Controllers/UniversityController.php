<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;
use App\Models\University;
use App\Models\Status;
use App\Models\Program;

class UniversityController extends Controller
{
    public function getUniversities()
    {
        $universities = University::select([
            'id',
            'name',
            'description',
            'rating',
            'rating_count',
            'quality_rating',
            'facilities_rating',
            'opportunities_rating',
            'community_rating',
            'dormitories_rating',
            'events_rating',
            'cafeteria_rating',
            'library_rating',
            'sports_rating',
            'international_rating',
            'faculty_count',
            'program_count',
        ])->get();

        return response()->json($universities, 200);
    }

    public function getFaculties($university_id)
    {
        $faculties = Faculty::where('university_id', $university_id)->get();
        return response()->json($faculties, 200);
    }

    public function getStatuses()
    {
        $status = Status::all();
        return response()->json($status, 200);
    }

    public function getPrograms($university_id)
    {
        $programs = Program::where('university_id', $university_id)->get();
        return response()->json($programs, 200);
    }

    /**
     * Get a structured view of faculties with nested programs for a university
     *
     * @param int $university_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFacultiesWithPrograms($university_id)
    {
        $faculties = Faculty::where('university_id', $university_id)->get();

        $result = $faculties->map(function ($faculty) {
            $programs = Program::where('faculty_id', $faculty->id)
                ->get()
                ->map(function ($program) {
                    return [
                        'id' => $program->id,
                        'name' => $program->title,
                        'title' => $program->title,
                        'description' => $program->description,
                        'program_length' => $program->program_length,
                        'degree_type' => $program->magistras ? "Magistras" : "Bakalauras",
                        'rating' => $program->rating,
                        'rating_count' => $program->rating_count,
                        'additional_information_link' => $program->additional_information_link,
                        'student_count' => $program->student_count,
                        'faculty_id' => $program->faculty_id,
                        'university_id' => $program->university_id
                    ];
                });

            return [
                'id' => $faculty->id,
                'name' => $faculty->name,
                'abbreviation' => $faculty->abbreviation,
                'university_id' => $faculty->university_id,
                'programs' => $programs,
            ];
        });

        return response()->json($result, 200);
    }
}
