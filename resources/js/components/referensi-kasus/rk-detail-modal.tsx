import { BookOpenCheck, Copy, Download, File as FileIcon, FileImage, FileSpreadsheet, FileText, Paperclip, Pencil, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import type { ReferensiKasus } from '@/types';
import { getCfg } from './types';

interface RkDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: ReferensiKasus | null;
    onEdit: (item: ReferensiKasus) => void;
    onCopy: (item: ReferensiKasus) => void;
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileIcon(name: string) {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <FileImage className="size-4 text-blue-500" />;
    if (ext === 'pdf') return <FileText className="size-4 text-rose-500" />;
    if (['xls', 'xlsx'].includes(ext)) return <FileSpreadsheet className="size-4 text-emerald-500" />;
    if (['doc', 'docx'].includes(ext)) return <FileText className="size-4 text-blue-600" />;
    return <FileIcon className="size-4 text-muted-foreground" />;
}

export function RkDetailModal({ open, onOpenChange, item, onEdit, onCopy }: RkDetailModalProps) {
    if (!item) return null;

    const cfg = getCfg(item.kategori);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto p-0">
                {/* Gradient header */}
                <div className={`bg-gradient-to-br ${cfg.gradient} p-5 text-white`}>
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                            <BookOpenCheck className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[11px] font-mono font-bold bg-white/25 px-2 py-0.5 rounded">
                                    {item.kode_kasus ?? `KS-${item.id}`}
                                </span>
                                <span className="text-[11px] font-semibold bg-white/25 px-2 py-0.5 rounded">
                                    {item.kategori}
                                </span>
                            </div>
                            <p className="text-sm font-semibold leading-relaxed text-white/95">
                                {item.kasus}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-5 space-y-4">
                    {/* Penyelesaian */}
                    <div className="space-y-1.5">
                        <p className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${cfg.color}`}>
                            <FileText className="size-3.5" /> Tindak Lanjut Penyelesaian
                        </p>
                        <div className={`rounded-xl ${cfg.bg} ${cfg.border} border p-4`}>
                            <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                                {item.penyelesaian || '-'}
                            </p>
                        </div>
                    </div>

                    {/* Aturan */}
                    {item.aturan && (
                        <div className="space-y-1.5">
                            <p className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                                <Scale className="size-3.5" /> Dasar Hukum &amp; Regulasi
                            </p>
                            <div className="rounded-xl bg-purple-500/10 border border-purple-300 dark:border-purple-800 p-4">
                                <p className="text-sm leading-relaxed text-foreground font-medium">
                                    {item.aturan}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Lampiran */}
                    {item.lampiran_name && (
                        <div className="space-y-1.5">
                            <p className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                <Paperclip className="size-3.5" /> Lampiran Pendukung
                            </p>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                                <div className="shrink-0">{getFileIcon(item.lampiran_name)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{item.lampiran_name}</p>
                                    {item.lampiran_size != null && (
                                        <p className="text-xs text-muted-foreground">{formatBytes(item.lampiran_size)}</p>
                                    )}
                                </div>
                                {item.lampiran_url && (
                                    <a href={item.lampiran_url} target="_blank" rel="noopener noreferrer" download>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="shrink-0 gap-1.5 text-blue-600 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                        >
                                            <Download className="size-3.5" /> Unduh
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 pt-1 border-t border-border">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => { onOpenChange(false); onEdit(item); }}
                        >
                            <Pencil className="mr-2 size-4" /> Edit
                        </Button>
                        <Button
                            className={`flex-1 bg-gradient-to-r ${cfg.gradient} text-white hover:opacity-90`}
                            onClick={() => { onCopy(item); onOpenChange(false); }}
                        >
                            <Copy className="mr-2 size-4" /> Salin Solusi
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
