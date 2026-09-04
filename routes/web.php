<?php

use App\Http\Controllers\BeritaAcaraController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReferensiKasusController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // 1. Berita Acara
    Route::get('berita-acara', [BeritaAcaraController::class, 'index'])->name('berita-acara.index');
    Route::post('berita-acara', [BeritaAcaraController::class, 'store'])->name('berita-acara.store');
    Route::match(['put', 'post'], 'berita-acara/{beritaAcara}', [BeritaAcaraController::class, 'update'])->name('berita-acara.update');
    Route::delete('berita-acara/{beritaAcara}', [BeritaAcaraController::class, 'destroy'])->name('berita-acara.destroy');
    Route::get('berita-acara/{beritaAcara}/download', [BeritaAcaraController::class, 'download'])->name('berita-acara.download');

    // 2. Referensi Kasus
    Route::get('referensi-kasus', [ReferensiKasusController::class, 'index'])->name('referensi-kasus.index');
    Route::post('referensi-kasus', [ReferensiKasusController::class, 'store'])->name('referensi-kasus.store');
    Route::match(['put', 'post'], 'referensi-kasus/{referensiKasus}', [ReferensiKasusController::class, 'update'])->name('referensi-kasus.update');
    Route::delete('referensi-kasus/{referensiKasus}', [ReferensiKasusController::class, 'destroy'])->name('referensi-kasus.destroy');
    Route::post('referensi-kasus/import-csv', [ReferensiKasusController::class, 'importCsv'])->name('referensi-kasus.import-csv');
    Route::get('referensi-kasus/export-csv', [ReferensiKasusController::class, 'exportCsv'])->name('referensi-kasus.export-csv');

    // 3. User Management & Role Permissions (Admin Only)
    Route::middleware(['role:admin'])->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::match(['put', 'post'], 'users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        Route::get('roles', [RolePermissionController::class, 'index'])->name('roles.index');
        Route::match(['put', 'post'], 'roles/{role}', [RolePermissionController::class, 'update'])->name('roles.update');
    });
});

require __DIR__.'/settings.php';
