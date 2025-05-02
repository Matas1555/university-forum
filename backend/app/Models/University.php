<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'location', 'picture', 'rating', 'rating_count', 'description'];
    protected $hidden = ['created_at', 'updated_at'];

    public function programs()
    {
        return $this->hasMany(Program::class, 'university_id');
    }

    public function faculties()
    {
        return $this->hasMany(Faculty::class, 'university_id');
    }

    public function forum()
    {
        return $this->hasOne(Forum::class, 'entity_id')
            ->where('entity_type', 'university');
    }

    public function profiles()
    {
        return $this->hasMany(Profile::class, "university_id");
    }

    public function lecturers()
    {
        return $this->hasMany(Lecturer::class, 'university_id');
    }

    public function reviews()
    {
        return $this->hasMany(UniversityReview::class, 'university_id');
    }

    public function clubs()
    {
        return $this->hasMany(UniversityClub::class, 'university_id');
    }
}
