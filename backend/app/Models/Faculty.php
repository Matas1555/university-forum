<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;
    
    protected $fillable = ['name', 'university_id', 'abbreviation', 'description'];
    protected $hidden = ['created_at', 'updated_at'];

    public function university()
    {
        return $this->belongsTo(University::class, 'university_id');
    }

    public function programs()
    {
        return $this->hasMany(Program::class, 'faculty_id');
    }

    public function forum()
    {
        return $this->hasOne(Forum::class, 'entity_id')
            ->where('entity_type', 'faculty');
    }

    public function lecturers()
    {
        return $this->hasMany(Lecturer::class, 'faculty_id');
    }
} 