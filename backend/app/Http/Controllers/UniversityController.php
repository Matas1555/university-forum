<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;
use App\Models\University;
use App\Models\Status;
use App\Models\Program;

class UniversityController extends Controller
{
    // Fetch all universities
    public function getUniversities()
    {
        $universities = University::all();
        return response()->json($universities, 200);
    }

    // Fetch all faculties
    public function getFaculties($university_id)
    {
        $faculties = Faculty::where('university_id', $university_id)->get();
        return response()->json($faculties, 200);
    }

    // Fetch all statuses
    public function getStatuses()
    {
        $status = Status::all();
        return response()->json($status, 200);
    }

    // Fetch programs related to a specific university
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
        // Get all faculties for the university
        $faculties = Faculty::where('university_id', $university_id)->get();
        
        // Structure the response with programs nested within faculties
        $result = $faculties->map(function ($faculty) {
            // Get all programs for this faculty
            $programs = Program::where('faculty_id', $faculty->id)->get()->map(function ($program) {
                return [
                    'id' => $program->id,
                    'name' => $program->name,
                    'description' => $program->description,
                    'rating' => $program->rating,
                    'rating_count' => $program->rating_count,
                    'magistras' => $program->magistras,
                    'degree_type' => $program->magistras ? 'master' : 'bachelor',
                    'length' => $program->length,
                    'price' => $program->price,
                    'faculty_id' => $program->faculty_id,
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
