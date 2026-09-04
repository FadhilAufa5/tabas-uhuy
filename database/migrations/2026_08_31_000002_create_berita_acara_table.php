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
        Schema::create('berita_acara', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nomor_berita_acara')->unique();
            $table->string('nama');
            $table->text('permasalahan');
            $table->text('solusi');
            $table->string('file_notas')->nullable();
            $table->string('file_notas_name')->nullable();
            $table->unsignedBigInteger('file_notas_size')->nullable();
            $table->string('status')->default('Selesai');
            $table->date('tanggal_kejadian')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('berita_acara');
    }
};
