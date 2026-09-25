import {
    Download,
    File as FileIcon,
    FileImage,
    FileSpreadsheet,
    FileText,
    Paperclip,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileIcon(name: string, mimeType?: string) {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    const mime = mimeType ?? '';

    if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
        return <FileImage className="size-5 text-blue-500" />;
    }
    if (mime === 'application/pdf' || ext === 'pdf') {
        return <FileText className="size-5 text-rose-500" />;
    }
    if (['xls', 'xlsx'].includes(ext) || mime.includes('spreadsheet') || mime.includes('excel')) {
        return <FileSpreadsheet className="size-5 text-emerald-500" />;
    }
    if (['doc', 'docx'].includes(ext) || mime.includes('word')) {
        return <FileText className="size-5 text-blue-600" />;
    }
    return <FileIcon className="size-5 text-muted-foreground" />;
}

// ── Sub-components ──────────────────────────────────────────────────────────

interface ExistingLampiranProps {
    name: string;
    size?: number | null;
    url?: string | null;
    onRemove: () => void;
}

function ExistingLampiran({ name, size, url, onRemove }: ExistingLampiranProps) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="shrink-0">{getFileIcon(name)}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{name}</p>
                {size != null && (
                    <p className="text-xs text-muted-foreground">{formatBytes(size)}</p>
                )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
                {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" download>
                        <Button type="button" variant="ghost" size="icon" className="size-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40" title="Unduh Lampiran">
                            <Download className="size-4" />
                        </Button>
                    </a>
                )}
                <Button type="button" variant="ghost" size="icon" className="size-8 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40" title="Hapus Lampiran" onClick={onRemove}>
                    <Trash2 className="size-4" />
                </Button>
            </div>
        </div>
    );
}

// ── Main Component ──────────────────────────────────────────────────────────

interface RkLampiranUploadProps {
    /** Currently selected new file (controlled by parent) */
    value: File | null | undefined;
    onChange: (file: File | null) => void;
    /** Existing lampiran from DB (for edit mode) */
    existingName?: string | null;
    existingSize?: number | null;
    existingUrl?: string | null;
    /** Called when user explicitly wants to remove the existing lampiran */
    onRemoveExisting?: () => void;
    /** Whether the existing lampiran is marked for deletion */
    markedForRemoval?: boolean;
    error?: string;
}

export function RkLampiranUpload({
    value,
    onChange,
    existingName,
    existingSize,
    existingUrl,
    onRemoveExisting,
    markedForRemoval = false,
    error,
}: RkLampiranUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [sizeError, setSizeError] = useState<string | null>(null);

    const validate = useCallback((file: File): string | null => {
        if (file.size > MAX_SIZE_BYTES) {
            return `Ukuran file terlalu besar (${formatBytes(file.size)}). Maksimal 5 MB.`;
        }
        if (!ACCEPTED_TYPES.includes(file.type)) {
            return 'Tipe file tidak didukung. Gunakan gambar (jpg, png, gif, webp), PDF, Word, atau Excel.';
        }
        return null;
    }, []);

    const handleFile = useCallback((file: File | null) => {
        if (!file) { onChange(null); setSizeError(null); return; }
        const err = validate(file);
        if (err) { setSizeError(err); return; }
        setSizeError(null);
        onChange(file);
    }, [validate, onChange]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0] ?? null;
        handleFile(file);
    }, [handleFile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files?.[0] ?? null);
        // Reset input so same file can be re-selected after clear
        e.target.value = '';
    };

    const clearSelected = () => { onChange(null); setSizeError(null); };

    const displayError = sizeError ?? error;
    const hasExisting  = !!existingName && !markedForRemoval;
    const hasNew       = !!value;

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-1.5">
                <Paperclip className="size-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">Lampiran Pendukung</span>
                <span className="text-xs text-muted-foreground">(Opsional, maks. 5 MB)</span>
            </div>

            {/* Show existing file */}
            {hasExisting && (
                <ExistingLampiran
                    name={existingName!}
                    size={existingSize}
                    url={existingUrl}
                    onRemove={() => { onRemoveExisting?.(); clearSelected(); }}
                />
            )}

            {/* Show newly selected file */}
            {hasNew && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-300 dark:border-emerald-800">
                    <div className="shrink-0">{getFileIcon(value!.name, value!.type)}</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{value!.name}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">{formatBytes(value!.size)} · Siap diunggah</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="size-8 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0" onClick={clearSelected} title="Batal pilih file">
                        <X className="size-4" />
                    </Button>
                </div>
            )}

            {/* Drag & drop zone — shown when no new file selected and (!hasExisting OR hasExisting shows replace option) */}
            {!hasNew && (
                <div
                    className={`
                        relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed
                        p-5 text-center cursor-pointer transition-all duration-200 select-none
                        ${dragOver
                            ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
                            : 'border-border hover:border-emerald-400 hover:bg-muted/40 bg-muted/20'
                        }
                    `}
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
                >
                    <div className={`flex size-10 items-center justify-center rounded-full transition-colors ${dragOver ? 'bg-emerald-500/20' : 'bg-muted'}`}>
                        <Upload className={`size-5 ${dragOver ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            {hasExisting ? 'Ganti lampiran' : 'Klik atau seret file ke sini'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Gambar (JPG, PNG, GIF, WebP), PDF, Word, Excel · Maks. 5 MB
                        </p>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        className="sr-only"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleInputChange}
                    />
                </div>
            )}

            {displayError && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                    <X className="size-3" /> {displayError}
                </p>
            )}
        </div>
    );
}
