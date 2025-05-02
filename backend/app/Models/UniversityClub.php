<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UniversityClub extends Model
{
    use HasFactory;

    protected $table = 'university_clubs';
    
    protected $fillable = [
        'university_id',
        'title',
        'description',
        'website_url'
    ];

    /**
     * Get the university that owns the club
     */
    public function university()
    {
        return $this->belongsTo(University::class);
    }
    
    /**
     * Get the forum posts associated with this club
     */
    public function forumPosts()
    {
        return $this->morphMany(ForumPost::class, 'postable');
    }
} 