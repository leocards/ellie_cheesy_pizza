<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'first_name' => 'Test User',
            'last_name' => 'Test User',
            'middle_name' => 'Test User',
            'birthdate' => '2020-03-23',
            'sex' => 'male',
            'address' => 'Test address',
            'email' => 'test@example.com',
            'mobile' => '09123425678',
            'role' => 'admin',
            'username' => '@testUser',
            'password' => Hash::make('12345678')
        ]);
    }
}
