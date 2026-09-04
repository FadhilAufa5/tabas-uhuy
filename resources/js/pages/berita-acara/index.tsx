import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    Eye,
    FileCheck2,
    FileDown,
    FileText,
    FolderSync,
    Layers,
    Pencil,
    Plus,
    Printer,
    Search,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
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
import type { BeritaAcara, PaginatedData } from '@/types';

interface Props {
    items: PaginatedData<BeritaAcara>;
    filters: {
        search: string;
        status: string;
    };
    stats: {
        total: number;
        selesai: number;
        dalam_proses: number;
        draft: number;
    };
}

export default function BeritaAcaraPage({ items, filters, stats }: Props) {
    useFlashToast();

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState<BeritaAcara | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        nomor_berita_acara: '',
        nama: '',
        permasalahan: '',
        solusi: '',
        status: 'Selesai',
        tanggal_kejadian: new Date().toISOString().split('T')[0],
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search Handler
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/berita-acara',
            {
                search: searchQuery,
                status: statusFilter,
            },
            { preserveState: true }
        );
    };

    const handleStatusFilterChange = (val: string) => {
        setStatusFilter(val);
        router.get(
            '/berita-acara',
            {
                search: searchQuery,
                status: val,
            },
            { preserveState: true }
        );
    };

    // Open Create Modal
    const handleOpenCreate = () => {
        setFormData({
            nomor_berita_acara: '',
            nama: '',
            permasalahan: '',
            solusi: '',
            status: 'Selesai',
            tanggal_kejadian: new Date().toISOString().split('T')[0],
        });
        setSelectedFile(null);
        setFormErrors({});
        setIsCreateOpen(true);
    };

    // Open Edit Modal
    const handleOpenEdit = (item: BeritaAcara) => {
        setSelectedItem(item);
        setFormData({
            nomor_berita_acara: item.nomor_berita_acara,
            nama: item.nama,
            permasalahan: item.permasalahan,
            solusi: item.solusi,
            status: item.status,
            tanggal_kejadian: item.tanggal_kejadian || new Date().toISOString().split('T')[0],
        });
        setSelectedFile(null);
        setFormErrors({});
        setIsEditOpen(true);
    };

    // Open Detail Modal
    const handleOpenDetail = (item: BeritaAcara) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    // Open Delete Modal
    const handleOpenDelete = (item: BeritaAcara) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    // Submit Create
    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('nomor_berita_acara', formData.nomor_berita_acara);
        data.append('nama', formData.nama);
        data.append('permasalahan', formData.permasalahan);
        data.append('solusi', formData.solusi);
        data.append('status', formData.status);
        data.append('tanggal_kejadian', formData.tanggal_kejadian);
        if (selectedFile) {
            data.append('file_notas', selectedFile);
        }

        router.post('/berita-acara', data, {
            onError: (errors) => {
                setFormErrors(errors);
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

        const data = new FormData();
        data.append('nomor_berita_acara', formData.nomor_berita_acara);
        data.append('nama', formData.nama);
        data.append('permasalahan', formData.permasalahan);
        data.append('solusi', formData.solusi);
        data.append('status', formData.status);
        data.append('tanggal_kejadian', formData.tanggal_kejadian);
        if (selectedFile) {
            data.append('file_notas', selectedFile);
        }

        router.post(`/berita-acara/${selectedItem.id}`, data, {
            onError: (errors) => {
                setFormErrors(errors);
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
        router.delete(`/berita-acara/${selectedItem.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setIsSubmitting(false);
            },
            onError: () => setIsSubmitting(false),
        });
    };

    // Print Berita Acara
    const handlePrint = () => {
        window.print();
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Selesai':
                return (
                    <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <CheckCircle2 className="mr-1 size-3.5" /> Selesai
                    </Badge>
                );
            case 'Dalam Proses':
                return (
                    <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300">
                        <Clock className="mr-1 size-3.5" /> Dalam Proses
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-muted-foreground">
                        <FileText className="mr-1 size-3.5" /> Draft
                    </Badge>
                );
        }
    };

    const formatFileSize = (bytes?: number | null) => {
        if (!bytes) return '-';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(2) + ' MB';
    };

    return (
        <>
            <Head title="Berita Acara - Layanan Taspen" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Title & Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                <FileCheck2 className="size-6" />
                            </div>
                            Berita Acara Pelayanan
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Pencatatan resmi kasus penanganan, upload dokumen Notas, dan solusi tindak lanjut.
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Button
                            onClick={handleOpenCreate}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                        >
                            <Plus className="mr-1.5 size-4" /> Buat Berita Acara
                        </Button>
                    </div>
                </div>

                {/* Stats Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Berita Acara
                            </CardTitle>
                            <Layers className="size-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">Dokumen terdaftar</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Status Selesai
                            </CardTitle>
                            <CheckCircle2 className="size-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {stats.selesai}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Telah tertangani tuntas</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Dalam Proses
                            </CardTitle>
                            <Clock className="size-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {stats.dalam_proses}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Menunggu tindak lanjut</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Draft
                            </CardTitle>
                            <FileText className="size-4 text-neutral-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-neutral-600 dark:text-neutral-300">
                                {stats.draft}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Belum difinalisasi</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Table Card */}
                <Card className="border-border/70 shadow-xs">
                    <CardHeader className="p-4 sm:p-6 pb-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 max-w-md">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nomor notas, nama, permasalahan, solusi..."
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
                                <span className="text-xs font-medium text-muted-foreground">Filter Status:</span>
                                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                                    <SelectTrigger className="w-[140px] h-9">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="Selesai">Selesai</SelectItem>
                                        <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                                        <SelectItem value="Draft">Draft</SelectItem>
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
                                        <TableHead className="w-[160px] font-semibold">NOTAS</TableHead>
                                        <TableHead className="w-[200px] font-semibold">Nama / Pihak</TableHead>
                                        <TableHead className="min-w-[220px] font-semibold">Permasalahan</TableHead>
                                        <TableHead className="min-w-[220px] font-semibold">Solusi</TableHead>
                                        <TableHead className="w-[140px] font-semibold">Dokumen Notas</TableHead>
                                        <TableHead className="w-[110px] font-semibold">Status</TableHead>
                                        <TableHead className="w-[130px] text-right font-semibold">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <FileText className="size-8 text-muted-foreground/60" />
                                                    <p className="font-medium">Belum ada data Berita Acara yang ditemukan.</p>
                                                    <p className="text-xs">Klik tombol "Buat Berita Acara" untuk menambahkan dokumen baru.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.data.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-semibold text-primary font-mono text-xs">
                                                    <span className="inline-block px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold">
                                                        {item.nomor_berita_acara}
                                                    </span>
                                                    {item.tanggal_kejadian && (
                                                        <div className="text-[11px] font-normal text-muted-foreground flex items-center gap-1 mt-1">
                                                            <Calendar className="size-3" /> {item.tanggal_kejadian}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-sm text-foreground">{item.nama}</div>
                                                    {item.user && (
                                                        <div className="text-[11px] text-muted-foreground">
                                                            Petugas: {item.user.name}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="max-w-[240px]">
                                                    <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                                                        {item.permasalahan}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="max-w-[240px]">
                                                    <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                                                        {item.solusi}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    {item.file_notas ? (
                                                        <a
                                                            href={`/berita-acara/${item.id}/download`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 transition-colors"
                                                            title={item.file_notas_name || 'Download Notas'}
                                                        >
                                                            <FileDown className="size-3.5" />
                                                            <span className="max-w-[80px] truncate">
                                                                {item.file_notas_name || 'Unduh Notas'}
                                                            </span>
                                                        </a>
                                                    ) : item.file_notas_name ? (
                                                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                            <FileText className="size-3" /> {item.file_notas_name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(item.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                                            onClick={() => handleOpenDetail(item)}
                                                            title="Lihat Detail & Cetak"
                                                        >
                                                            <Eye className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300"
                                                            onClick={() => handleOpenEdit(item)}
                                                            title="Edit Berita Acara"
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                                            onClick={() => handleOpenDelete(item)}
                                                            title="Hapus Berita Acara"
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
                                    Menampilkan {items.from || 0} - {items.to || 0} dari {items.total} data
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
                <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileCheck2 className="size-5 text-blue-600" /> Buat Berita Acara Baru
                        </DialogTitle>
                        <DialogDescription>
                            Lengkapi rincian formulir berita acara dan lampirkan berkas Notas dinas terkait.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitCreate} className="space-y-4 py-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="nomor_ba">
                                    NOTAS <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    id="nomor_ba"
                                    placeholder="Contoh: 197508121999031001"
                                    value={formData.nomor_berita_acara}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nomor_berita_acara: e.target.value })
                                    }
                                    required
                                />
                                {formErrors.nomor_berita_acara && (
                                    <p className="text-xs text-rose-500">{formErrors.nomor_berita_acara}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="tanggal_kejadian">Tanggal Kejadian / Pelaporan</Label>
                                <Input
                                    id="tanggal_kejadian"
                                    type="date"
                                    value={formData.tanggal_kejadian}
                                    onChange={(e) =>
                                        setFormData({ ...formData, tanggal_kejadian: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="nama">
                                Nama Pihak / Pelapor / NIP <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="nama"
                                placeholder="Contoh: Drs. Bambang Sutrisno (NIP: 197001011995031001)"
                                value={formData.nama}
                                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                required
                            />
                            {formErrors.nama && (
                                <p className="text-xs text-rose-500">{formErrors.nama}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="permasalahan">
                                Uraian Permasalahan <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea
                                id="permasalahan"
                                rows={3}
                                placeholder="Jelaskan secara rinci permasalahan atau kendala yang dihadapi peserta..."
                                value={formData.permasalahan}
                                onChange={(e) =>
                                    setFormData({ ...formData, permasalahan: e.target.value })
                                }
                                required
                            />
                            {formErrors.permasalahan && (
                                <p className="text-xs text-rose-500">{formErrors.permasalahan}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="solusi">
                                Solusi & Tindak Lanjut <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea
                                id="solusi"
                                rows={3}
                                placeholder="Jelaskan langkah penyelesaian, regulasi yang dijadikan acuan, atau hasil koordinasi..."
                                value={formData.solusi}
                                onChange={(e) => setFormData({ ...formData, solusi: e.target.value })}
                                required
                            />
                            {formErrors.solusi && (
                                <p className="text-xs text-rose-500">{formErrors.solusi}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="status">Status Penanganan</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Selesai">Selesai</SelectItem>
                                        <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="file_notas">Upload Berkas / Dokumen Notas</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="file_notas"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setSelectedFile(e.target.files[0]);
                                            }
                                        }}
                                        className="cursor-pointer file:text-xs file:font-semibold"
                                    />
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    Format: PDF, DOC, DOCX, JPG, PNG (Maks 10MB)
                                </p>
                                {formErrors.file_notas && (
                                    <p className="text-xs text-rose-500">{formErrors.file_notas}</p>
                                )}
                            </div>
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
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Berita Acara'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* EDIT MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Pencil className="size-5 text-blue-600" /> Edit Berita Acara
                        </DialogTitle>
                        <DialogDescription>
                            Perbarui rincian data atau ganti berkas Notas dinas.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitEdit} className="space-y-4 py-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit_nomor_ba">
                                    NOTAS  <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    id="edit_nomor_ba"
                                    placeholder="Masukkan NOTAS"
                                    value={formData.nomor_berita_acara}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nomor_berita_acara: e.target.value })
                                    }
                                    required
                                />
                                {formErrors.nomor_berita_acara && (
                                    <p className="text-xs text-rose-500">{formErrors.nomor_berita_acara}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit_tanggal">Tanggal Kejadian</Label>
                                <Input
                                    id="edit_tanggal"
                                    type="date"
                                    value={formData.tanggal_kejadian}
                                    onChange={(e) =>
                                        setFormData({ ...formData, tanggal_kejadian: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_nama">
                                Nama Pihak / Pelapor <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="edit_nama"
                                value={formData.nama}
                                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                required
                            />
                            {formErrors.nama && (
                                <p className="text-xs text-rose-500">{formErrors.nama}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_permasalahan">
                                Uraian Permasalahan <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea
                                id="edit_permasalahan"
                                rows={3}
                                value={formData.permasalahan}
                                onChange={(e) =>
                                    setFormData({ ...formData, permasalahan: e.target.value })
                                }
                                required
                            />
                            {formErrors.permasalahan && (
                                <p className="text-xs text-rose-500">{formErrors.permasalahan}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_solusi">
                                Solusi & Tindak Lanjut <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea
                                id="edit_solusi"
                                rows={3}
                                value={formData.solusi}
                                onChange={(e) => setFormData({ ...formData, solusi: e.target.value })}
                                required
                            />
                            {formErrors.solusi && (
                                <p className="text-xs text-rose-500">{formErrors.solusi}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit_status">Status Penanganan</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger id="edit_status">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Selesai">Selesai</SelectItem>
                                        <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit_file_notas">
                                    Ganti Berkas Notas (Opsional)
                                </Label>
                                <Input
                                    id="edit_file_notas"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setSelectedFile(e.target.files[0]);
                                        }
                                    }}
                                />
                                {selectedItem?.file_notas_name && (
                                    <p className="text-[11px] text-muted-foreground truncate">
                                        File saat ini: {selectedItem.file_notas_name} ({formatFileSize(selectedItem.file_notas_size)})
                                    </p>
                                )}
                            </div>
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
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Perbarui Berita Acara'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DETAIL & PRINT MODAL */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-2 border-b">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <FileText className="size-5 text-blue-600" /> Detail Berita Acara
                            </DialogTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrint}
                                className="hidden sm:inline-flex items-center gap-1.5 text-xs"
                            >
                                <Printer className="size-3.5" /> Cetak Berkas
                            </Button>
                        </div>
                    </DialogHeader>

                    {selectedItem && (
                        <div className="space-y-6 py-3 print:p-6 print:text-black">
                            {/* Official Header for Print */}
                            <div className="text-center pb-4 border-b border-border">
                                <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">
                                    BERITA ACARA PENANGANAN LAYANAN
                                </h2>
                                <p className="text-sm font-mono text-muted-foreground mt-1">
                                    NOTAS: <span className="font-bold text-foreground">{selectedItem.nomor_berita_acara}</span>
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg border border-border/50">
                                <div>
                                    <span className="text-xs text-muted-foreground block">Nama Pihak / Pelapor</span>
                                    <span className="font-semibold text-foreground">{selectedItem.nama}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Tanggal Kejadian</span>
                                    <span className="font-medium text-foreground">
                                        {selectedItem.tanggal_kejadian || '-'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Status Penanganan</span>
                                    <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Petugas Pencatat</span>
                                    <span className="font-medium text-foreground">
                                        {selectedItem.user?.name || '-'}
                                    </span>
                                </div>
                            </div>

                            {/* Permasalahan */}
                            <div className="space-y-1.5">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    I. URAIAN PERMASALAHAN
                                </h3>
                                <div className="p-3.5 rounded-lg bg-card border border-border/70 text-sm leading-relaxed whitespace-pre-line text-foreground">
                                    {selectedItem.permasalahan}
                                </div>
                            </div>

                            {/* Solusi */}
                            <div className="space-y-1.5">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    II. SOLUSI & TINDAK LANJUT
                                </h3>
                                <div className="p-3.5 rounded-lg bg-card border border-border/70 text-sm leading-relaxed whitespace-pre-line text-foreground">
                                    {selectedItem.solusi}
                                </div>
                            </div>

                            {/* Lampiran Notas */}
                            {selectedItem.file_notas_name && (
                                <div className="space-y-1.5">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        III. BERKAS LAMPIRAN NOTAS
                                    </h3>
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                                                <FileText className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {selectedItem.file_notas_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Ukuran: {formatFileSize(selectedItem.file_notas_size)}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedItem.file_notas && (
                                            <a
                                                href={`/berita-acara/${selectedItem.id}/download`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                                            >
                                                <Download className="size-3.5" /> Unduh Berkas
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Signature Area (Useful for official print) */}
                            <div className="hidden print:grid grid-cols-2 pt-12 text-center text-sm">
                                <div>
                                    <p className="text-muted-foreground">Pelapor / Pihak Terkait,</p>
                                    <div className="h-20" />
                                    <p className="font-semibold underline">{selectedItem.nama}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Petugas Layanan Taspen,</p>
                                    <div className="h-20" />
                                    <p className="font-semibold underline">
                                        {selectedItem.user?.name || 'Petugas'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="border-t pt-3">
                        <Button
                            variant="secondary"
                            onClick={() => setIsDetailOpen(false)}
                        >
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DELETE MODAL */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-600">
                            <Trash2 className="size-5" /> Hapus Berita Acara
                        </DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus Berita Acara dengan NOTAS{' '}
                            <span className="font-semibold text-foreground">
                                {selectedItem?.nomor_berita_acara}
                            </span>
                            ? Tindakan ini tidak dapat dibatalkan dan berkas lampiran yang tersimpan akan dihapus.
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
                            {isSubmitting ? 'Menghapus...' : 'Hapus Dokumen'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

BeritaAcaraPage.layout = {
    breadcrumbs: [
        {
            title: 'Berita Acara',
            href: '/berita-acara',
        },
    ],
};
