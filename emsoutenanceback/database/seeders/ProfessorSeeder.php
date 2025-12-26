<?php

namespace Database\Seeders;

use App\Models\Professor;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProfessorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $professors = [
            [
                'name' => 'Prof. Ahmed Benali',
                'email' => 'ahmed.benali@emsoutenance.com',
                'password' => Hash::make('prof123'),
                'specialite' => 'Informatique',
                'phone' => '0661234567',
                'type' => 'encadrant',
            ],
            [
                'name' => 'Prof. Fatima Alaoui',
                'email' => 'fatima.alaoui@emsoutenance.com',
                'password' => Hash::make('prof123'),
                'specialite' => 'Réseaux et Télécommunications',
                'phone' => '0661234568',
                'type' => 'encadrant',
            ],
            [
                'name' => 'Prof. Hassan Idrissi',
                'email' => 'hassan.idrissi@emsoutenance.com',
                'password' => Hash::make('prof123'),
                'specialite' => 'Base de données',
                'phone' => '0661234569',
                'type' => 'rapporteur',
            ],
            [
                'name' => 'Prof. Aicha El Fassi',
                'email' => 'aicha.elfassi@emsoutenance.com',
                'password' => Hash::make('prof123'),
                'specialite' => 'Développement Web',
                'phone' => '0661234570',
                'type' => 'rapporteur',
            ],
            [
                'name' => 'Prof. Mohamed Amrani',
                'email' => 'mohamed.amrani@emsoutenance.com',
                'password' => Hash::make('prof123'),
                'specialite' => 'Intelligence Artificielle',
                'phone' => '0661234571',
                'type' => 'examinateur',
            ],
            [
                'name' => 'Prof. Nadia Berrada',
                'email' => 'nadia.berrada@emsoutenance.com',
                'password' => Hash::make('prof123'),
                'specialite' => 'Systèmes d\'Information',
                'phone' => '0661234572',
                'type' => 'president',
            ],
        ];

        foreach ($professors as $profData) {
            $user = User::firstOrCreate(
                ['email' => $profData['email']],
                [
                    'name' => $profData['name'],
                    'email' => $profData['email'],
                    'password' => $profData['password'],
                    'role' => 'professor',
                    'type' => $profData['type'],
                ]
            );

            Professor::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'user_id' => $user->id,
                    'specialite' => $profData['specialite'],
                    'phone' => $profData['phone'],
                ]
            );
        }

        $this->command->info('✅ ' . count($professors) . ' professeurs créés avec succès !');
        $this->command->info('   Password pour tous: prof123');
    }
}
