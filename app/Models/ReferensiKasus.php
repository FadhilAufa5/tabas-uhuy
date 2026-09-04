<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    ];
}
