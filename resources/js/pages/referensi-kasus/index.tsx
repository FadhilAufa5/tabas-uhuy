import { Head, router } from '@inertiajs/react';
import { BookOpenCheck, Download, Plus, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useFlashToast } from '@/hooks/use-flash-toast';
import type { PaginatedData, ReferensiKasus } from '@/types';
import {
    RkCreateModal,
    RkDeleteModal,
    RkDetailModal,
    RkEditModal,
    RkImportModal,
    RkStats,
    RkTable,
    type RkFormData,
} from '@/components/referensi-kasus';

interface Props {
    items: PaginatedData<ReferensiKasus>;
    filters: {
        search: string;
        kategori: string;
    };
    categories: string[];
    stats: {
        total: number;
        categories_count: number;
    };
}

const DEFAULT_FORM: RkFormData = {
    kode_kasus: '',
    kategori: 'Klaim',
    kasus: '',
    penyelesaian: '',
    aturan: '',
    lampiran: null,
    hapus_lampiran: false,
};

/** Build a FormData payload from RkFormData so files are sent as multipart */
function buildFormData(data: RkFormData): FormData {
    const fd = new FormData();
    fd.append('kode_kasus',   data.kode_kasus);
    fd.append('kategori',     data.kategori);
    fd.append('kasus',        data.kasus);
    fd.append('penyelesaian', data.penyelesaian);
    fd.append('aturan',       data.aturan);
    if (data.lampiran) fd.append('lampiran', data.lampiran);
    if (data.hapus_lampiran) fd.append('hapus_lampiran', '1');
    return fd;
}

export default function ReferensiKasusPage({ items, filters, categories, stats }: Props) {
    useFlashToast();

    // ── Modal states ──────────────────────────────────────────────────────────
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen]     = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState<ReferensiKasus | null>(null);
    const [copiedId, setCopiedId]         = useState<number | null>(null);

    // ── Form states ───────────────────────────────────────────────────────────
    const [formData, setFormData]         = useState<RkFormData>(DEFAULT_FORM);
    const [importFile, setImportFile]     = useState<File | null>(null);
    const [formErrors, setFormErrors]     = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleOpenCreate = () => {
        setFormData(DEFAULT_FORM);
        setFormErrors({});
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (item: ReferensiKasus) => {
        setSelectedItem(item);
        setFormData({
            kode_kasus:    item.kode_kasus || '',
            kategori:      item.kategori,
            kasus:         item.kasus,
            penyelesaian:  item.penyelesaian,
            aturan:        item.aturan || '',
            lampiran:      null,
            hapus_lampiran: false,
        });
        setFormErrors({});
        setIsEditOpen(true);
    };

    const handleOpenDetail = (item: ReferensiKasus) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const handleOpenDelete = (item: ReferensiKasus) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post('/referensi-kasus', buildFormData(formData), {
            forceFormData: true,
            onError: (err) => { setFormErrors(err); setIsSubmitting(false); },
            onSuccess: () => { setIsCreateOpen(false); setIsSubmitting(false); },
        });
    };

    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;
        setIsSubmitting(true);
        const fd = buildFormData(formData);
        fd.append('_method', 'PUT');
        router.post(`/referensi-kasus/${selectedItem.id}`, fd, {
            forceFormData: true,
            onError: (err) => { setFormErrors(err); setIsSubmitting(false); },
            onSuccess: () => { setIsEditOpen(false); setIsSubmitting(false); },
        });
    };

    const handleConfirmDelete = () => {
        if (!selectedItem) return;
        setIsSubmitting(true);
        router.delete(`/referensi-kasus/${selectedItem.id}`, {
            onSuccess: () => { setIsDeleteOpen(false); setIsSubmitting(false); },
            onError: () => setIsSubmitting(false),
        });
    };

    const handleSubmitImport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!importFile) { toast.error('Silakan pilih file CSV terlebih dahulu.'); return; }
        setIsSubmitting(true);
        const data = new FormData();
        data.append('file_csv', importFile);
        router.post('/referensi-kasus/import-csv', data, {
            forceFormData: true,
            onError: (err) => { setFormErrors(err); setIsSubmitting(false); },
            onSuccess: () => { setIsImportOpen(false); setImportFile(null); setIsSubmitting(false); },
        });
    };

    const handleCopySolution = (item: ReferensiKasus) => {
        const text = `[KASUS: ${item.kasus}]\n\n[PENYELESAIAN]:\n${item.penyelesaian}\n\n[DASAR ATURAN]:\n${item.aturan || '-'}`;
        navigator.clipboard.writeText(text);
        setCopiedId(item.id);
        toast.success('Penyelesaian dan dasar aturan berhasil disalin!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <>
            <Head title="Referensi Kasus & Aturan - Taspedia" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                <BookOpenCheck className="size-6" />
                            </div>
                            Referensi Kasus &amp; Solusi SOP
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Pangkalan data studi kasus, panduan penyelesaian teknis, dan dasar regulasi hukum Taspen.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)} className="shadow-xs">
                            <Upload className="mr-1.5 size-4" /> Import CSV
                        </Button>
                        <a href="/referensi-kasus/export-csv" download>
                            <Button variant="outline" size="sm" className="shadow-xs">
                                <Download className="mr-1.5 size-4" /> Export CSV
                            </Button>
                        </a>
                        <Button onClick={handleOpenCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all">
                            <Plus className="mr-1.5 size-4" /> Tambah Kasus
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <RkStats stats={stats} />

                {/* Table */}
                <RkTable
                    items={items}
                    filters={filters}
                    categories={categories}
                    copiedId={copiedId}
                    onOpenDetail={handleOpenDetail}
                    onOpenEdit={handleOpenEdit}
                    onOpenDelete={handleOpenDelete}
                    onCopy={handleCopySolution}
                />
            </div>

            {/* Modals */}
            <RkDetailModal
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                item={selectedItem}
                onEdit={handleOpenEdit}
                onCopy={handleCopySolution}
            />

            <RkCreateModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmitCreate}
            />

            <RkEditModal
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmitEdit}
                selectedItem={selectedItem}
            />

            <RkImportModal
                open={isImportOpen}
                onOpenChange={setIsImportOpen}
                formErrors={formErrors}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmitImport}
                onFileChange={setImportFile}
            />

            <RkDeleteModal
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                item={selectedItem}
                isSubmitting={isSubmitting}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
