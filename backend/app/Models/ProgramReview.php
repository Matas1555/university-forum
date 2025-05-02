<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramReview extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'program_id',
        'comment',
        'overall_rating',
        'course_content_rating',
        'practical_sessions_rating',
        'professional_skills_rating',
        'difficulty_rating',
        'student_community_rating'
    ];
    
    protected $hidden = ['updated_at'];
    
    public function program()
    {
        return $this->belongsTo(Program::class, 'program_id');
    }
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function calculateOverallRating()
    {
        $ratings = [
            $this->course_content_rating,
            $this->practical_sessions_rating,
            $this->professional_skills_rating,
            $this->difficulty_rating,
            $this->student_community_rating
        ];
        
        $ratings = array_filter($ratings, function($rating) {
            return !is_null($rating);
        });
        
        if (count($ratings) > 0) {
            $this->overall_rating = round(array_sum($ratings) / count($ratings), 1);
            return $this->overall_rating;
        }
        
        $this->overall_rating = null;
        return null;
    }
} 