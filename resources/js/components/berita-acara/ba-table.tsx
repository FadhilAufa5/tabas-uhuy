import { router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Eye,
    FileCheck2,
    FileDown,
    FileText,
    Pencil,
    Plus,
    Printer,
    Search,
    Trash2,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import type { BeritaAcara, PaginatedData } from '@/types';
import { openPrintWindow } from './utils';

interface BaTableProps {
    items: PaginatedData<BeritaAcara>;
    searchQuery: string;
    statusFilter: string;
    onSearchChange: (val: string) => void;
    onSearch: (e?: React.FormEvent) => void;
    onStatusFilterChange: (val: string) => void;
    onOpenDetail: (item: BeritaAcara) => void;
    onOpenEdit: (item: BeritaAcara) => void;
    onOpenDelete: (item: BeritaAcara) => void;
    onOpenCreate: () => void;
}

function StatusBadge({ status }: { status: string }) {
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
}

export function BaTable({
    items,
    searchQuery,
    statusFilter,
    onSearchChange,
    onSearch,
    onStatusFilterChange,
    onOpenDetail,
    onOpenEdit,
    onOpenDelete,
    onOpenCreate,
}: BaTableProps) {
    return (
        <>
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
                        Pencatatan resmi kasus penanganan, upload dokumen Notas, dan solusi tindak
                        lanjut.
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button
                        onClick={onOpenCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                    >
                        <Plus className="mr-1.5 size-4" /> Buat Berita Acara
                    </Button>
                </div>
            </div>

            {/* Filters & Table Card */}
            <Card className="border-border/70 shadow-xs">
                <CardHeader className="p-4 sm:p-6 pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <form
                            onSubmit={onSearch}
                            className="flex flex-1 items-center gap-2 max-w-md"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nomor notas, nama, permasalahan, solusi..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="pl-9 bg-background/80"
                                />
                            </div>
                            <Button type="submit" variant="secondary" size="sm">
                                Cari
                            </Button>
                        </form>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                                Filter Status:
                            </span>
                            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
                                    <TableHead className="w-[150px] text-right font-semibold">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-40 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <FileText className="size-8 text-muted-foreground/60" />
                                                <p className="font-medium">
                                                    Belum ada data Berita Acara yang ditemukan.
                                                </p>
                                                <p className="text-xs">
                                                    Klik tombol "Buat Berita Acara" untuk menambahkan
                                                    dokumen baru.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.data.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-muted/30 transition-colors"
                                        >
                                            <TableCell className="font-semibold text-primary font-mono text-xs">
                                                <span className="inline-block px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold">
                                                    {item.nomor_berita_acara}
                                                </span>
                                                {item.tanggal_kejadian && (
                                                    <div className="text-[11px] font-normal text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Calendar className="size-3" />{' '}
                                                        {item.tanggal_kejadian}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm text-foreground">
                                                    {item.nama}
                                                </div>
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
                                                        <FileText className="size-3" />{' '}
                                                        {item.file_notas_name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={item.status} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                                        onClick={() => onOpenDetail(item)}
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300"
                                                        onClick={() => onOpenEdit(item)}
                                                        title="Edit Berita Acara"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                                        onClick={() => openPrintWindow(item)}
                                                        title="Cetak Berita Acara"
                                                    >
                                                        <Printer className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                                        onClick={() => onOpenDelete(item)}
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
                                Menampilkan {items.from || 0} - {items.to || 0} dari {items.total}{' '}
                                data
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
        </>
    );
}
