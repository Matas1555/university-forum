<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'description', 'university'];

    public function profiles()
    {
        return $this->belongsToMany(Profile::class, 'profile_programs');
    }

    public function university()
    {
        return $this->belongsTo(University::class);
    }
}
