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
 *     @OA\Property(property="entity_type", type="string", description="Type of entity this forum belongs to (university, faculty, program)"),
 *     @OA\Property(property="entity_id", type="integer", description="ID of the entity this forum belongs to"),
 *     @OA\Property(property="created_at", type="string", format="date-time", description="Forum creation timestamp"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", description="Forum last update timestamp")
 * )
 */
class Forum extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'entity_type', 'entity_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $timestamps = true;

    public function university()
    {
        return $this->morphedByMany(University::class, 'entity', 'forums', 'id', 'entity_id')
            ->where('entity_type', 'university');
    }

    public function faculty()
    {
        return $this->morphedByMany(Faculty::class, 'entity', 'forums', 'id', 'entity_id')
            ->where('entity_type', 'faculty');
    }

    public function program()
    {
        return $this->morphedByMany(Program::class, 'entity', 'forums', 'id', 'entity_id')
            ->where('entity_type', 'program');
    }

    public function lecturer()
    {
        return $this->morphedByMany(Lecturer::class, 'entity', 'forums', 'id', 'entity_id')
            ->where('entity_type', 'lecturer');
    }

    public function entity()
    {
        if ($this->entity_type === 'university') {
            return $this->belongsTo(University::class, 'entity_id');
        } elseif ($this->entity_type === 'faculty') {
            return $this->belongsTo(Faculty::class, 'entity_id');
        } elseif ($this->entity_type === 'program') {
            return $this->belongsTo(Program::class, 'entity_id');
        } elseif ($this->entity_type === 'lecturer') {
            return $this->belongsTo(Lecturer::class, 'entity_id');
        }
        return null;
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'forum_id');
    }
}
