export const KATEGORI_CONFIG: Record<
    string,
    { badge: string; gradient: string; bg: string; color: string; border: string }
> = {
    Klaim:        { badge: 'bg-emerald-500/15 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300', gradient: 'from-emerald-500 to-teal-600',   bg: 'bg-emerald-500/10 dark:bg-emerald-950/40', color: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-800' },
    Kepesertaan:  { badge: 'bg-blue-500/15 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300',               gradient: 'from-blue-500 to-indigo-600',    bg: 'bg-blue-500/10 dark:bg-blue-950/40',       color: 'text-blue-700 dark:text-blue-300',       border: 'border-blue-300 dark:border-blue-800'   },
    Pensiun:      { badge: 'bg-purple-500/15 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300',     gradient: 'from-purple-500 to-violet-600',  bg: 'bg-purple-500/10 dark:bg-purple-950/40',   color: 'text-purple-700 dark:text-purple-300',   border: 'border-purple-300 dark:border-purple-800'},
    Teknis:       { badge: 'bg-amber-500/15 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300',          gradient: 'from-amber-500 to-orange-600',   bg: 'bg-amber-500/10 dark:bg-amber-950/40',     color: 'text-amber-700 dark:text-amber-300',     border: 'border-amber-300 dark:border-amber-800' },
    Mutasi:       { badge: 'bg-cyan-500/15 text-cyan-700 border-cyan-300 dark:bg-cyan-950/40 dark:text-cyan-300',               gradient: 'from-cyan-500 to-sky-600',       bg: 'bg-cyan-500/10 dark:bg-cyan-950/40',       color: 'text-cyan-700 dark:text-cyan-300',       border: 'border-cyan-300 dark:border-cyan-800'   },
    Administrasi: { badge: 'bg-indigo-500/15 text-indigo-700 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300',     gradient: 'from-indigo-500 to-blue-600',    bg: 'bg-indigo-500/10 dark:bg-indigo-950/40',   color: 'text-indigo-700 dark:text-indigo-300',   border: 'border-indigo-300 dark:border-indigo-800'},
    'Kasus Hukum':{ badge: 'bg-rose-500/15 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300',               gradient: 'from-rose-500 to-red-600',       bg: 'bg-rose-500/10 dark:bg-rose-950/40',       color: 'text-rose-700 dark:text-rose-300',       border: 'border-rose-300 dark:border-rose-800'   },
    Keuangan:     { badge: 'bg-orange-500/15 text-orange-700 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300',     gradient: 'from-orange-500 to-amber-600',   bg: 'bg-orange-500/10 dark:bg-orange-950/40',   color: 'text-orange-700 dark:text-orange-300',   border: 'border-orange-300 dark:border-orange-800'},
    Umum:         { badge: 'bg-slate-500/15 text-slate-700 border-slate-300 dark:bg-slate-800/40 dark:text-slate-300',          gradient: 'from-slate-500 to-gray-600',     bg: 'bg-slate-500/10 dark:bg-slate-800/40',     color: 'text-slate-700 dark:text-slate-300',     border: 'border-slate-300 dark:border-slate-700' },
};

export const SEMUA_KATEGORI = [
    'Klaim', 'Kepesertaan', 'Pensiun', 'Teknis', 'Mutasi',
    'Administrasi', 'Kasus Hukum', 'Keuangan', 'Umum',
] as const;

export const getCfg = (k: string) => KATEGORI_CONFIG[k] ?? KATEGORI_CONFIG['Umum'];

export interface RkFormData {
    kode_kasus: string;
    kategori: string;
    kasus: string;
    penyelesaian: string;
    aturan: string;
    lampiran?: File | null;
    hapus_lampiran?: boolean;
}
