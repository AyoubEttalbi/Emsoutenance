<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ai_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->constrained()->onDelete('cascade');
            $table->integer('grammar_issues_count');
            $table->text('ai_feedback');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_feedback');
    }
};
