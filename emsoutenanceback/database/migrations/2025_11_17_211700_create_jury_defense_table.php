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
        Schema::create('jury_defense', function (Blueprint $table) {
            $table->id();
            $table->foreignId('defense_id')->constrained()->onDelete('cascade');
            $table->foreignId('professor_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['encadrant', 'rapporteur', 'examinateur', 'president']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jury_defense');
    }
};

