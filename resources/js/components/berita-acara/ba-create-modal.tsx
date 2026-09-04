import { FileCheck2, FileText, Pencil } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import type { BeritaAcara, BeritaAcaraFormData } from './types';

interface BaCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formData: BeritaAcaraFormData;
    setFormData: (data: BeritaAcaraFormData) => void;
    formErrors: Record<string, string>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onFileChange: (file: File | null) => void;
}

export function BaCreateModal({
    open,
    onOpenChange,
    formData,
    setFormData,
    formErrors,
    isSubmitting,
    onSubmit,
    onFileChange,
}: BaCreateModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileCheck2 className="size-5 text-blue-600" /> Buat Berita Acara Baru
                    </DialogTitle>
                    <DialogDescription>
                        Lengkapi rincian formulir berita acara dan lampirkan berkas Notas dinas terkait.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="nomor_ba">
                                NOTAS <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="nomor_ba"
                                placeholder="Contoh: 197508121999031001"
                                value={formData.nomor_berita_acara}
                                onChange={(e) =>
                                    setFormData({ ...formData, nomor_berita_acara: e.target.value })
                                }
                                required
                            />
                            {formErrors.nomor_berita_acara && (
                                <p className="text-xs text-rose-500">{formErrors.nomor_berita_acara}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="tanggal_kejadian">Tanggal Kejadian / Pelaporan</Label>
                            <Input
                                id="tanggal_kejadian"
                                type="date"
                                value={formData.tanggal_kejadian}
                                onChange={(e) =>
                                    setFormData({ ...formData, tanggal_kejadian: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="nama">
                            Nama Pihak / Pelapor / NIP <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="nama"
                            placeholder="Contoh: Drs. Bambang Sutrisno (NIP: 197001011995031001)"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            required
                        />
                        {formErrors.nama && (
                            <p className="text-xs text-rose-500">{formErrors.nama}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="permasalahan">
                            Uraian Permasalahan <span className="text-rose-500">*</span>
                        </Label>
                        <Textarea
                            id="permasalahan"
                            rows={3}
                            placeholder="Jelaskan secara rinci permasalahan atau kendala yang dihadapi peserta..."
                            value={formData.permasalahan}
                            onChange={(e) =>
                                setFormData({ ...formData, permasalahan: e.target.value })
                            }
                            required
                        />
                        {formErrors.permasalahan && (
                            <p className="text-xs text-rose-500">{formErrors.permasalahan}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="solusi">
                            Solusi & Tindak Lanjut <span className="text-rose-500">*</span>
                        </Label>
                        <Textarea
                            id="solusi"
                            rows={3}
                            placeholder="Jelaskan langkah penyelesaian, regulasi yang dijadikan acuan, atau hasil koordinasi..."
                            value={formData.solusi}
                            onChange={(e) => setFormData({ ...formData, solusi: e.target.value })}
                            required
                        />
                        {formErrors.solusi && (
                            <p className="text-xs text-rose-500">{formErrors.solusi}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="status">Status Penanganan</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Selesai">Selesai</SelectItem>
                                    <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="file_notas">Upload Berkas / Dokumen Notas</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="file_notas"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) => {
                                        onFileChange(e.target.files?.[0] ?? null);
                                    }}
                                    className="cursor-pointer file:text-xs file:font-semibold"
                                />
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Format: PDF, DOC, DOCX, JPG, PNG (Maks 10MB)
                            </p>
                            {formErrors.file_notas && (
                                <p className="text-xs text-rose-500">{formErrors.file_notas}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Berita Acara'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
