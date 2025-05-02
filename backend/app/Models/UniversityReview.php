<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UniversityReview extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'university_id',
        'comment',
        'overall_rating',
        'quality_rating',
        'facilities_rating',
        'opportunities_rating',
        'community_rating',
        'dormitories_rating',
        'events_rating',
        'cafeteria_rating',
        'library_rating',
        'sports_rating',
        'international_rating'
    ];
    
    protected $hidden = ['updated_at'];
    
    public function university()
    {
        return $this->belongsTo(University::class, 'university_id');
    }
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function calculateOverallRating()
    {
        $ratings = [
            $this->quality_rating,
            $this->facilities_rating,
            $this->opportunities_rating,
            $this->community_rating,
            $this->dormitories_rating,
            $this->events_rating,
            $this->cafeteria_rating,
            $this->library_rating,
            $this->sports_rating,
            $this->international_rating
        ];
        
        $ratings = array_filter($ratings, function($rating) {
            return !is_null($rating);
        });
        
        if (count($ratings) > 0) {
            return round(array_sum($ratings) / count($ratings), 1);
        }
        
        return null;
    }
} 