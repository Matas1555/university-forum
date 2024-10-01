<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'username' => 'taip',
            'email' => 'test@ktu.lt',
            'password' => Hash::make('Testing1'),
            'role' => '1',
        ]);

        DB::table('entities')->insert([
            'name' => 'TEntity',
            'date'  => '2023-01-01',
            'condition' => 1,
            'deletable' => 0
        ]);
    }
}
