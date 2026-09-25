import { Upload } from 'lucide-react';
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

interface RkImportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formErrors: Record<string, string>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onFileChange: (file: File | null) => void;
}

export function RkImportModal({
    open,
    onOpenChange,
    formErrors,
    isSubmitting,
    onSubmit,
    onFileChange,
}: RkImportModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-emerald-600">
                        <Upload className="size-5" /> Import Referensi Kasus dari CSV
                    </DialogTitle>
                    <DialogDescription>
                        Unggah file CSV dengan header:{' '}
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                            kode_kasus, kategori, kasus, penyelesaian, aturan
                        </code>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="csv_file">Pilih File CSV (.csv)</Label>
                        <Input
                            id="csv_file"
                            type="file"
                            accept=".csv,text/csv"
                            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                            required
                        />
                        {formErrors.file_csv && <p className="text-xs text-rose-500">{formErrors.file_csv}</p>}
                    </div>

                    <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1 text-muted-foreground border">
                        <p className="font-semibold text-foreground">Format CSV yang didukung:</p>
                        <p>1. Baris pertama berisi header nama kolom.</p>
                        <p>2. Kolom <span className="font-medium text-foreground">kasus</span> dan <span className="font-medium text-foreground">penyelesaian</span> wajib terisi.</p>
                        <p>3. Format UTF-8 disarankan untuk teks dengan karakter khusus.</p>
                    </div>

                    <DialogFooter className="pt-3">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSubmitting}>
                            {isSubmitting ? 'Mengimpor...' : 'Mulai Import CSV'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
