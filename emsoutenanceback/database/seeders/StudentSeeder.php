<?php

namespace Database\Seeders;

use App\Models\Professor;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les professeurs encadrants et rapporteurs
        $encadrants = Professor::whereHas('user', function ($query) {
            $query->where('type', 'encadrant');
        })->get();

        $rapporteurs = Professor::whereHas('user', function ($query) {
            $query->where('type', 'rapporteur');
        })->get();

        if ($encadrants->isEmpty() || $rapporteurs->isEmpty()) {
            $this->command->error('❌ Veuillez d\'abord créer les professeurs !');
            return;
        }

        $students = [
            [
                'name' => 'Youssef Alaoui',
                'email' => 'youssef.alaoui@student.emsoutenance.com',
                'matricule' => 'ST2024001',
                'filiere' => 'Informatique',
                'stage_type' => 'PFE',
                'phone' => '0612345678',
                'encadrant_index' => 0,
                'rapporteur_index' => 0,
            ],
            [
                'name' => 'Sara Benjelloun',
                'email' => 'sara.benjelloun@student.emsoutenance.com',
                'matricule' => 'ST2024002',
                'filiere' => 'Informatique',
                'stage_type' => 'PFE',
                'phone' => '0612345679',
                'encadrant_index' => 0,
                'rapporteur_index' => 1,
            ],
            [
                'name' => 'Mehdi El Amrani',
                'email' => 'mehdi.elamrani@student.emsoutenance.com',
                'matricule' => 'ST2024003',
                'filiere' => 'Réseaux et Télécommunications',
                'stage_type' => 'PFE',
                'phone' => '0612345680',
                'encadrant_index' => 1,
                'rapporteur_index' => 0,
            ],
            [
                'name' => 'Layla Tazi',
                'email' => 'layla.tazi@student.emsoutenance.com',
                'matricule' => 'ST2024004',
                'filiere' => 'Informatique',
                'stage_type' => 'stage_ete',
                'phone' => '0612345681',
                'encadrant_index' => 0,
                'rapporteur_index' => 1,
            ],
            [
                'name' => 'Omar Idrissi',
                'email' => 'omar.idrissi@student.emsoutenance.com',
                'matricule' => 'ST2024005',
                'filiere' => 'Développement Web',
                'stage_type' => 'PFE',
                'phone' => '0612345682',
                'encadrant_index' => 1,
                'rapporteur_index' => 1,
            ],
            [
                'name' => 'Hind Bennani',
                'email' => 'hind.bennani@student.emsoutenance.com',
                'matricule' => 'ST2024006',
                'filiere' => 'Informatique',
                'stage_type' => 'stage_ete',
                'phone' => '0612345683',
                'encadrant_index' => 0,
                'rapporteur_index' => 0,
            ],
        ];

        foreach ($students as $studentData) {
            $user = User::firstOrCreate(
                ['email' => $studentData['email']],
                [
                    'name' => $studentData['name'],
                    'email' => $studentData['email'],
                    'password' => Hash::make('student123'),
                    'role' => 'student',
                    'type' => null,
                ]
            );

            $encadrant = $encadrants[$studentData['encadrant_index'] % $encadrants->count()];
            $rapporteur = $rapporteurs[$studentData['rapporteur_index'] % $rapporteurs->count()];

            Student::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'user_id' => $user->id,
                    'matricule' => $studentData['matricule'],
                    'filiere' => $studentData['filiere'],
                    'stage_type' => $studentData['stage_type'],
                    'phone' => $studentData['phone'],
                    'encadrant_id' => $encadrant->id,
                    'rapporteur_id' => $rapporteur->id,
                ]
            );
        }

        $this->command->info('✅ ' . count($students) . ' étudiants créés avec succès !');
        $this->command->info('   Password pour tous: student123');
        $this->command->info('   Encadrants et rapporteurs assignés automatiquement.');
    }
}
