import { router } from '@inertiajs/react';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Copy,
    Eye,
    FileSpreadsheet,
    MoreHorizontal,
    Paperclip,
    Pencil,
    Scale,
    Search,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
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
import type { PaginatedData, ReferensiKasus } from '@/types';
import { KategoriBadge } from './rk-kategori-badge';
import { getCfg } from './types';

interface RkTableProps {
    items: PaginatedData<ReferensiKasus>;
    filters: {
        search: string;
        kategori: string;
    };
    categories: string[];
    copiedId: number | null;
    onOpenDetail: (item: ReferensiKasus) => void;
    onOpenEdit: (item: ReferensiKasus) => void;
    onOpenDelete: (item: ReferensiKasus) => void;
    onCopy: (item: ReferensiKasus) => void;
}

export function RkTable({
    items,
    filters,
    categories,
    copiedId,
    onOpenDetail,
    onOpenEdit,
    onOpenDelete,
    onCopy,
}: RkTableProps) {
    const [searchQuery, setSearchQuery]       = useState(filters.search || '');
    const [kategoriFilter, setKategoriFilter] = useState(filters.kategori || 'all');

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get('/referensi-kasus', { search: searchQuery, kategori: kategoriFilter }, { preserveState: true });
    };

    const handleKategoriChange = (val: string) => {
        setKategoriFilter(val);
        router.get('/referensi-kasus', { search: searchQuery, kategori: val }, { preserveState: true });
    };

    return (
        <Card className="border-border/70 shadow-xs">
            {/* Search & Filter */}
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
                        <Button type="submit" variant="secondary" size="sm">Cari</Button>
                    </form>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">Kategori:</span>
                        <Select value={kategoriFilter} onValueChange={handleKategoriChange}>
                            <SelectTrigger className="w-[160px] h-9">
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>

            {/* Table */}
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/40">
                            <TableRow>
                                <TableHead className="w-[100px] font-semibold">Kode</TableHead>
                                <TableHead className="w-[130px] font-semibold">Kategori</TableHead>
                                <TableHead className="min-w-[260px] font-semibold">Kasus / Masalah</TableHead>
                                <TableHead className="min-w-[280px] font-semibold">Penyelesaian / Tindak Lanjut</TableHead>
                                <TableHead className="min-w-[200px] font-semibold">Dasar Aturan</TableHead>
                                <TableHead className="w-[160px] text-right font-semibold">Aksi</TableHead>
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
                                        <TableCell className={`font-mono text-xs font-semibold ${getCfg(item.kategori).color}`}>
                                            <div className="flex items-center gap-1">
                                                {item.kode_kasus || `KS-${item.id}`}
                                                {item.lampiran && (
                                                    <span title="Ada lampiran">
                                                        <Paperclip className="size-3 text-muted-foreground shrink-0" />
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <KategoriBadge kategori={item.kategori} />
                                        </TableCell>
                                        <TableCell className="max-w-[300px]">
                                            <p className="text-xs font-medium text-foreground leading-relaxed line-clamp-3">
                                                {item.kasus}
                                            </p>
                                        </TableCell>
                                        <TableCell className="max-w-[320px]">
                                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                                {item.penyelesaian || '-'}
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
                                                {/* View Detail */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                                    onClick={() => onOpenDetail(item)}
                                                    title="Lihat Detail"
                                                >
                                                    <Eye className="size-4" />
                                                </Button>
                                                {/* Copy */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                                    onClick={() => onCopy(item)}
                                                    title="Salin Solusi & Aturan"
                                                >
                                                    {copiedId === item.id ? (
                                                        <Check className="size-4 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="size-4" />
                                                    )}
                                                </Button>
                                                {/* Edit */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300"
                                                    onClick={() => onOpenEdit(item)}
                                                    title="Edit Kasus"
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                {/* Delete */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                                    onClick={() => onOpenDelete(item)}
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
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-t border-border">
                        <div className="text-xs text-muted-foreground">
                            Menampilkan <span className="font-medium text-foreground">{items.from || 0}</span> - <span className="font-medium text-foreground">{items.to || 0}</span> dari <span className="font-medium text-foreground">{items.total}</span> referensi kasus
                        </div>
                        {(() => {
                            const totalPages = items.last_page || 1;
                            const currentPage = items.current_page || 1;

                            if (totalPages <= 1) return null;

                            const getPageUrl = (page: number) => {
                                const matchingLink = items.links?.find((l) => l.label === String(page));
                                if (matchingLink?.url) return matchingLink.url;
                                try {
                                    const url = new URL(window.location.href);
                                    url.searchParams.set('page', String(page));
                                    return url.pathname + url.search;
                                } catch {
                                    return `${items.path}?page=${page}`;
                                }
                            };

                            let pageNumbers: (number | string)[] = [];

                            if (totalPages <= 7) {
                                for (let i = 1; i <= totalPages; i++) {
                                    pageNumbers.push(i);
                                }
                            } else {
                                if (currentPage <= 4) {
                                    // 1-5, ..., lastPage
                                    pageNumbers = [1, 2, 3, 4, 5, '...', totalPages];
                                } else if (currentPage >= totalPages - 3) {
                                    pageNumbers = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                                } else {
                                    pageNumbers = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
                                }
                            }

                            return (
                                <div className="flex flex-wrap items-center gap-1.5">
                                    {/* Previous button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!items.prev_page_url || currentPage <= 1}
                                        onClick={() => items.prev_page_url && router.visit(items.prev_page_url)}
                                        className="h-8 px-2.5 text-xs gap-1"
                                    >
                                        <ChevronLeft className="size-3.5" />
                                        <span className="hidden sm:inline">Sebelumnya</span>
                                    </Button>

                                    {/* Page numbers & dots */}
                                    {pageNumbers.map((p, idx) => {
                                        if (p === '...') {
                                            return (
                                                <span
                                                    key={`dots-${idx}`}
                                                    className="flex size-8 items-center justify-center text-muted-foreground"
                                                >
                                                    <MoreHorizontal className="size-4" />
                                                </span>
                                            );
                                        }

                                        const pageNum = Number(p);
                                        const isActive = pageNum === currentPage;
                                        const url = getPageUrl(pageNum);

                                        return (
                                            <Button
                                                key={`page-${pageNum}`}
                                                variant={isActive ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => !isActive && router.visit(url)}
                                                className={`size-8 p-0 text-xs font-medium transition-all ${
                                                    isActive
                                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold'
                                                        : 'hover:bg-muted'
                                                }`}
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}

                                    {/* Next button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!items.next_page_url || currentPage >= totalPages}
                                        onClick={() => items.next_page_url && router.visit(items.next_page_url)}
                                        className="h-8 px-2.5 text-xs gap-1"
                                    >
                                        <span className="hidden sm:inline">Berikutnya</span>
                                        <ChevronRight className="size-3.5" />
                                    </Button>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
