<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'university_id',
        'faculty_id',
        'rating',
        'rating_count',
        'additional_information_link',
        'program_length',
        'student_count',
        'magistras',
        'yearly_cost',
        'course_content_rating',
        'practical_sessions_rating',
        'professional_skills_rating',
        'difficulty_rating',
        'student_community_rating'
    ];
    protected $hidden = ['created_at', 'updated_at'];

    public function profiles()
    {
        return $this->belongsToMany(Profile::class, 'profile_programs', 'program_id', 'profile_id');
    }

    public function university()
    {
        return $this->belongsTo(University::class, 'university_id');
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }

    public function forum()
    {
        return $this->hasOne(Forum::class, 'entity_id')
            ->where('entity_type', 'program');
    }

    public function reviews()
    {
        return $this->hasMany(ProgramReview::class, 'program_id');
    }
}
