<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@emsoutenance.com'],
            [
                'name' => 'Administrateur',
                'email' => 'admin@emsoutenance.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'type' => null,
            ]
        );

        $this->command->info('✅ Administrateur créé avec succès !');
        $this->command->info('   Email: admin@emsoutenance.com');
        $this->command->info('   Password: admin123');
    }
}
