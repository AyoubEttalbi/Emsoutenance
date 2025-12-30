<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            if (!Schema::hasColumn('reports', 'original_filename')) {
                $table->string('original_filename')->nullable()->after('file_path');
            }
            if (!Schema::hasColumn('reports', 'version')) {
                $table->string('version')->nullable()->after('original_filename');
            }
            if (!Schema::hasColumn('reports', 'status')) {
                $table->string('status')->default('pending')->after('version');
            }
            if (!Schema::hasColumn('reports', 'submitted_at')) {
                $table->timestamp('submitted_at')->nullable()->after('status');
            }
            if (!Schema::hasColumn('reports', 'validated_at')) {
                $table->timestamp('validated_at')->nullable()->after('submitted_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn(['original_filename', 'version', 'status', 'submitted_at', 'validated_at']);
        });
    }
};
