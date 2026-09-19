import { router } from '@inertiajs/react';
import {
    Calendar,
    Camera,
    ExternalLink,
    FileSignature,
    Pencil,
    Trash2,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { BeritaAcara } from './types';
import { formatFileSize, formatTanggalIndo } from './utils';

interface BaFotoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: BeritaAcara | null;
    onOpenUpload: (item: BeritaAcara) => void;
}

export function BaFotoModal({
    open,
    onOpenChange,
    item,
    onOpenUpload,
}: BaFotoModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!item) return null;

    const handleDeleteFoto = () => {
        if (!confirm('Apakah Anda yakin ingin menghapus foto dokumentasi tanda tangan ini?')) {
            return;
        }

        setIsDeleting(true);
        router.delete(`/berita-acara/${item.id}/delete-dokumentasi`, {
            onSuccess: () => {
                setIsDeleting(false);
                onOpenChange(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    const handleReplace = () => {
        onOpenChange(false);
        onOpenUpload(item);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[720px] max-h-[92vh] overflow-y-auto">
                <DialogHeader className="border-b pb-3">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                <FileSignature className="size-4" />
                            </div>
                            <span>Bukti Dokumentasi Tanda Tangan Fisik</span>
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Ringkasan Berita Acara */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/40 p-3 text-xs border border-border/60">
                        <div>
                            <span className="text-muted-foreground block text-[11px]">NOTAS:</span>
                            <span className="font-mono font-bold text-foreground">{item.nomor_berita_acara}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block text-[11px]">Nama Peserta:</span>
                            <span className="font-semibold text-foreground">{item.nama}</span>
                        </div>
                        {item.waktu_dokumentasi && (
                            <div>
                                <span className="text-muted-foreground block text-[11px]">Waktu Unggah:</span>
                                <span className="font-medium text-foreground flex items-center gap-1">
                                    <Calendar className="size-3 text-blue-500" />
                                    {formatTanggalIndo(item.waktu_dokumentasi, { monthFormat: 'short' })}
                                </span>
                            </div>
                        )}
                        {item.foto_dokumentasi_size && (
                            <div>
                                <span className="text-muted-foreground block text-[11px]">Ukuran File:</span>
                                <span className="font-medium text-foreground">
                                    {formatFileSize(item.foto_dokumentasi_size)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Foto Image Container */}
                    {item.foto_dokumentasi_url ? (
                        <div className="relative flex min-h-[280px] max-h-[500px] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-black/5 p-2 dark:bg-black/40">
                            <img
                                src={item.foto_dokumentasi_url}
                                alt={`Dokumentasi TTD - ${item.nomor_berita_acara}`}
                                className="max-h-[480px] w-auto max-w-full rounded-lg object-contain shadow-sm"
                            />
                        </div>
                    ) : (
                        <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-center text-muted-foreground">
                            <Camera className="size-8 text-muted-foreground/60" />
                            <p className="text-sm font-medium">Belum ada foto dokumentasi tanda tangan yang diunggah.</p>
                            <Button
                                size="sm"
                                onClick={handleReplace}
                                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                            >
                                <Camera className="size-4" /> Unggah Foto Sekarang
                            </Button>
                        </div>
                    )}

                    {/* Catatan Dokumentasi jika ada */}
                    {item.catatan_dokumentasi && (
                        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 text-xs text-foreground dark:border-blue-900/40 dark:bg-blue-950/30">
                            <span className="font-semibold text-blue-800 dark:text-blue-300 block mb-1">
                                Catatan Serah Terima:
                            </span>
                            <p className="leading-relaxed text-muted-foreground">{item.catatan_dokumentasi}</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t pt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        {item.foto_dokumentasi && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteFoto}
                                disabled={isDeleting}
                                className="text-xs gap-1.5"
                            >
                                <Trash2 className="size-3.5" /> Hapus Foto
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReplace}
                            className="text-xs gap-1.5"
                        >
                            <Pencil className="size-3.5" /> Ganti / Unggah Baru
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        {item.foto_dokumentasi && (
                            <a
                                href={`/berita-acara/${item.id}/download-dokumentasi`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                            >
                                Unduh Foto
                            </a>
                        )}
                        <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
                            Tutup
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
