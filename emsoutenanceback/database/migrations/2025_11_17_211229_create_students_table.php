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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('matricule')->unique();
            $table->string('filiere');
            $table->enum('stage_type', ['PFE', 'stage_ete']); 
            $table->string('phone')->nullable();
            $table->foreignId('encadrant_id')->nullable()->constrained('professors')->onDelete('set null');
            $table->foreignId('rapporteur_id')->nullable()->constrained('professors')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
