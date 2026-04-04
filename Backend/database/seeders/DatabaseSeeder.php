<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Fauzi Adam',
            'email' => 'fauziadam0811@gmail.com',
            'password' => Hash::make('123456'),
        ]);

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('123456'),
            'role' => 'admin'
        ]);

        User::factory()->create([
            'name' => 'Manager',
            'email' => 'manager@gmail.com',
            'password' => Hash::make('123456'),
            'role' => 'manager'
        ]);
    }
}
