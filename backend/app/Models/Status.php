<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    protected $table = 'status';
    protected $fillable = ['name'];
    protected $hidden = ['created_at', 'updated_at'];
    use HasFactory;

    public function profiles()
    {
        return $this->hasMany(Profile::class, 'status_id');
    }

}
