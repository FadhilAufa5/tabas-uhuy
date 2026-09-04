import { Copy } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ReferensiKasus } from '@/types';

interface DashboardCaseModalProps {
    selectedCase: ReferensiKasus | null;
    onClose: () => void;
    onCopySolution: (item: ReferensiKasus) => void;
}

export function DashboardCaseModal({
    selectedCase,
    onClose,
    onCopySolution,
}: DashboardCaseModalProps) {
    return (
        <Dialog
            open={!!selectedCase}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                            {selectedCase?.kode_kasus || `KS-${selectedCase?.id}`}
                        </span>
                        <Badge variant="outline">{selectedCase?.kategori}</Badge>
                    </div>
                    <DialogTitle className="text-base font-bold pt-2 text-foreground">
                        {selectedCase?.kasus}
                    </DialogTitle>
                </DialogHeader>

                {selectedCase && (
                    <div className="space-y-4 py-2 text-sm">
                        <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Langkah Penyelesaian / Solusi SOP:
                            </span>
                            <div className="p-3.5 rounded-lg bg-muted/40 border border-border leading-relaxed text-foreground whitespace-pre-line text-xs">
                                {selectedCase.penyelesaian}
                            </div>
                        </div>

                        {selectedCase.aturan && (
                            <div className="space-y-1.5">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Dasar Aturan & Regulasi:
                                </span>
                                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-200 text-xs font-medium">
                                    📜 {selectedCase.aturan}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onCopySolution(selectedCase)}
                                className="text-xs"
                            >
                                <Copy className="mr-1.5 size-3.5" /> Salin Solusi
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={onClose}
                                className="text-xs"
                            >
                                Tutup
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
