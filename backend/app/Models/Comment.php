<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Comment",
 *     type="object",
 *     title="Comment",
 *     description="Comment model",
 *     @OA\Property(property="id", type="integer", description="ID of the comment"),
 *     @OA\Property(property="text", type="string", description="The comment text"),
 *     @OA\Property(property="post_id", type="integer", description="ID of the post the comment is associated with"),
 *     @OA\Property(property="user_id", type="integer", description="ID of the user who made the comment"),
 *     @OA\Property(property="created_at", type="string", format="date-time", description="Comment creation timestamp"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", description="Comment last update timestamp")
 * )
 */
class Comment extends Model
{
    use HasFactory;

    protected $table = 'comments';
    protected $hidden = ['created_at', 'updated_at'];
    public $timestamps = true;

    protected $fillable = ['text', 'post_id', 'user_id'];

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
