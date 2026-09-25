import { router } from '@inertiajs/react';
import {
    Check,
    Copy,
    Eye,
    FileSpreadsheet,
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
                                                    <Paperclip className="size-3 text-muted-foreground shrink-0" title="Ada lampiran" />
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
    );
}
