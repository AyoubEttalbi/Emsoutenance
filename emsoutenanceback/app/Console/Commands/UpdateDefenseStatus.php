<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Defense;

class UpdateDefenseStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'defense:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mettre à jour le statut des soutenances passées de "scheduled" à "completed"';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Mise à jour des statuts des soutenances...');

        $updated = Defense::where('status', 'scheduled')
            ->where('scheduled_at', '<', now())
            ->update(['status' => 'completed']);

        $this->info("✓ {$updated} soutenance(s) mise(s) à jour.");

        return Command::SUCCESS;
    }
}
