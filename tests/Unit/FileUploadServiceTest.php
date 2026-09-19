<?php

use App\Services\FileUploadService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

uses(TestCase::class);

beforeEach(function () {
    Storage::fake('public');
    $this->service = new FileUploadService;
});

test('it can upload a regular file with date-based partitioning', function () {
    $file = UploadedFile::fake()->create('dokumen_notas.pdf', 150, 'application/pdf');

    $result = $this->service->uploadFile($file, 'notas');

    expect($result)->toHaveKeys(['path', 'name', 'size', 'mime_type', 'disk']);
    expect($result['name'])->toBe('dokumen_notas.pdf');
    expect($result['disk'])->toBe('public');
    expect($result['mime_type'])->toBe('application/pdf');
    expect($result['path'])->toStartWith('notas/'.date('Y').'/'.date('m').'/');

    Storage::disk('public')->assertExists($result['path']);
});

test('it can upload and compress an image', function () {
    // Generate a fake image
    $file = UploadedFile::fake()->image('dokumentasi.jpg', 800, 600);

    $result = $this->service->uploadImage($file, 'dokumentasi_ba');

    expect($result)->toHaveKeys(['path', 'name', 'size', 'mime_type', 'disk']);
    expect($result['name'])->toBe('dokumentasi.jpg');
    expect($result['disk'])->toBe('public');
    expect($result['path'])->toStartWith('dokumentasi_ba/'.date('Y').'/'.date('m').'/');
    expect($result['size'])->toBeGreaterThan(0);

    Storage::disk('public')->assertExists($result['path']);
});

test('it can replace an existing file and delete the old one', function () {
    $oldFile = UploadedFile::fake()->create('old_file.pdf', 50, 'application/pdf');
    $oldResult = $this->service->uploadFile($oldFile, 'notas');
    Storage::disk('public')->assertExists($oldResult['path']);

    $newFile = UploadedFile::fake()->create('new_file.pdf', 80, 'application/pdf');
    $newResult = $this->service->replaceFile($oldResult['path'], $newFile, 'notas');

    Storage::disk('public')->assertMissing($oldResult['path']);
    Storage::disk('public')->assertExists($newResult['path']);
    expect($newResult['name'])->toBe('new_file.pdf');
});

test('it safely deletes existing file and handles null/missing gracefully', function () {
    $file = UploadedFile::fake()->create('to_delete.pdf', 50, 'application/pdf');
    $result = $this->service->uploadFile($file, 'notas');
    Storage::disk('public')->assertExists($result['path']);

    $deleted = $this->service->deleteFile($result['path']);
    expect($deleted)->toBeTrue();
    Storage::disk('public')->assertMissing($result['path']);

    // Deleting again or deleting null should return false without error
    expect($this->service->deleteFile($result['path']))->toBeFalse();
    expect($this->service->deleteFile(null))->toBeFalse();
});
