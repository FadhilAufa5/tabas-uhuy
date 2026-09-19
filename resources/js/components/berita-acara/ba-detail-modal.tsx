import {
    Calendar,
    Camera,
    CheckCircle2,
    Clock,
    Eye,
    FileText,
    Printer,
    Upload,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { BeritaAcara } from './types';
import { formatFileSize, formatTanggalIndo, openPrintWindow } from './utils';

interface BaDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: BeritaAcara | null;
    onOpenUploadDokumentasi?: (item: BeritaAcara) => void;
    onOpenFotoModal?: (item: BeritaAcara) => void;
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

export function BaDetailModal({
    open,
    onOpenChange,
    item,
    onOpenUploadDokumentasi,
    onOpenFotoModal,
}: BaDetailModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-2 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <FileText className="size-5 text-blue-600" /> Detail Berita Acara
                        </DialogTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => item && openPrintWindow(item)}
                            className="hidden sm:inline-flex items-center gap-1.5 text-xs"
                        >
                            <Printer className="size-3.5" /> Cetak Berkas
                        </Button>
                    </div>
                </DialogHeader>

                {item && (
                    <div className="space-y-6 py-3">
                        {/* Header */}
                        <div className="text-center pb-4 border-b border-border">
                            <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">
                                BERITA ACARA PENANGANAN LAYANAN
                            </h2>
                            <p className="text-sm font-mono text-muted-foreground mt-1">
                                NOTAS:{' '}
                                <span className="font-bold text-foreground">
                                    {item.nomor_berita_acara}
                                </span>
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm bg-muted/30 p-4 rounded-lg border border-border/50">
                            <div>
                                <span className="text-xs text-muted-foreground block">
                                    Nama Pihak / Pelapor
                                </span>
                                <span className="font-semibold text-foreground">{item.nama}</span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">
                                    No. HP / Telepon
                                </span>
                                <span className="font-medium text-foreground">{item.no_hp || '-'}</span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">
                                    Tanggal Kejadian
                                </span>
                                <span className="font-medium text-foreground flex items-center gap-1.5 mt-1">
                                    <Calendar className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                    {formatTanggalIndo(item.tanggal_kejadian, { monthFormat: 'long' })}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">
                                    Status Penanganan
                                </span>
                                <div className="mt-1">
                                    <StatusBadge status={item.status} />
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">
                                    Petugas Pencatat
                                </span>
                                <span className="font-medium text-foreground">
                                    {item.user?.name || '-'}
                                </span>
                            </div>
                        </div>

                        {/* Permasalahan */}
                        <div className="space-y-1.5">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                I. URAIAN PERMASALAHAN
                            </h3>
                            <div className="p-3.5 rounded-lg bg-card border border-border/70 text-sm leading-relaxed whitespace-pre-line text-foreground">
                                {item.permasalahan}
                            </div>
                        </div>

                        {/* Solusi */}
                        <div className="space-y-1.5">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                II. SOLUSI & TINDAK LANJUT
                            </h3>
                            <div className="p-3.5 rounded-lg bg-card border border-border/70 text-sm leading-relaxed whitespace-pre-line text-foreground">
                                {item.solusi}
                            </div>
                        </div>

                        {/* Lampiran Notas */}
                        {item.file_notas_name && (
                            <div className="space-y-1.5">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    III. BERKAS LAMPIRAN NOTAS
                                </h3>
                                <div className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                                            <FileText className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {item.file_notas_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Ukuran: {formatFileSize(item.file_notas_size)}
                                            </p>
                                        </div>
                                    </div>
                                    {item.file_notas && (
                                        <a
                                            href={`/berita-acara/${item.id}/download`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                                        >
                                            Unduh Berkas
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Dokumentasi Tanda Tangan Fisik */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <Camera className="size-3.5 text-blue-600 dark:text-blue-400" />
                                    IV. DOKUMENTASI TANDA TANGAN FISIK
                                </h3>
                                {item.foto_dokumentasi ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                                        <CheckCircle2 className="size-3" /> Sudah Ditandatangani
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                                        <Clock className="size-3" /> Belum Upload Dokumentasi TTD
                                    </span>
                                )}
                            </div>

                            {item.foto_dokumentasi_url ? (
                                <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => onOpenFotoModal && onOpenFotoModal(item)}
                                                className="group relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-black/5 hover:opacity-90 transition-all cursor-pointer"
                                                title="Klik untuk melihat ukuran penuh"
                                            >
                                                <img
                                                    src={item.foto_dokumentasi_url}
                                                    alt="Foto Dokumentasi TTD"
                                                    className="size-full object-cover"
                                                />
                                            </button>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {item.foto_dokumentasi_name || 'Foto_Dokumentasi_TTD.jpg'}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                                    <span>Ukuran: {formatFileSize(item.foto_dokumentasi_size)}</span>
                                                    {item.waktu_dokumentasi && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Diunggah: {formatTanggalIndo(item.waktu_dokumentasi, { monthFormat: 'short' })}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {item.catatan_dokumentasi && (
                                                    <p className="text-xs text-muted-foreground mt-1 italic">
                                                        "{item.catatan_dokumentasi}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="text-xs gap-1.5"
                                                onClick={() => onOpenFotoModal && onOpenFotoModal(item)}
                                            >
                                                <Eye className="size-3.5" /> Lihat Foto
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="text-xs gap-1.5"
                                                onClick={() => onOpenUploadDokumentasi && onOpenUploadDokumentasi(item)}
                                            >
                                                <Camera className="size-3.5" /> Ganti
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                            <Camera className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                Foto Dokumentasi Tanda Tangan Belum Diunggah
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Setelah nasabah menandatangani berkas fisik, silakan upload fotonya sebagai arsip resmi.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 text-xs self-end sm:self-center"
                                        onClick={() => {
                                            onOpenChange(false);
                                            onOpenUploadDokumentasi && onOpenUploadDokumentasi(item);
                                        }}
                                    >
                                        <Upload className="size-3.5" /> Upload Foto TTD
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <DialogFooter className="border-t pt-3 flex items-center justify-between">
                    <Button
                        variant="default"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                        onClick={() => item && openPrintWindow(item)}
                    >
                        <Printer className="size-4" /> Cetak Berkas Resmi
                    </Button>
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
