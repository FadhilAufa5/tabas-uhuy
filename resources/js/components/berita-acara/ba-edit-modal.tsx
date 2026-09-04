import { Pencil } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { BeritaAcara, BeritaAcaraFormData } from './types';
import { formatFileSize } from './utils';

interface BaEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formData: BeritaAcaraFormData;
    setFormData: (data: BeritaAcaraFormData) => void;
    formErrors: Record<string, string>;
    isSubmitting: boolean;
    selectedItem: BeritaAcara | null;
    onSubmit: (e: React.FormEvent) => void;
    onFileChange: (file: File | null) => void;
}

export function BaEditModal({
    open,
    onOpenChange,
    formData,
    setFormData,
    formErrors,
    isSubmitting,
    selectedItem,
    onSubmit,
    onFileChange,
}: BaEditModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pencil className="size-5 text-blue-600" /> Edit Berita Acara
                    </DialogTitle>
                    <DialogDescription>
                        Perbarui rincian data atau ganti berkas Notas dinas.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit_nomor_ba">
                                NOTAS <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="edit_nomor_ba"
                                placeholder="Masukkan NOTAS"
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
                            <Label htmlFor="edit_tanggal">Tanggal Kejadian</Label>
                            <Input
                                id="edit_tanggal"
                                type="date"
                                value={formData.tanggal_kejadian}
                                onChange={(e) =>
                                    setFormData({ ...formData, tanggal_kejadian: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="edit_nama">
                            Nama Pihak / Pelapor <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="edit_nama"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            required
                        />
                        {formErrors.nama && (
                            <p className="text-xs text-rose-500">{formErrors.nama}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="edit_permasalahan">
                            Uraian Permasalahan <span className="text-rose-500">*</span>
                        </Label>
                        <Textarea
                            id="edit_permasalahan"
                            rows={3}
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
                        <Label htmlFor="edit_solusi">
                            Solusi & Tindak Lanjut <span className="text-rose-500">*</span>
                        </Label>
                        <Textarea
                            id="edit_solusi"
                            rows={3}
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
                            <Label htmlFor="edit_status">Status Penanganan</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger id="edit_status">
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
                            <Label htmlFor="edit_file_notas">Ganti Berkas Notas (Opsional)</Label>
                            <Input
                                id="edit_file_notas"
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    onFileChange(e.target.files?.[0] ?? null);
                                }}
                            />
                            {selectedItem?.file_notas_name && (
                                <p className="text-[11px] text-muted-foreground truncate">
                                    File saat ini: {selectedItem.file_notas_name} (
                                    {formatFileSize(selectedItem.file_notas_size)})
                                </p>
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
                            {isSubmitting ? 'Menyimpan...' : 'Perbarui Berita Acara'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
