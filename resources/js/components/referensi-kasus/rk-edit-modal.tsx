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
import type { ReferensiKasus } from '@/types';
import { RkLampiranUpload } from './rk-lampiran-upload';
import { SEMUA_KATEGORI, type RkFormData } from './types';

interface RkEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formData: RkFormData;
    setFormData: React.Dispatch<React.SetStateAction<RkFormData>>;
    formErrors: Record<string, string>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    /** The item being edited — used to display existing lampiran info */
    selectedItem: ReferensiKasus | null;
}

export function RkEditModal({
    open,
    onOpenChange,
    formData,
    setFormData,
    formErrors,
    isSubmitting,
    onSubmit,
    selectedItem,
}: RkEditModalProps) {
    const handleRemoveExisting = () => {
        setFormData({ ...formData, hapus_lampiran: true, lampiran: null });
    };

    const existingLampiranActive =
        !!selectedItem?.lampiran_name && !formData.hapus_lampiran && !formData.lampiran;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pencil className="size-5 text-emerald-600" /> Edit Referensi Kasus
                    </DialogTitle>
                    <DialogDescription>Perbarui rincian kasus, solusi tindak lanjut, atau dasar aturan hukum.</DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit_kode">Kode Kasus</Label>
                            <Input
                                id="edit_kode"
                                value={formData.kode_kasus}
                                onChange={(e) => setFormData({ ...formData, kode_kasus: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit_kategori">Kategori Layanan</Label>
                            <Select value={formData.kategori} onValueChange={(val) => setFormData({ ...formData, kategori: val })}>
                                <SelectTrigger id="edit_kategori"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {SEMUA_KATEGORI.map((k) => (
                                        <SelectItem key={k} value={k}>{k}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="edit_kasus">Uraian Kasus</Label>
                        <Textarea
                            id="edit_kasus"
                            rows={3}
                            value={formData.kasus}
                            onChange={(e) => setFormData({ ...formData, kasus: e.target.value })}
                            required
                        />
                        {formErrors.kasus && <p className="text-xs text-rose-500">{formErrors.kasus}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="edit_penyelesaian">Langkah Penyelesaian / Tindak Lanjut</Label>
                        <Textarea
                            id="edit_penyelesaian"
                            rows={4}
                            value={formData.penyelesaian}
                            onChange={(e) => setFormData({ ...formData, penyelesaian: e.target.value })}
                            required
                        />
                        {formErrors.penyelesaian && <p className="text-xs text-rose-500">{formErrors.penyelesaian}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="edit_aturan">Dasar Aturan</Label>
                        <Input
                            id="edit_aturan"
                            value={formData.aturan}
                            onChange={(e) => setFormData({ ...formData, aturan: e.target.value })}
                        />
                    </div>

                    {/* Lampiran Upload — shows existing + option to replace/remove */}
                    <RkLampiranUpload
                        value={formData.lampiran ?? null}
                        onChange={(file) => setFormData({ ...formData, lampiran: file, hapus_lampiran: false })}
                        existingName={existingLampiranActive ? selectedItem?.lampiran_name : null}
                        existingSize={existingLampiranActive ? selectedItem?.lampiran_size : null}
                        existingUrl={existingLampiranActive ? selectedItem?.lampiran_url : null}
                        onRemoveExisting={handleRemoveExisting}
                        markedForRemoval={!!formData.hapus_lampiran}
                        error={formErrors.lampiran}
                    />

                    <DialogFooter className="pt-3">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSubmitting}>
                            {isSubmitting ? 'Menyimpan...' : 'Perbarui Referensi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
