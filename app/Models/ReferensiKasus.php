<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ReferensiKasus extends Model
{
    use HasFactory;

    protected $table = 'referensi_kasus';

    protected $fillable = [
        'kode_kasus',
        'kategori',
        'kasus',
        'penyelesaian',
        'aturan',
        'lampiran',
        'lampiran_name',
        'lampiran_size',
    ];

    protected $appends = ['lampiran_url'];

    /**
     * Generate a temporary signed download URL for the lampiran file.
     * Returns null when no file is attached.
     */
    public function getLampiranUrlAttribute(): ?string
    {
        if (! $this->lampiran) {
            return null;
        }

        return Storage::disk('local')->exists($this->lampiran)
            ? route('referensi-kasus.download-lampiran', $this->id)
            : null;
    }

    /**
     * Delete the physical file from storage when the model is deleted.
     */
    protected static function booted(): void
    {
        static::deleting(function (ReferensiKasus $model) {
            if ($model->lampiran && Storage::disk('local')->exists($model->lampiran)) {
                Storage::disk('local')->delete($model->lampiran);
            }
        });
    }
}
