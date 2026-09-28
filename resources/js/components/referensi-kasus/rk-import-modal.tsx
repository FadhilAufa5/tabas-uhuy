import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, FileText, Loader2, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface RkImportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formErrors: Record<string, string>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onFileChange: (file: File | null) => void;
    importFile?: File | null;
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function RkImportModal({
    open,
    onOpenChange,
    formErrors,
    isSubmitting,
    onSubmit,
    onFileChange,
    importFile,
}: RkImportModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFileState, setSelectedFileState] = useState<File | null>(importFile ?? null);

    const activeFile = importFile !== undefined ? importFile : selectedFileState;

    const handleFileSelect = (file: File | null) => {
        setSelectedFileState(file);
        onFileChange(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            handleFileSelect(file);
        }
    };

    const handleRemoveFile = () => {
        handleFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const isExcel = activeFile?.name.endsWith('.xlsx') || activeFile?.name.endsWith('.xls');
    const isCsv = activeFile?.name.endsWith('.csv') || activeFile?.name.endsWith('.txt');

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val && !isSubmitting) {
                handleFileSelect(null);
            }
            onOpenChange(val);
        }}>
            <DialogContent className="sm:max-w-[540px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2.5 text-foreground">
                        <div className="p-2 rounded-lg bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                            <Upload className="size-5" />
                        </div>
                        Import Referensi Kasus
                    </DialogTitle>
                    <DialogDescription>
                        Unggah berkas spreadsheet <strong>CSV</strong> (.csv) atau <strong>Excel</strong> (.xlsx, .xls) untuk menambahkan data referensi kasus dan solusi SOP secara massal.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 py-1">
                    {/* Upload Dropzone */}
                    <div className="space-y-2">
                        <Label htmlFor="import_file" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Pilih Berkas CSV / Excel
                        </Label>

                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                                isDragging
                                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 scale-[1.01]'
                                    : activeFile
                                    ? 'border-emerald-600/40 bg-emerald-50/30 dark:bg-emerald-950/10'
                                    : 'border-muted-foreground/25 hover:border-emerald-500/60 hover:bg-muted/40'
                            }`}
                        >
                            <input
                                id="import_file"
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    handleFileSelect(file);
                                }}
                            />

                            {activeFile ? (
                                <div className="flex items-center justify-between gap-3 text-left">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-2.5 rounded-lg bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0">
                                            {isExcel ? (
                                                <FileSpreadsheet className="size-6" />
                                            ) : (
                                                <FileText className="size-6" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm text-foreground truncate">
                                                {activeFile.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-muted-foreground">
                                                    {formatFileSize(activeFile.size)}
                                                </span>
                                                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
                                                    {isExcel ? 'Excel' : isCsv ? 'CSV' : 'Spreadsheet'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFile();
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="mx-auto size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                        <Upload className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            Klik untuk memilih atau seret berkas ke sini
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Mendukung CSV (.csv) dan Excel (.xlsx, .xls) hingga 10MB
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {(formErrors.file_csv || formErrors.file || formErrors.file_excel) && (
                            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                                <AlertCircle className="size-3.5" />
                                {formErrors.file_csv || formErrors.file || formErrors.file_excel}
                            </p>
                        )}
                    </div>

                    {/* Panduan Format Kolom */}
                    <div className="p-3.5 bg-muted/40 rounded-xl text-xs space-y-2 text-muted-foreground border">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground flex items-center gap-1.5">
                                <CheckCircle2 className="size-3.5 text-emerald-600" />
                                Format Kolom Header yang Didukung:
                            </span>
                            <a
                                href="/referensi-kasus/template"
                                download
                                className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium text-[11px]"
                            >
                                <Download className="size-3" /> Unduh Template
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                            <code className="px-1.5 py-0.5 rounded bg-background border font-mono text-[11px]">kode_kasus</code>
                            <code className="px-1.5 py-0.5 rounded bg-background border font-mono text-[11px]">kategori</code>
                            <code className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono text-[11px] font-semibold">kasus *</code>
                            <code className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono text-[11px] font-semibold">penyelesaian *</code>
                            <code className="px-1.5 py-0.5 rounded bg-background border font-mono text-[11px]">aturan</code>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                            * Kolom <span className="font-medium text-foreground">kasus</span> dan <span className="font-medium text-foreground">penyelesaian</span> wajib terisi pada setiap baris. Kolom lainnya bersifat opsional dan akan otomatis dibuat jika kosong.
                        </p>
                    </div>

                    <DialogFooter className="pt-2 gap-2 sm:gap-0">
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
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                            disabled={isSubmitting || !activeFile}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Mengimpor Data...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-1.5 size-4" />
                                    Mulai Import
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
