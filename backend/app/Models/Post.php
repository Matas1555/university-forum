<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Post",
 *     type="object",
 *     title="Post",
 *     description="Post model",
 *     @OA\Property(property="id", type="integer", description="ID of the post"),
 *     @OA\Property(property="title", type="string", description="Title of the post"),
 *     @OA\Property(property="description", type="string", description="Description of the post"),
 *     @OA\Property(property="forum_id", type="integer", description="ID of the forum associated with the post"),
 *     @OA\Property(property="university_id", type="integer", description="ID of the university associated with the post"),
 *     @OA\Property(property="user_id", type="integer", description="ID of the user who created the post"),
 *     @OA\Property(property="created_at", type="string", format="date-time", description="Post creation timestamp"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", description="Post last update timestamp")
 * )
 */
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
