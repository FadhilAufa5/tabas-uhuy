<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class BeritaAcara extends Model
{
    use HasFactory;

    protected $table = 'berita_acara';

    protected $fillable = [
        'user_id',
        'nomor_berita_acara',
        'nama',
        'no_hp',
        'permasalahan',
        'solusi',
        'file_notas',
        'file_notas_name',
        'file_notas_size',
        'status',
        'tanggal_kejadian',
        'foto_dokumentasi',
        'foto_dokumentasi_name',
        'foto_dokumentasi_size',
        'waktu_dokumentasi',
        'catatan_dokumentasi',
    ];

    protected $casts = [
        'tanggal_kejadian' => 'date:Y-m-d',
        'file_notas_size' => 'integer',
        'foto_dokumentasi_size' => 'integer',
        'waktu_dokumentasi' => 'datetime',
    ];

    protected $appends = [
        'file_url',
        'foto_dokumentasi_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getFileUrlAttribute(): ?string
    {
        if (! $this->file_notas) {
            return null;
        }

        return Storage::url($this->file_notas);
    }

    public function getFotoDokumentasiUrlAttribute(): ?string
    {
        if (! $this->foto_dokumentasi) {
            return null;
        }

        return Storage::url($this->foto_dokumentasi);
    }
}
