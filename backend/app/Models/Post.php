<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        'title',
        'description',
        'university',
        'user',
        'forum',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user');
    }

    public function forum()
    {
        return $this->belongsTo(Forum::class, 'forum');
    }

    public function university()
    {
        return $this->belongsTo(University::class, 'university');
    }
}
