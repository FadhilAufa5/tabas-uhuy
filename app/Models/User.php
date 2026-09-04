<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Throwable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    protected $appends = [
        'role',
        'permissions',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * The roles that belong to the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user');
    }

    /**
     * Berita acara created by this user.
     */
    public function beritaAcara(): HasMany
    {
        return $this->hasMany(BeritaAcara::class);
    }

    /**
     * Check if user has given role(s).
     */
    public function hasRole(string|array $roles): bool
    {
        try {
            if (is_string($roles)) {
                $roles = [$roles];
            }

            return $this->roles()->whereIn('name', $roles)->exists();
        } catch (Throwable) {
            return false;
        }
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user has given permission.
     */
    public function hasPermission(string $permission): bool
    {
        try {
            if ($this->isAdmin()) {
                return true;
            }

            return $this->roles()
                ->whereHas('permissions', function ($query) use ($permission) {
                    $query->where('name', $permission);
                })
                ->exists();
        } catch (Throwable) {
            return false;
        }
    }

    /**
     * Get primary role name attribute.
     */
    public function getRoleAttribute(): string
    {
        try {
            if ($this->relationLoaded('roles')) {
                $firstRole = $this->roles->first();
                return $firstRole ? $firstRole->name : 'user';
            }

            $firstRole = $this->roles()->first();
            return $firstRole ? $firstRole->name : 'user';
        } catch (Throwable) {
            return 'user';
        }
    }

    /**
     * Get all permission names for the user.
     */
    public function getPermissionsAttribute(): array
    {
        try {
            if ($this->isAdmin()) {
                return Permission::pluck('name')->toArray();
            }

            return $this->roles->flatMap(function ($role) {
                return $role->permissions->pluck('name');
            })->unique()->values()->toArray();
        } catch (Throwable) {
            return [];
        }
    }
}
