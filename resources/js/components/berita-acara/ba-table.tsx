import { router } from '@inertiajs/react';
import {
    Calendar,
    Camera,
    CheckCircle2,
    Clock,
    Eye,
    FileCheck2,
    FileSignature,
    FileText,
    Pencil,
    Phone,
    Plus,
    Printer,
    Search,
    Trash2,
    Upload,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { BeritaAcara, PaginatedData } from '@/types';
import { BaStats } from './ba-stats';
import type { BeritaAcaraStats } from './types';
import { formatTanggalIndo, openPrintWindow } from './utils';

interface BaTableProps {
    items: PaginatedData<BeritaAcara>;
    stats?: BeritaAcaraStats;
    searchQuery: string;
    statusFilter: string;
    dokumentasiFilter: string;
    onSearchChange: (val: string) => void;
    onSearch: (e?: React.FormEvent) => void;
    onStatusFilterChange: (val: string) => void;
    onDokumentasiFilterChange: (val: string) => void;
    onOpenDetail: (item: BeritaAcara) => void;
    onOpenEdit: (item: BeritaAcara) => void;
    onOpenDelete: (item: BeritaAcara) => void;
    onOpenCreate: () => void;
    onOpenUploadDokumentasi: (item: BeritaAcara, isAfterPrint?: boolean) => void;
    onOpenFotoModal: (item: BeritaAcara) => void;
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'Selesai':
            return (
                <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <CheckCircle2 className="mr-1 size-3.5" /> Selesai
                </Badge>
            );
        case 'Dalam Proses':
            return (
                <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300">
                    <Clock className="mr-1 size-3.5" /> Dalam Proses
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="text-muted-foreground">
                    <FileText className="mr-1 size-3.5" /> Draft
                </Badge>
            );
    }
}

export function BaTable({
    items,
    stats,
    searchQuery,
    statusFilter,
    dokumentasiFilter,
    onSearchChange,
    onSearch,
    onStatusFilterChange,
    onDokumentasiFilterChange,
    onOpenDetail,
    onOpenEdit,
    onOpenDelete,
    onOpenCreate,
    onOpenUploadDokumentasi,
    onOpenFotoModal,
}: BaTableProps) {
    const handlePrintItem = (item: BeritaAcara) => {
        openPrintWindow(item);
        // Setelah jendela print terbuka, munculkan modal panduan upload tanda tangan
        setTimeout(() => {
            onOpenUploadDokumentasi(item, true);
        }, 600);
    };

    return (
        <>
            {/* Header Title & Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                            <FileCheck2 className="size-6" />
                        </div>
                        Berita Acara Pelayanan
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Pencatatan resmi kasus penanganan, cetak berkas fisik, dokumentasi tanda tangan, dan solusi tindak lanjut.
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button
                        onClick={onOpenCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                    >
                        <Plus className="mr-1.5 size-4" /> Buat Berita Acara
                    </Button>
                </div>
            </div>

            {/* Statistik Cards Ditaruh di Atas Tabel */}
            {stats && <BaStats stats={stats} />}

            {/* Filters & Table Card */}
            <Card className="border-border/70 shadow-xs">
                <CardHeader className="p-4 sm:p-6 pb-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <form
                            onSubmit={onSearch}
                            className="flex flex-1 items-center gap-2 max-w-md"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nomor notas, nama, permasalahan, solusi..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="pl-9 bg-background/80"
                                />
                            </div>
                            <Button type="submit" variant="secondary" size="sm">
                                Cari
                            </Button>
                        </form>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Filter Status */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                    Status:
                                </span>
                                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                                    <SelectTrigger className="w-[135px] h-9">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="Selesai">Selesai</SelectItem>
                                        <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filter Dokumentasi TTD */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                    Dokumentasi TTD:
                                </span>
                                <Select value={dokumentasiFilter} onValueChange={onDokumentasiFilterChange}>
                                    <SelectTrigger className="w-[155px] h-9">
                                        <SelectValue placeholder="Dokumentasi TTD" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Dokumen</SelectItem>
                                        <SelectItem value="sudah_ttd">✓ Sudah Ditandatangani</SelectItem>
                                        <SelectItem value="belum_ttd">⏳ Belum Upload TTD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow>
                                    <TableHead className="w-[160px] font-semibold">NOTAS</TableHead>
                                    <TableHead className="w-[180px] font-semibold">Nama / Pihak</TableHead>
                                    <TableHead className="min-w-[200px] font-semibold">Permasalahan</TableHead>
                                    <TableHead className="min-w-[200px] font-semibold">Solusi</TableHead>
                                    <TableHead className="w-[130px] font-semibold">Lampiran Notas</TableHead>
                                    <TableHead className="w-[165px] font-semibold">Dokumentasi TTD</TableHead>
                                    <TableHead className="w-[105px] font-semibold">Status</TableHead>
                                    <TableHead className="w-[160px] text-right font-semibold">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="h-40 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <FileText className="size-8 text-muted-foreground/60" />
                                                <p className="font-medium">
                                                    Belum ada data Berita Acara yang ditemukan.
                                                </p>
                                                <p className="text-xs">
                                                    Klik tombol "Buat Berita Acara" untuk menambahkan
                                                    dokumen baru.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.data.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-muted/30 transition-colors"
                                        >
                                            {/* NOTAS & Tanggal Kejadian */}
                                            <TableCell className="font-semibold text-primary font-mono text-xs">
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs">
                                                        {item.nomor_berita_acara}
                                                    </span>
                                                    {item.tanggal_kejadian ? (
                                                        <div
                                                            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/70 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/60"
                                                            title={`Tanggal Kejadian: ${formatTanggalIndo(item.tanggal_kejadian, { monthFormat: 'long' })}`}
                                                        >
                                                            <Calendar className="size-3 text-blue-600 dark:text-blue-400 shrink-0" />
                                                            <span className="whitespace-nowrap font-sans">
                                                                {formatTanggalIndo(item.tanggal_kejadian, { monthFormat: 'short' })}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[11px] font-sans text-muted-foreground italic">
                                                            Tanggal: -
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Nama & Petugas */}
                                            <TableCell>
                                                <div className="font-medium text-sm text-foreground">
                                                    {item.nama}
                                                </div>
                                                {item.no_hp && (
                                                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <Phone className="size-3" /> {item.no_hp}
                                                    </div>
                                                )}
                                                {item.user && (
                                                    <div className="text-[11px] text-muted-foreground">
                                                        Petugas: {item.user.name}
                                                    </div>
                                                )}
                                            </TableCell>

                                            {/* Permasalahan */}
                                            <TableCell className="max-w-[220px]">
                                                <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                                                    {item.permasalahan}
                                                </p>
                                            </TableCell>

                                            {/* Solusi */}
                                            <TableCell className="max-w-[220px]">
                                                <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                                                    {item.solusi}
                                                </p>
                                            </TableCell>

                                            {/* Lampiran Notas */}
                                            <TableCell>
                                                {item.file_notas ? (
                                                    <a
                                                        href={`/berita-acara/${item.id}/download`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 transition-colors"
                                                        title={item.file_notas_name || 'Download Notas'}
                                                    >
                                                        <span className="max-w-[85px] truncate">
                                                            {item.file_notas_name || 'Unduh'}
                                                        </span>
                                                    </a>
                                                ) : item.file_notas_name ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                        <FileText className="size-3" />{' '}
                                                        {item.file_notas_name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* Dokumentasi Tanda Tangan Fisik */}
                                            <TableCell>
                                                {item.foto_dokumentasi_url ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => onOpenFotoModal(item)}
                                                            className="relative size-8 shrink-0 overflow-hidden rounded-md border border-emerald-300 ring-1 ring-emerald-500/30 hover:opacity-85 transition-opacity"
                                                            title="Klik untuk melihat bukti foto tanda tangan"
                                                        >
                                                            <img
                                                                src={item.foto_dokumentasi_url}
                                                                alt="Thumbnail TTD"
                                                                className="size-full object-cover"
                                                            />
                                                        </button>
                                                        <div className="flex flex-col">
                                                            <button
                                                                type="button"
                                                                onClick={() => onOpenFotoModal(item)}
                                                                className="text-left font-semibold text-xs text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                                                            >
                                                                <CheckCircle2 className="size-3 shrink-0" />
                                                                <span>Sudah TTD</span>
                                                            </button>
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {item.waktu_dokumentasi
                                                                    ? formatTanggalIndo(item.waktu_dokumentasi, { monthFormat: 'short' })
                                                                    : 'Terdokumentasi'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onOpenUploadDokumentasi(item)}
                                                        className="h-7 px-2 text-[11px] border-amber-300 bg-amber-50/60 text-amber-800 hover:bg-amber-100 hover:text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 gap-1"
                                                    >
                                                        <Camera className="size-3" />
                                                        <span>Upload TTD</span>
                                                    </Button>
                                                )}
                                            </TableCell>

                                            {/* Status Pelayanan */}
                                            <TableCell>
                                                <StatusBadge status={item.status} />
                                            </TableCell>

                                            {/* Kolom Aksi */}
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {/* Lihat Detail */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                                        onClick={() => onOpenDetail(item)}
                                                        title="Lihat Detail Berita Acara"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>

                                                    {/* Upload / Lihat Foto TTD */}
                                                    {/* <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={`size-8 ${
                                                            item.foto_dokumentasi
                                                                ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                                                : 'text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                                                        }`}
                                                        onClick={() => {
                                                            if (item.foto_dokumentasi) {
                                                                onOpenFotoModal(item);
                                                            } else {
                                                                onOpenUploadDokumentasi(item);
                                                            }
                                                        }}
                                                        title={
                                                            item.foto_dokumentasi
                                                                ? 'Lihat/Ganti Bukti Tanda Tangan'
                                                                : 'Unggah Foto Bukti Tanda Tangan'
                                                        }
                                                    >
                                                        <Camera className="size-4" />
                                                    </Button> */}

                                                    {/* Edit */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300"
                                                        onClick={() => onOpenEdit(item)}
                                                        title="Edit Berita Acara"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>

                                                    {/* Cetak Berita Acara */}
                                                    {/* <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                                        onClick={() => handlePrintItem(item)}
                                                        title="Cetak Berita Acara (dan lanjut unggah bukti TTD)"
                                                    >
                                                        <Printer className="size-4" />
                                                    </Button> */}

                                                    {/* Hapus */} 
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                                        onClick={() => onOpenDelete(item)}
                                                        title="Hapus Berita Acara"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {items.total > items.per_page && (
                        <div className="flex items-center justify-between p-4 border-t border-border">
                            <div className="text-xs text-muted-foreground">
                                Menampilkan {items.from || 0} - {items.to || 0} dari {items.total}{' '}
                                data
                            </div>
                            <div className="flex items-center gap-1">
                                {items.links.map((link, idx) => (
                                    <Button
                                        key={idx}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        className="h-8 min-w-[32px] px-2.5 text-xs"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
