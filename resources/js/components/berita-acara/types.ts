import type { BeritaAcara } from '@/types';

export type { BeritaAcara };

export interface BeritaAcaraStats {
    total: number;
    selesai: number;
    dalam_proses: number;
    draft: number;
    sudah_ttd?: number;
    belum_ttd?: number;
}

export interface BeritaAcaraFormData {
    nomor_berita_acara: string;
    nama: string;
    no_hp?: string;
    permasalahan: string;
    solusi: string;
    status: string;
    tanggal_kejadian: string;
}
