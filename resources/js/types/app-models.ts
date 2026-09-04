export type Role = {
    id: number;
    name: string;
    label: string;
    description?: string | null;
    permissions?: Permission[];
    created_at?: string;
    updated_at?: string;
};

export type Permission = {
    id: number;
    name: string;
    label: string;
    group: string;
    created_at?: string;
    updated_at?: string;
};

export type BeritaAcara = {
    id: number;
    user_id?: number | null;
    nomor_berita_acara: string;
    nama: string;
    permasalahan: string;
    solusi: string;
    file_notas?: string | null;
    file_notas_name?: string | null;
    file_notas_size?: number | null;
    file_url?: string | null;
    status: 'Selesai' | 'Dalam Proses' | 'Draft';
    tanggal_kejadian?: string | null;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
};

export type ReferensiKasus = {
    id: number;
    kode_kasus?: string | null;
    kategori: string;
    kasus: string;
    penyelesaian: string;
    aturan?: string | null;
    created_at: string;
    updated_at: string;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};
