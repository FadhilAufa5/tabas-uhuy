import { router } from '@inertiajs/react';
import {
    AlertCircle,
    Camera,
    CheckCircle2,
    FileCheck,
    Image as ImageIcon,
    Info,
    Loader2,
    Upload,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { BeritaAcara } from './types';
import { formatFileSize } from './utils';

interface BaUploadDokumentasiModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: BeritaAcara | null;
    isAfterPrint?: boolean;
}

export function BaUploadDokumentasiModal({
    open,
    onOpenChange,
    item,
    isAfterPrint = false,
}: BaUploadDokumentasiModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [catatan, setCatatan] = useState('');
    const [tandaiSelesai, setTandaiSelesai] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    useEffect(() => {
        if (open) {
            setSelectedFile(null);
            setErrorMsg(null);
            setCatatan(item?.catatan_dokumentasi || '');
            setTandaiSelesai(item?.status !== 'Selesai');
            if (item?.foto_dokumentasi_url) {
                setPreviewUrl(item.foto_dokumentasi_url);
            } else {
                setPreviewUrl(null);
            }
        } else {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    }, [open, item]);

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setErrorMsg('Format file harus berupa gambar (JPG, PNG, WEBP).');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setErrorMsg('Ukuran file foto maksimal 10MB.');
            return;
        }

        setErrorMsg(null);
        setSelectedFile(file);

        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleRemoveSelected = () => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(item?.foto_dokumentasi_url || null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!item) return;

        if (!selectedFile && !item.foto_dokumentasi) {
            setErrorMsg('Silakan pilih atau ambil foto bukti tanda tangan terlebih dahulu.');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg(null);

        const formData = new FormData();
        if (selectedFile) {
            formData.append('foto_dokumentasi', selectedFile);
        }
        formData.append('catatan_dokumentasi', catatan);
        formData.append('tandai_selesai', tandaiSelesai ? '1' : '0');

        router.post(`/berita-acara/${item.id}/upload-dokumentasi`, formData, {
            onSuccess: () => {
                setIsSubmitting(false);
                onOpenChange(false);
            },
            onError: (errors) => {
                setIsSubmitting(false);
                if (errors.foto_dokumentasi) {
                    setErrorMsg(errors.foto_dokumentasi);
                } else {
                    setErrorMsg('Gagal mengunggah foto dokumentasi. Silakan periksa kembali berkas Anda.');
                }
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px] max-h-[92vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2.5 text-lg font-bold text-foreground">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                            <Camera className="size-5" />
                        </div>
                        <span>Upload Dokumentasi Tanda Tangan</span>
                    </DialogTitle>
                    <DialogDescription>
                        Unggah bukti foto lembar Berita Acara yang telah ditandatangani oleh pihak peserta dan petugas.
                    </DialogDescription>
                </DialogHeader>

                {isAfterPrint && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200">
                        <Info className="size-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                            <span className="font-semibold block">Dokumen Berhasil Dicetak!</span>
                            Setelah peserta dan petugas membubuhkan tanda tangan pada berkas fisik, Anda dapat langsung mengunggah foto dokumentasinya di sini.
                        </div>
                    </div>
                )}

                {item && (
                    <div className="rounded-lg border border-border/80 bg-muted/30 p-3 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <span className="text-muted-foreground block text-[11px]">Nomor NOTAS:</span>
                                <span className="font-mono font-bold text-foreground text-sm">{item.nomor_berita_acara}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px]">Nama Peserta:</span>
                                <span className="font-semibold text-foreground">{item.nama}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px]">Status Saat Ini:</span>
                                <span className="font-medium text-foreground">{item.status}</span>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Dropzone Area */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold">
                            Foto Berkas Fisik Bertandatangan <span className="text-rose-500">*</span>
                        </Label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleFileSelect(e.target.files[0]);
                                }
                            }}
                        />

                        {previewUrl ? (
                            <div className="relative overflow-hidden rounded-xl border border-border/80 bg-black/5 dark:bg-black/30 p-2">
                                <div className="relative max-h-[260px] w-full flex items-center justify-center overflow-hidden rounded-lg bg-background">
                                    <img
                                        src={previewUrl}
                                        alt="Preview Dokumentasi TTD"
                                        className="max-h-[250px] w-auto object-contain rounded-md"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute right-2 top-2 size-7 rounded-full shadow-md"
                                        onClick={handleRemoveSelected}
                                        title="Hapus / Ganti Foto"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                                <div className="mt-2 flex items-center justify-between px-1 text-xs text-muted-foreground">
                                    <span className="truncate max-w-[260px] font-medium text-foreground">
                                        {selectedFile ? selectedFile.name : item?.foto_dokumentasi_name || 'Foto Dokumentasi'}
                                    </span>
                                    <span>
                                        {selectedFile ? formatFileSize(selectedFile.size) : formatFileSize(item?.foto_dokumentasi_size)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragOver(true);
                                }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                                    isDragOver
                                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                                        : 'border-border/80 hover:border-blue-400 hover:bg-muted/40'
                                }`}
                            >
                                <div className="flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-4 ring-blue-50/50 dark:bg-blue-950/80 dark:text-blue-400 dark:ring-blue-950/40">
                                    <Upload className="size-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Ambil Foto atau Klik untuk Unggah
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Format JPG, PNG, atau WEBP (Maksimal 10MB)
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                                    <Camera className="size-3.5" />
                                    <span>Bisa langsung menggunakan kamera smartphone/laptop</span>
                                </div>
                            </div>
                        )}

                        {errorMsg && (
                            <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium mt-1">
                                <AlertCircle className="size-3.5" />
                                <span>{errorMsg}</span>
                            </div>
                        )}
                    </div>

                    {/* Catatan Tambahan */}
                    <div className="space-y-1.5">
                        <Label htmlFor="catatan_dok" className="text-xs font-semibold">
                            Catatan Dokumentasi (Opsional)
                        </Label>
                        <Textarea
                            id="catatan_dok"
                            placeholder="Contoh: Ditandatangani langsung oleh yang bersangkutan di Loket 2..."
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            rows={2}
                            className="text-xs resize-none"
                        />
                    </div>

                    {/* Checkbox Tandai Selesai */}
                    <div className="flex items-start gap-2.5 rounded-lg border border-border/80 bg-muted/20 p-3">
                        <Checkbox
                            id="tandai_selesai"
                            checked={tandaiSelesai}
                            onCheckedChange={(checked) => setTandaiSelesai(Boolean(checked))}
                            className="mt-0.5"
                        />
                        <div className="grid gap-0.5 leading-none">
                            <label
                                htmlFor="tandai_selesai"
                                className="text-xs font-semibold text-foreground cursor-pointer"
                            >
                                Tandai status Berita Acara sebagai "Selesai"
                            </label>
                            <p className="text-[11px] text-muted-foreground">
                                Merekomendasikan status tuntas karena berkas telah ditandatangani dan bukti fisik telah diarsipkan.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="pt-2 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            {isAfterPrint ? 'Nanti Saja' : 'Batal'}
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <FileCheck className="size-4" />
                                    <span>Simpan Dokumentasi</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
