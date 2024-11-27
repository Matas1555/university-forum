<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'description', 'university_id'];

    public function profiles()
    {
        return $this->belongsToMany(Profile::class, 'profile_programs', 'program_id', 'profile_id');
    }

    public function university()
    {
        return $this->belongsTo(University::class, 'university_id');
    }
}
