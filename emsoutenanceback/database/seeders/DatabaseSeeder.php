<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Début du seeding...');
        
        // 1. Créer l'administrateur
        $this->call(AdminSeeder::class);
        
        // 2. Créer les professeurs
        $this->call(ProfessorSeeder::class);
        
        // 3. Créer les étudiants (nécessite les professeurs)
        $this->call(StudentSeeder::class);
        
        $this->command->info('');
        $this->command->info('✅ Seeding terminé avec succès !');
        $this->command->info('');
        $this->command->info('📋 Identifiants de connexion :');
        $this->command->info('   👨‍💼 Admin: admin@emsoutenance.com / admin123');
        $this->command->info('   👨‍🏫 Professeurs: [email]@emsoutenance.com / prof123');
        $this->command->info('   👨‍🎓 Étudiants: [email]@student.emsoutenance.com / student123');
    }
}
