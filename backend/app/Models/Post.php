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
        'user_id',
        'forum_id',
        'category_id',
        'likes',
        'dislikes',
        'views'
    ];

    protected $hidden = ['created_at', 'updated_at'];
    
    protected $attributes = [
        'likes' => 0,
        'dislikes' => 0,
        'views' => 0
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function forum()
    {
        return $this->belongsTo(Forum::class, 'forum_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'post_categories', 'post_id', 'category_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'post_id');
    }
}
