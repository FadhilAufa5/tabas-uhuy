import { Plus } from 'lucide-react';
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
import { RkLampiranUpload } from './rk-lampiran-upload';
import { SEMUA_KATEGORI, type RkFormData } from './types';

interface RkCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formData: RkFormData;
    setFormData: React.Dispatch<React.SetStateAction<RkFormData>>;
    formErrors: Record<string, string>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function RkCreateModal({
    open,
    onOpenChange,
    formData,
    setFormData,
    formErrors,
    isSubmitting,
    onSubmit,
}: RkCreateModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="size-5 text-emerald-600" /> Tambah Referensi Kasus
                    </DialogTitle>
                    <DialogDescription>
                        Tambahkan skenario permasalahan baru beserta panduan solusi dan dasar regulasinya.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="kode_kasus">Kode Kasus (Opsional)</Label>
                            <Input
                                id="kode_kasus"
                                placeholder="Contoh: KS-013"
                                value={formData.kode_kasus}
                                onChange={(e) => setFormData({ ...formData, kode_kasus: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="kategori">Kategori Layanan <span className="text-rose-500">*</span></Label>
                            <Select value={formData.kategori} onValueChange={(val) => setFormData({ ...formData, kategori: val })}>
                                <SelectTrigger id="kategori"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                                <SelectContent>
                                    {SEMUA_KATEGORI.map((k) => (
                                        <SelectItem key={k} value={k}>{k}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="kasus">Uraian Kasus / Skenario Permasalahan <span className="text-rose-500">*</span></Label>
                        <Textarea
                            id="kasus"
                            rows={3}
                            placeholder="Deskripsikan kasus permasalahan yang sering dialami..."
                            value={formData.kasus}
                            onChange={(e) => setFormData({ ...formData, kasus: e.target.value })}
                            required
                        />
                        {formErrors.kasus && <p className="text-xs text-rose-500">{formErrors.kasus}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="penyelesaian">Langkah Penyelesaian / Tindak Lanjut <span className="text-rose-500">*</span></Label>
                        <Textarea
                            id="penyelesaian"
                            rows={4}
                            placeholder="Jelaskan tahapan solusi penanganan..."
                            value={formData.penyelesaian}
                            onChange={(e) => setFormData({ ...formData, penyelesaian: e.target.value })}
                            required
                        />
                        {formErrors.penyelesaian && <p className="text-xs text-rose-500">{formErrors.penyelesaian}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="aturan">Dasar Hukum / Regulasi / Surat Edaran</Label>
                        <Input
                            id="aturan"
                            placeholder="Contoh: PP No. 70 Tahun 2015 Pasal 9 & Perdir Taspen No. 03/2021"
                            value={formData.aturan}
                            onChange={(e) => setFormData({ ...formData, aturan: e.target.value })}
                        />
                    </div>

                    {/* Lampiran Upload */}
                    <RkLampiranUpload
                        value={formData.lampiran ?? null}
                        onChange={(file) => setFormData({ ...formData, lampiran: file })}
                        error={formErrors.lampiran}
                    />

                    <DialogFooter className="pt-3">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSubmitting}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Referensi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
