<?php

namespace App\Http\Controllers;

use App\Models\Program;

class FacultyController
{
    // Fetch programs related to a specific faculty
    public function getPrograms($faculty_id)
    {
        $programs = Program::where('faculty_id', $faculty_id)->get();
        return response()->json($programs, 200);
    }
}
