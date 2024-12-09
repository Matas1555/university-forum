<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = ['name', 'description'];
    protected $hidden = ['created_at', 'updated_at', 'timestamp'];

    public function users()
    {
        return $this->hasMany(User::class, 'role_id');
    }
}
