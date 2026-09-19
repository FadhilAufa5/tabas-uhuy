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
        Schema::table('berita_acara', function (Blueprint $table) {
            $table->string('foto_dokumentasi')->nullable()->after('file_notas_size');
            $table->string('foto_dokumentasi_name')->nullable()->after('foto_dokumentasi');
            $table->unsignedBigInteger('foto_dokumentasi_size')->nullable()->after('foto_dokumentasi_name');
            $table->timestamp('waktu_dokumentasi')->nullable()->after('foto_dokumentasi_size');
            $table->text('catatan_dokumentasi')->nullable()->after('waktu_dokumentasi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('berita_acara', function (Blueprint $table) {
            $table->dropColumn([
                'foto_dokumentasi',
                'foto_dokumentasi_name',
                'foto_dokumentasi_size',
                'waktu_dokumentasi',
                'catatan_dokumentasi',
            ]);
        });
    }
};
