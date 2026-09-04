<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define permissions
        $permissions = [
            // User Management
            ['name' => 'users.view', 'label' => 'Lihat Daftar Pengguna', 'group' => 'User Management'],
            ['name' => 'users.create', 'label' => 'Tambah Pengguna Baru', 'group' => 'User Management'],
            ['name' => 'users.edit', 'label' => 'Edit Data Pengguna', 'group' => 'User Management'],
            ['name' => 'users.delete', 'label' => 'Hapus Pengguna', 'group' => 'User Management'],

            // Role & Permission Management
            ['name' => 'roles.view', 'label' => 'Lihat Role & Permission', 'group' => 'Role Management'],
            ['name' => 'roles.edit', 'label' => 'Ubah Hak Akses Role', 'group' => 'Role Management'],

            // Berita Acara
            ['name' => 'berita_acara.view', 'label' => 'Lihat Berita Acara', 'group' => 'Berita Acara'],
            ['name' => 'berita_acara.create', 'label' => 'Buat & Upload Berita Acara', 'group' => 'Berita Acara'],
            ['name' => 'berita_acara.edit', 'label' => 'Edit Berita Acara', 'group' => 'Berita Acara'],
            ['name' => 'berita_acara.delete', 'label' => 'Hapus Berita Acara', 'group' => 'Berita Acara'],

            // Referensi Kasus
            ['name' => 'referensi_kasus.view', 'label' => 'Lihat Referensi Kasus', 'group' => 'Referensi Kasus'],
            ['name' => 'referensi_kasus.create', 'label' => 'Tambah Referensi Kasus', 'group' => 'Referensi Kasus'],
            ['name' => 'referensi_kasus.edit', 'label' => 'Edit Referensi Kasus', 'group' => 'Referensi Kasus'],
            ['name' => 'referensi_kasus.delete', 'label' => 'Hapus Referensi Kasus', 'group' => 'Referensi Kasus'],
            ['name' => 'referensi_kasus.import', 'label' => 'Import CSV Referensi Kasus', 'group' => 'Referensi Kasus'],
            ['name' => 'referensi_kasus.export', 'label' => 'Export CSV Referensi Kasus', 'group' => 'Referensi Kasus'],
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm['name']], $perm);
        }

        // Roles
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['label' => 'Administrator', 'description' => 'Akses penuh ke semua fitur dan pengaturan sistem.']
        );

        $userRole = Role::firstOrCreate(
            ['name' => 'user'],
            ['label' => 'User / Petugas', 'description' => 'Akses operasional input berita acara dan pencarian referensi kasus.']
        );

        // Assign all permissions to Admin
        $allPermissions = Permission::all();
        $adminRole->permissions()->sync($allPermissions->pluck('id'));

        // Assign standard permissions to User
        $userPermissions = Permission::whereIn('name', [
            'berita_acara.view',
            'berita_acara.create',
            'berita_acara.edit',
            'referensi_kasus.view',
            'referensi_kasus.export',
        ])->get();
        $userRole->permissions()->sync($userPermissions->pluck('id'));
    }
}
