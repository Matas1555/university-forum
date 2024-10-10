<?php

namespace App\Http\Controllers;

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

    // Fetch all statuses
    public function getStatuses()
    {
        $status = Status::all();
        return response()->json($status, 200);
    }

    // Fetch programs related to a specific university
    public function getPrograms($university_id)
    {
        $programs = Program::where('university', $university_id)->get();
        return response()->json($programs, 200);
    }
}
