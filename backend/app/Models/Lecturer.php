<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lecturer extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'age',
        'profession',
        'faculty_id',
        'university_id',
        'overall_rating',
        'lecture_quality_rating',
        'friendliness_rating',
        'availability_rating',
        'rating_count'
    ];
    
    protected $hidden = ['created_at', 'updated_at'];

    public function university()
    {
        return $this->belongsTo(University::class, 'university_id');
    }
    
    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }
    
    public function reviews()
    {
        return $this->hasMany(LecturerReview::class, 'lecturer_id');
    }
    
    public function forum()
    {
        return $this->hasOne(Forum::class, 'entity_id')
            ->where('entity_type', 'lecturer');
    }
} 