<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $table = 'profiles';
    protected $fillable = [
        'user_id',
        'bio',
        'avatar',
        'university',
        'yearOfGraduation',
        'status',
        'username'
    ];

    protected $casts = [
        'yearOfGraduation' => 'date',
    ];

    public function program()
    {
        return $this->belongsToMany(Program::class, 'profile_programs');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function university()
    {
        return $this->belongsTo(University::class);
    }



}
