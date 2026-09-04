<?php

use App\Models\ReferensiKasus;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;

beforeEach(function () {
    $this->userRole = Role::firstOrCreate(['name' => 'user'], ['label' => 'User']);
    $this->user = User::factory()->create();
    $this->user->roles()->sync([$this->userRole->id]);
});

test('user can view referensi kasus page', function () {
    $response = $this->actingAs($this->user)->get(route('referensi-kasus.index'));
    $response->assertStatus(200);
});

test('user can create referensi kasus', function () {
    $response = $this->actingAs($this->user)->post(route('referensi-kasus.store'), [
        'kode_kasus' => 'KS-TEST-99',
        'kategori' => 'Klaim',
        'kasus' => 'Kasus uji coba klaim',
        'penyelesaian' => 'Langkah solusi uji coba',
        'aturan' => 'PP No. 70 Tahun 2015',
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('referensi_kasus', [
        'kode_kasus' => 'KS-TEST-99',
        'kasus' => 'Kasus uji coba klaim',
    ]);
});

test('user can import csv referensi kasus', function () {
    $csvContent = "kode_kasus,kategori,kasus,penyelesaian,aturan\nKS-CSV-1,Pensiun,Kasus CSV 1,Solusi CSV 1,Aturan CSV 1\nKS-CSV-2,Teknis,Kasus CSV 2,Solusi CSV 2,Aturan CSV 2";
    $file = UploadedFile::fake()->createWithContent('referensi.csv', $csvContent);

    $response = $this->actingAs($this->user)->post(route('referensi-kasus.import-csv'), [
        'file_csv' => $file,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('referensi_kasus', [
        'kode_kasus' => 'KS-CSV-1',
        'kasus' => 'Kasus CSV 1',
    ]);
    $this->assertDatabaseHas('referensi_kasus', [
        'kode_kasus' => 'KS-CSV-2',
        'kasus' => 'Kasus CSV 2',
    ]);
});

test('user can export csv referensi kasus', function () {
    ReferensiKasus::create([
        'kode_kasus' => 'KS-EXP-01',
        'kategori' => 'Klaim',
        'kasus' => 'Kasus Export',
        'penyelesaian' => 'Solusi Export',
        'aturan' => 'Aturan Export',
    ]);

    $response = $this->actingAs($this->user)->get(route('referensi-kasus.export-csv'));
    $response->assertStatus(200);
    $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
});
