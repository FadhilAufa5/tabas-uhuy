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
        Schema::create('referensi_kasus', function (Blueprint $table) {
            $table->id();
            $table->string('kode_kasus')->nullable();
            $table->string('kategori')->default('Umum');
            $table->text('kasus');
            $table->text('penyelesaian');
            $table->text('aturan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referensi_kasus');
    }
};
