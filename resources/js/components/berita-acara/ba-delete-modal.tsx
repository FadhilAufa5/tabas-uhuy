import { Trash2 } from 'lucide-react';
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
import type { BeritaAcara } from './types';

interface BaDeleteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: BeritaAcara | null;
    isSubmitting: boolean;
    onConfirm: () => void;
}

export function BaDeleteModal({
    open,
    onOpenChange,
    item,
    isSubmitting,
    onConfirm,
}: BaDeleteModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-rose-600">
                        <Trash2 className="size-5" /> Hapus Berita Acara
                    </DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus Berita Acara dengan NOTAS{' '}
                        <span className="font-semibold text-foreground">
                            {item?.nomor_berita_acara}
                        </span>
                        ? Tindakan ini tidak dapat dibatalkan dan berkas lampiran yang tersimpan akan
                        dihapus.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="pt-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Menghapus...' : 'Hapus Dokumen'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
