<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;

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
}
