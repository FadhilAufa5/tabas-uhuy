<?php

use App\Models\BeritaAcara;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    
    $this->userRole = Role::firstOrCreate(['name' => 'user'], ['label' => 'User']);
    $this->user = User::factory()->create();
    $this->user->roles()->sync([$this->userRole->id]);
});

test('authenticated user can view berita acara page', function () {
    $response = $this->actingAs($this->user)->get(route('berita-acara.index'));
    $response->assertStatus(200);
});

test('user can create a new berita acara with file upload', function () {
    $file = UploadedFile::fake()->create('notas_dinas.pdf', 100, 'application/pdf');

    $response = $this->actingAs($this->user)->post(route('berita-acara.store'), [
        'nomor_berita_acara' => 'BA-TEST-001',
        'nama' => 'Budi Santoso',
        'permasalahan' => 'Kendala klaim pensiun',
        'solusi' => 'Verifikasi berkas manual',
        'status' => 'Selesai',
        'tanggal_kejadian' => '2026-08-31',
        'file_notas' => $file,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('berita_acara', [
        'nomor_berita_acara' => 'BA-TEST-001',
        'nama' => 'Budi Santoso',
    ]);

    $ba = BeritaAcara::where('nomor_berita_acara', 'BA-TEST-001')->first();
    expect($ba)->not->toBeNull();
    expect($ba->file_notas)->not->toBeNull();
    Storage::disk('public')->assertExists($ba->file_notas);
});

test('user can update berita acara', function () {
    $ba = BeritaAcara::create([
        'user_id' => $this->user->id,
        'nomor_berita_acara' => 'BA-UPDATE-001',
        'nama' => 'Nama Awal',
        'permasalahan' => 'Masalah Awal',
        'solusi' => 'Solusi Awal',
        'status' => 'Draft',
        'tanggal_kejadian' => '2026-08-31',
    ]);

    $response = $this->actingAs($this->user)->put(route('berita-acara.update', $ba), [
        'nomor_berita_acara' => 'BA-UPDATE-001',
        'nama' => 'Nama Terupdate',
        'permasalahan' => 'Masalah Terupdate',
        'solusi' => 'Solusi Terupdate',
        'status' => 'Selesai',
        'tanggal_kejadian' => '2026-08-31',
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('berita_acara', [
        'id' => $ba->id,
        'nama' => 'Nama Terupdate',
        'status' => 'Selesai',
    ]);
});

test('user can delete berita acara', function () {
    $ba = BeritaAcara::create([
        'user_id' => $this->user->id,
        'nomor_berita_acara' => 'BA-DEL-001',
        'nama' => 'Nama Hapus',
        'permasalahan' => 'Masalah',
        'solusi' => 'Solusi',
        'status' => 'Draft',
    ]);

    $response = $this->actingAs($this->user)->delete(route('berita-acara.destroy', $ba));
    $this->assertDatabaseMissing('berita_acara', ['id' => $ba->id]);
});
