<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Roles & Permissions
        $this->call(RoleAndPermissionSeeder::class);

        $adminRole = Role::where('name', 'admin')->first();
        $userRole = Role::where('name', 'user')->first();

        // 2. Seed Super Admin User (deto)
        $admin = User::firstOrCreate(
            ['email' => 'super@admin.com'],
            [
                'name' => 'deto',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->roles()->sync([$adminRole->id]);

        // 3. Optional Regular User
        $staff = User::firstOrCreate(
            ['email' => 'user@taspen.com'],
            [
                'name' => 'Petugas Taspen',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $staff->roles()->sync([$userRole->id]);

        // 4. Seed Referensi Kasus dari Rekap Keluhan Permasalahan TASPEN
        $this->call(RekapKeluhanSeeder::class);

        // 5. Seed Materi Regulasi UU No. 11 Tahun 1969 (Pensiun Pegawai & Janda/Duda)
        $this->call(UUPensiun1969Seeder::class);
    }
}
