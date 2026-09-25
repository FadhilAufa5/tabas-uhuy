import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ReferensiKasus } from '@/types';

interface RkDeleteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: ReferensiKasus | null;
    isSubmitting: boolean;
    onConfirm: () => void;
}

export function RkDeleteModal({ open, onOpenChange, item, isSubmitting, onConfirm }: RkDeleteModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-rose-600">
                        <Trash2 className="size-5" /> Hapus Referensi Kasus
                    </DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus referensi kasus{' '}
                        <span className="font-semibold text-foreground">
                            {item?.kode_kasus || `ID ${item?.id}`}
                        </span>
                        ? Data yang terhapus tidak dapat dikembalikan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button onClick={onConfirm} disabled={isSubmitting} className="bg-rose-600 hover:bg-rose-700 text-white">
                        {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
