import { Download, FileText, Printer } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { BeritaAcara } from './types';
import { formatFileSize, openPrintWindow } from './utils';

interface BaDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: BeritaAcara | null;
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

export function BaDetailModal({ open, onOpenChange, item }: BaDetailModalProps) {
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
                        <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg border border-border/50">
                            <div>
                                <span className="text-xs text-muted-foreground block">
                                    Nama Pihak / Pelapor
                                </span>
                                <span className="font-semibold text-foreground">{item.nama}</span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">
                                    Tanggal Kejadian
                                </span>
                                <span className="font-medium text-foreground">
                                    {item.tanggal_kejadian || '-'}
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
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                                        >
                                            <Download className="size-3.5" /> Unduh Berkas
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
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
