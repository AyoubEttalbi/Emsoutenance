<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('defenses', function (Blueprint $table) {
            // Supprimer la contrainte foreign key existante
            $table->dropForeign(['report_id']);
        });

        // Modifier la colonne pour la rendre nullable
        Schema::table('defenses', function (Blueprint $table) {
            $table->unsignedBigInteger('report_id')->nullable()->change();
        });

        // Réajouter la contrainte foreign key avec onDelete('set null')
        Schema::table('defenses', function (Blueprint $table) {
            $table->foreign('report_id')->references('id')->on('reports')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('defenses', function (Blueprint $table) {
            // Supprimer la contrainte foreign key
            $table->dropForeign(['report_id']);
        });

        // Remettre la colonne comme non nullable
        Schema::table('defenses', function (Blueprint $table) {
            $table->unsignedBigInteger('report_id')->nullable(false)->change();
        });

        // Réajouter la contrainte foreign key avec onDelete('cascade')
        Schema::table('defenses', function (Blueprint $table) {
            $table->foreign('report_id')->references('id')->on('reports')->onDelete('cascade');
        });
    }
};

