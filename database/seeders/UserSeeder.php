<?php

namespace Database\Seeders;


use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $faker = Faker::create();
        $users = [];

        foreach (range(1, 10) as $index) {
         $users[] = [
             'name' => $faker->name,
             'email' => $faker->unique()->email,
             'password' => bcrypt('password'),
         ];   
        }
    }
}
