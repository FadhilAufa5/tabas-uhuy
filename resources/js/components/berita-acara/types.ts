import type { BeritaAcara } from '@/types';

export type { BeritaAcara };

export interface BeritaAcaraStats {
    total: number;
    selesai: number;
    dalam_proses: number;
    draft: number;
}

export interface BeritaAcaraFormData {
    nomor_berita_acara: string;
    nama: string;
    permasalahan: string;
    solusi: string;
    status: string;
    tanggal_kejadian: string;
}
