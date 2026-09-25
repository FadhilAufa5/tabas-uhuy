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
        Schema::table('referensi_kasus', function (Blueprint $table) {
            $table->string('lampiran')->nullable()->after('aturan');
            $table->string('lampiran_name')->nullable()->after('lampiran');
            $table->unsignedBigInteger('lampiran_size')->nullable()->after('lampiran_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('referensi_kasus', function (Blueprint $table) {
            $table->dropColumn(['lampiran', 'lampiran_name', 'lampiran_size']);
        });
    }
};
