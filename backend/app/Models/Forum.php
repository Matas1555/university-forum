<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Forum",
 *     type="object",
 *     title="Forum",
 *     description="Forum model",
 *     @OA\Property(property="id", type="integer", description="ID of the forum"),
 *     @OA\Property(property="title", type="string", description="Title of the forum"),
 *     @OA\Property(property="university_id", type="integer", description="ID of the university associated with the forum"),
 *     @OA\Property(property="created_at", type="string", format="date-time", description="Forum creation timestamp"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", description="Forum last update timestamp")
 * )
 */
class Forum extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'university_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $timestamps = true;

    public function university()
    {
        return $this->belongsTo(University::class, 'university_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'forum_id');
    }

}
