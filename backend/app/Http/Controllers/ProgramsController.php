<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;

class ProgramsController extends Controller
{
    public function getPrograms()
    {
        $programs = Program::all();
        return $programs;
    }
}
