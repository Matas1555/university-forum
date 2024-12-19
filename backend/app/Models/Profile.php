<?php

namespace App\Models;

use GuzzleHttp\Psr7\Request;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Profile extends Model
{
    use HasFactory;

    protected $table = 'profiles';
    public $timestamps = true;
    protected $fillable = [
        'user_id',
        'bio',
        'avatar',
        'university_id',
        'yearOfGraduation',
        'status_id',
        'username'
    ];
    protected $hidden = ['created_at', 'updated_at'];

    public function getAvatarUrlAttribute()
    {
        return $this->avatar ? asset('storage/' . $this->avatar) : null;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function university()
    {
        return $this->belongsTo(University::class, 'university_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function programs()
    {
        return $this->belongsToMany(Program::class, 'profile_programs', 'profile_id', 'program_id');
    }

}
