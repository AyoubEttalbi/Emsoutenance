<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ai_feedback', function (Blueprint $table) {
            $table->json('grammar_samples')->nullable()->after('grammar_issues_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_feedback', function (Blueprint $table) {
            $table->dropColumn('grammar_samples');
        });
    }
};
