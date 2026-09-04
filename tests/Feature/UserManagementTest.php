<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['name' => 'admin'], ['label' => 'Administrator']);
    $this->userRole = Role::firstOrCreate(['name' => 'user'], ['label' => 'User']);

    $this->admin = User::factory()->create(['email' => 'admin.test@taspen.com']);
    $this->admin->roles()->sync([$this->adminRole->id]);

    $this->regularUser = User::factory()->create(['email' => 'user.test@taspen.com']);
    $this->regularUser->roles()->sync([$this->userRole->id]);
});

test('regular user cannot access user management page', function () {
    $response = $this->actingAs($this->regularUser)->get(route('users.index'));
    $response->assertStatus(403);
});

test('admin can access user management page', function () {
    $response = $this->actingAs($this->admin)->get(route('users.index'));
    $response->assertStatus(200);
});

test('admin can create a new user', function () {
    $response = $this->actingAs($this->admin)->post(route('users.store'), [
        'name' => 'Petugas Baru',
        'email' => 'petugas.baru@taspen.com',
        'password' => 'password123',
        'role_id' => $this->userRole->id,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('users', [
        'email' => 'petugas.baru@taspen.com',
    ]);
});

test('admin can update user', function () {
    $response = $this->actingAs($this->admin)->put(route('users.update', $this->regularUser), [
        'name' => 'Nama Baru Petugas',
        'email' => 'user.test@taspen.com',
        'role_id' => $this->userRole->id,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('users', [
        'id' => $this->regularUser->id,
        'name' => 'Nama Baru Petugas',
    ]);
});

test('admin cannot delete their own account from user management', function () {
    $response = $this->actingAs($this->admin)->delete(route('users.destroy', $this->admin));
    $this->assertDatabaseHas('users', ['id' => $this->admin->id]);
});

test('admin can access roles matrix page and update permissions', function () {
    $perm = Permission::firstOrCreate(['name' => 'test.perm'], ['label' => 'Test Perm', 'group' => 'Test']);

    $response = $this->actingAs($this->admin)->get(route('roles.index'));
    $response->assertStatus(200);

    $updateResp = $this->actingAs($this->admin)->put(route('roles.update', $this->userRole), [
        'permission_ids' => [$perm->id],
    ]);

    $updateResp->assertSessionHasNoErrors();
    expect($this->userRole->fresh()->permissions->pluck('id')->toArray())->toContain($perm->id);
});
