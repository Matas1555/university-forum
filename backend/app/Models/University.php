<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'location', 'picture'];

    public function programs()
    {
        return $this->hasMany(Program::class, 'university_id');
    }

    public function forum()
    {
        return $this->hasOne(Forum::class, 'university_id');
    }

    public function profiles()
    {
        return $this->hasMany(Profile::class, "university_id");
    }
}
