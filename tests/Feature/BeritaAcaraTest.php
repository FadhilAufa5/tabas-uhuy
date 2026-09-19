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
        'no_hp' => '081234567890',
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
        'no_hp' => '081234567890',
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
        'no_hp' => '081111111111',
        'permasalahan' => 'Masalah Awal',
        'solusi' => 'Solusi Awal',
        'status' => 'Draft',
        'tanggal_kejadian' => '2026-08-31',
    ]);

    $response = $this->actingAs($this->user)->put(route('berita-acara.update', $ba), [
        'nomor_berita_acara' => 'BA-UPDATE-001',
        'nama' => 'Nama Terupdate',
        'no_hp' => '082222222222',
        'permasalahan' => 'Masalah Terupdate',
        'solusi' => 'Solusi Terupdate',
        'status' => 'Selesai',
        'tanggal_kejadian' => '2026-09-01',
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('berita_acara', [
        'nomor_berita_acara' => 'BA-UPDATE-001',
        'nama' => 'Nama Terupdate',
        'no_hp' => '082222222222',
        'status' => 'Selesai',
    ]);
});

test('user can delete berita acara and it deletes stored files', function () {
    $file = UploadedFile::fake()->create('notas_to_delete.pdf', 100, 'application/pdf');

    $this->actingAs($this->user)->post(route('berita-acara.store'), [
        'nomor_berita_acara' => 'BA-DEL-FILE-001',
        'nama' => 'Nama Hapus File',
        'permasalahan' => 'Masalah',
        'solusi' => 'Solusi',
        'status' => 'Draft',
        'file_notas' => $file,
    ]);

    $ba = BeritaAcara::where('nomor_berita_acara', 'BA-DEL-FILE-001')->first();
    $filePath = $ba->file_notas;
    Storage::disk('public')->assertExists($filePath);

    $response = $this->actingAs($this->user)->delete(route('berita-acara.destroy', $ba));
    $response->assertSessionHasNoErrors();

    $this->assertDatabaseMissing('berita_acara', ['id' => $ba->id]);
    Storage::disk('public')->assertMissing($filePath);
});

test('user can upload and replace foto dokumentasi with automatic optimization', function () {
    $ba = BeritaAcara::create([
        'user_id' => $this->user->id,
        'nomor_berita_acara' => 'BA-DOK-001',
        'nama' => 'User Dok',
        'permasalahan' => 'Masalah Dok',
        'solusi' => 'Solusi Dok',
        'status' => 'Draft',
    ]);

    $image = UploadedFile::fake()->image('ttd_dokumen.jpg', 1200, 800);

    $response = $this->actingAs($this->user)->post(route('berita-acara.upload-dokumentasi', $ba), [
        'foto_dokumentasi' => $image,
        'catatan_dokumentasi' => 'Tanda tangan basah terverifikasi',
        'tandai_selesai' => true,
    ]);

    $response->assertSessionHasNoErrors();
    $ba->refresh();

    expect($ba->foto_dokumentasi)->not->toBeNull();
    expect($ba->foto_dokumentasi_name)->toBe('ttd_dokumen.jpg');
    expect($ba->status)->toBe('Selesai');
    Storage::disk('public')->assertExists($ba->foto_dokumentasi);

    $oldPath = $ba->foto_dokumentasi;

    // Upload a new photo to replace
    $newImage = UploadedFile::fake()->image('ttd_baru.png', 1000, 700);
    $response2 = $this->actingAs($this->user)->post(route('berita-acara.upload-dokumentasi', $ba), [
        'foto_dokumentasi' => $newImage,
        'catatan_dokumentasi' => 'Tanda tangan pembaruan',
    ]);

    $response2->assertSessionHasNoErrors();
    $ba->refresh();

    // Old photo should be cleaned up, new photo should exist
    Storage::disk('public')->assertMissing($oldPath);
    Storage::disk('public')->assertExists($ba->foto_dokumentasi);
});

test('user can delete foto dokumentasi and clean up physical storage', function () {
    $ba = BeritaAcara::create([
        'user_id' => $this->user->id,
        'nomor_berita_acara' => 'BA-DEL-DOK-001',
        'nama' => 'User Dok Delete',
        'permasalahan' => 'Masalah Dok',
        'solusi' => 'Solusi Dok',
        'status' => 'Selesai',
    ]);

    $image = UploadedFile::fake()->image('ttd_to_delete.jpg', 600, 400);

    $this->actingAs($this->user)->post(route('berita-acara.upload-dokumentasi', $ba), [
        'foto_dokumentasi' => $image,
    ]);

    $ba->refresh();
    $fotoPath = $ba->foto_dokumentasi;
    Storage::disk('public')->assertExists($fotoPath);

    $response = $this->actingAs($this->user)->delete(route('berita-acara.delete-dokumentasi', $ba));
    $response->assertSessionHasNoErrors();

    $ba->refresh();
    expect($ba->foto_dokumentasi)->toBeNull();
    expect($ba->foto_dokumentasi_name)->toBeNull();
    Storage::disk('public')->assertMissing($fotoPath);
});
