import { Head, router } from '@inertiajs/react';
import {
    BookOpenCheck,
    Check,
    Copy,
    Download,
    FileSpreadsheet,
    FileText,
    Filter,
    Layers,
    Pencil,
    Plus,
    Scale,
    Search,
    Trash2,
    Upload,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useFlashToast } from '@/hooks/use-flash-toast';
import type { PaginatedData, ReferensiKasus } from '@/types';

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

export default function ReferensiKasusPage({
    items,
    filters,
    categories,
    stats,
}: Props) {
    useFlashToast();

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [kategoriFilter, setKategoriFilter] = useState(
        filters.kategori || 'all'
    );

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState<ReferensiKasus | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // Forms
    const [formData, setFormData] = useState({
        kode_kasus: '',
        kategori: 'Klaim',
        kasus: '',
        penyelesaian: '',
        aturan: '',
    });
    const [importFile, setImportFile] = useState<File | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search & Filter
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/referensi-kasus',
            {
                search: searchQuery,
                kategori: kategoriFilter,
            },
            { preserveState: true }
        );
    };

    const handleKategoriChange = (val: string) => {
        setKategoriFilter(val);
        router.get(
            '/referensi-kasus',
            {
                search: searchQuery,
                kategori: val,
            },
            { preserveState: true }
        );
    };

    // Open Modals
    const handleOpenCreate = () => {
        setFormData({
            kode_kasus: '',
            kategori: 'Klaim',
            kasus: '',
            penyelesaian: '',
            aturan: '',
        });
        setFormErrors({});
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (item: ReferensiKasus) => {
        setSelectedItem(item);
        setFormData({
            kode_kasus: item.kode_kasus || '',
            kategori: item.kategori,
            kasus: item.kasus,
            penyelesaian: item.penyelesaian,
            aturan: item.aturan || '',
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

    // Submit Create
    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post('/referensi-kasus', formData, {
            onError: (err) => {
                setFormErrors(err);
                setIsSubmitting(false);
            },
            onSuccess: () => {
                setIsCreateOpen(false);
                setIsSubmitting(false);
            },
        });
    };

    // Submit Edit
    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;
        setIsSubmitting(true);
        router.put(`/referensi-kasus/${selectedItem.id}`, formData, {
            onError: (err) => {
                setFormErrors(err);
                setIsSubmitting(false);
            },
            onSuccess: () => {
                setIsEditOpen(false);
                setIsSubmitting(false);
            },
        });
    };

    // Confirm Delete
    const handleConfirmDelete = () => {
        if (!selectedItem) return;
        setIsSubmitting(true);
        router.delete(`/referensi-kasus/${selectedItem.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setIsSubmitting(false);
            },
            onError: () => setIsSubmitting(false),
        });
    };

    // Submit Import CSV
    const handleSubmitImport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!importFile) {
            toast.error('Silakan pilih file CSV terlebih dahulu.');
            return;
        }
        setIsSubmitting(true);

        const data = new FormData();
        data.append('file_csv', importFile);

        router.post('/referensi-kasus/import-csv', data, {
            onError: (err) => {
                setFormErrors(err);
                setIsSubmitting(false);
            },
            onSuccess: () => {
                setIsImportOpen(false);
                setImportFile(null);
                setIsSubmitting(false);
            },
        });
    };

    // Copy to clipboard
    const handleCopySolution = (item: ReferensiKasus) => {
        const text = `[KASUS: ${item.kasus}]\n\n[PENYELESAIAN]:\n${item.penyelesaian}\n\n[DASAR ATURAN]:\n${item.aturan || '-'}`;
        navigator.clipboard.writeText(text);
        setCopiedId(item.id);
        toast.success('Penyelesaian dan dasar aturan berhasil disalin!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getKategoriBadge = (kategori: string) => {
        const colors: Record<string, string> = {
            Klaim: 'bg-emerald-500/15 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300',
            Kepesertaan: 'bg-blue-500/15 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300',
            Pensiun: 'bg-purple-500/15 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300',
            Teknis: 'bg-amber-500/15 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300',
            Mutasi: 'bg-cyan-500/15 text-cyan-700 border-cyan-300 dark:bg-cyan-950/40 dark:text-cyan-300',
            Administrasi: 'bg-indigo-500/15 text-indigo-700 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300',
        };

        const className = colors[kategori] || 'bg-muted text-muted-foreground';
        return <Badge className={`${className} font-medium text-xs`}>{kategori}</Badge>;
    };

    return (
        <>
            <Head title="Referensi Kasus & Aturan - Layanan Taspen" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Title & Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                <BookOpenCheck className="size-6" />
                            </div>
                            Referensi Kasus & Solusi SOP
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Pangkalan data studi kasus, panduan penyelesaian teknis, dan dasar regulasi hukum Taspen.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsImportOpen(true)}
                            className="shadow-xs"
                        >
                            <Upload className="mr-1.5 size-4" /> Import CSV
                        </Button>
                        <a href="/referensi-kasus/export-csv" download>
                            <Button variant="outline" size="sm" className="shadow-xs">
                                <Download className="mr-1.5 size-4" /> Export CSV
                            </Button>
                        </a>
                        <Button
                            onClick={handleOpenCreate}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
                        >
                            <Plus className="mr-1.5 size-4" /> Tambah Kasus
                        </Button>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Kasus Terdata
                            </CardTitle>
                            <BookOpenCheck className="size-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {stats.total}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Referensi SOP dan penyelesaian kasus
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Kategori Layanan
                            </CardTitle>
                            <Layers className="size-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {stats.categories_count} Kategori
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Klaim, Kepesertaan, Pensiun, Teknis, Mutasi, Administrasi
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs sm:col-span-2 lg:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Dasar Regulasi & Hukum
                            </CardTitle>
                            <Scale className="size-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-semibold text-foreground">
                                UU 11/1969, PP 70/2015, PP 66/2017
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Diselaraskan dengan petunjuk teknis PT Taspen
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table & Filter Card */}
                <Card className="border-border/70 shadow-xs">
                    <CardHeader className="p-4 sm:p-6 pb-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 max-w-md">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari kata kunci kasus, solusi, dasar aturan..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 bg-background/80"
                                    />
                                </div>
                                <Button type="submit" variant="secondary" size="sm">
                                    Cari
                                </Button>
                            </form>

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-muted-foreground">Kategori:</span>
                                <Select value={kategoriFilter} onValueChange={handleKategoriChange}>
                                    <SelectTrigger className="w-[150px] h-9">
                                        <SelectValue placeholder="Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/40">
                                    <TableRow>
                                        <TableHead className="w-[100px] font-semibold">Kode</TableHead>
                                        <TableHead className="w-[120px] font-semibold">Kategori</TableHead>
                                        <TableHead className="min-w-[260px] font-semibold">Kasus / Masalah</TableHead>
                                        <TableHead className="min-w-[280px] font-semibold">Penyelesaian / Solusi</TableHead>
                                        <TableHead className="min-w-[200px] font-semibold">Dasar Aturan</TableHead>
                                        <TableHead className="w-[140px] text-right font-semibold">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <FileSpreadsheet className="size-8 text-muted-foreground/60" />
                                                    <p className="font-medium">Tidak ada referensi kasus yang cocok.</p>
                                                    <p className="text-xs">Gunakan kata kunci pencarian lain atau klik "Import CSV" / "Tambah Kasus".</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.data.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {item.kode_kasus || `KS-${item.id}`}
                                                </TableCell>
                                                <TableCell>{getKategoriBadge(item.kategori)}</TableCell>
                                                <TableCell className="max-w-[300px]">
                                                    <p className="text-xs font-medium text-foreground leading-relaxed">
                                                        {item.kasus}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="max-w-[320px]">
                                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                                        {item.penyelesaian}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="max-w-[220px]">
                                                    {item.aturan ? (
                                                        <div className="flex items-start gap-1.5 text-xs text-purple-700 dark:text-purple-300 font-medium">
                                                            <Scale className="size-3.5 shrink-0 mt-0.5" />
                                                            <span className="line-clamp-2">{item.aturan}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                                            onClick={() => handleCopySolution(item)}
                                                            title="Salin Solusi & Aturan"
                                                        >
                                                            {copiedId === item.id ? (
                                                                <Check className="size-4 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="size-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300"
                                                            onClick={() => handleOpenEdit(item)}
                                                            title="Edit Kasus"
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                                            onClick={() => handleOpenDelete(item)}
                                                            title="Hapus Kasus"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {items.total > items.per_page && (
                            <div className="flex items-center justify-between p-4 border-t border-border">
                                <div className="text-xs text-muted-foreground">
                                    Menampilkan {items.from || 0} - {items.to || 0} dari {items.total} referensi kasus
                                </div>
                                <div className="flex items-center gap-1">
                                    {items.links.map((link, idx) => (
                                        <Button
                                            key={idx}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.visit(link.url)}
                                            className="h-8 min-w-[32px] px-2.5 text-xs"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* CREATE MODAL */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="size-5 text-emerald-600" /> Tambah Referensi Kasus
                        </DialogTitle>
                        <DialogDescription>
                            Tambahkan skenario permasalahan baru beserta panduan solusi dan dasar regulasinya.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitCreate} className="space-y-4 py-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="kode_kasus">Kode Kasus (Opsional)</Label>
                                <Input
                                    id="kode_kasus"
                                    placeholder="Contoh: KS-013"
                                    value={formData.kode_kasus}
                                    onChange={(e) =>
                                        setFormData({ ...formData, kode_kasus: e.target.value })
                                    }
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="kategori">Kategori Layanan <span className="text-rose-500">*</span></Label>
                                <Select
                                    value={formData.kategori}
                                    onValueChange={(val) => setFormData({ ...formData, kategori: val })}
                                >
                                    <SelectTrigger id="kategori">
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Klaim">Klaim</SelectItem>
                                        <SelectItem value="Kepesertaan">Kepesertaan</SelectItem>
                                        <SelectItem value="Pensiun">Pensiun</SelectItem>
                                        <SelectItem value="Teknis">Teknis</SelectItem>
                                        <SelectItem value="Mutasi">Mutasi</SelectItem>
                                        <SelectItem value="Administrasi">Administrasi</SelectItem>
                                        <SelectItem value="Umum">Umum</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="kasus">
                                Uraian Kasus / Skenario Permasalahan <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea
                                id="kasus"
                                rows={3}
                                placeholder="Deskripsikan kasus permasalahan yang sering dialami oleh peserta atau instansi..."
                                value={formData.kasus}
                                onChange={(e) => setFormData({ ...formData, kasus: e.target.value })}
                                required
                            />
                            {formErrors.kasus && (
                                <p className="text-xs text-rose-500">{formErrors.kasus}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="penyelesaian">
                                Langkah Penyelesaian / SOP <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea
                                id="penyelesaian"
                                rows={4}
                                placeholder="Jelaskan tahapan solusi penanganan teknis dan operasional yang harus diambil..."
                                value={formData.penyelesaian}
                                onChange={(e) =>
                                    setFormData({ ...formData, penyelesaian: e.target.value })
                                }
                                required
                            />
                            {formErrors.penyelesaian && (
                                <p className="text-xs text-rose-500">{formErrors.penyelesaian}</p>
                            )}
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

                        <DialogFooter className="pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Referensi'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* EDIT MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Pencil className="size-5 text-emerald-600" /> Edit Referensi Kasus
                        </DialogTitle>
                        <DialogDescription>
                            Perbarui rincian kasus, solusi tindak lanjut, atau dasar aturan hukum.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitEdit} className="space-y-4 py-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit_kode">Kode Kasus</Label>
                                <Input
                                    id="edit_kode"
                                    value={formData.kode_kasus}
                                    onChange={(e) =>
                                        setFormData({ ...formData, kode_kasus: e.target.value })
                                    }
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit_kategori">Kategori Layanan</Label>
                                <Select
                                    value={formData.kategori}
                                    onValueChange={(val) => setFormData({ ...formData, kategori: val })}
                                >
                                    <SelectTrigger id="edit_kategori">
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Klaim">Klaim</SelectItem>
                                        <SelectItem value="Kepesertaan">Kepesertaan</SelectItem>
                                        <SelectItem value="Pensiun">Pensiun</SelectItem>
                                        <SelectItem value="Teknis">Teknis</SelectItem>
                                        <SelectItem value="Mutasi">Mutasi</SelectItem>
                                        <SelectItem value="Administrasi">Administrasi</SelectItem>
                                        <SelectItem value="Umum">Umum</SelectItem>
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
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_penyelesaian">Langkah Penyelesaian / SOP</Label>
                            <Textarea
                                id="edit_penyelesaian"
                                rows={4}
                                value={formData.penyelesaian}
                                onChange={(e) =>
                                    setFormData({ ...formData, penyelesaian: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_aturan">Dasar Aturan</Label>
                            <Input
                                id="edit_aturan"
                                value={formData.aturan}
                                onChange={(e) => setFormData({ ...formData, aturan: e.target.value })}
                            />
                        </div>

                        <DialogFooter className="pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Perbarui Referensi'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* IMPORT CSV MODAL */}
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-emerald-600">
                            <Upload className="size-5" /> Import Referensi Kasus dari CSV
                        </DialogTitle>
                        <DialogDescription>
                            Unggah file CSV dengan header: <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">kode_kasus, kategori, kasus, penyelesaian, aturan</code>
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitImport} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="csv_file">Pilih File CSV (.csv)</Label>
                            <Input
                                id="csv_file"
                                type="file"
                                accept=".csv,text/csv"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImportFile(e.target.files[0]);
                                    }
                                }}
                                required
                            />
                            {formErrors.file_csv && (
                                <p className="text-xs text-rose-500">{formErrors.file_csv}</p>
                            )}
                        </div>

                        <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1 text-muted-foreground border">
                            <p className="font-semibold text-foreground">Format CSV yang didukung:</p>
                            <p>1. Baris pertama berisi header nama kolom.</p>
                            <p>2. Kolom <span className="font-medium text-foreground">kasus</span> dan <span className="font-medium text-foreground">penyelesaian</span> wajib terisi.</p>
                            <p>3. Format UTF-8 disarankan untuk teks dengan karakter khusus.</p>
                        </div>

                        <DialogFooter className="pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsImportOpen(false)}
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Mengimpor...' : 'Mulai Import CSV'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DELETE MODAL */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-600">
                            <Trash2 className="size-5" /> Hapus Referensi Kasus
                        </DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus referensi kasus{' '}
                            <span className="font-semibold text-foreground">
                                {selectedItem?.kode_kasus || `ID ${selectedItem?.id}`}
                            </span>
                            ? Data yang terhapus tidak dapat dikembalikan.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="pt-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Menghapus...' : 'Hapus Kasus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

ReferensiKasusPage.layout = {
    breadcrumbs: [
        {
            title: 'Referensi Kasus',
            href: '/referensi-kasus',
        },
    ],
};
