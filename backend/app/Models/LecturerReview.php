<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LecturerReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'lecturer_id',
        'user_id',
        'comment',
        'overall_rating',
        'lecture_quality_rating',
        'availability_rating',
        'friendliness_rating'
    ];

    protected $hidden = ['updated_at'];

    public function lecturer()
    {
        return $this->belongsTo(Lecturer::class, 'lecturer_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
