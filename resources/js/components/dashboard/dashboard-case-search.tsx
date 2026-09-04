import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Check,
    Copy,
    Search,
    X,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import type { ReferensiKasus } from '@/types';

interface DashboardCaseSearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchCategory: string;
    setSearchCategory: (category: string) => void;
    filteredResults: ReferensiKasus[];
    copiedId: number | null;
    onCopySolution: (item: ReferensiKasus) => void;
    onSelectCase: (item: ReferensiKasus) => void;
}

export function DashboardCaseSearch({
    searchQuery,
    setSearchQuery,
    searchCategory,
    setSearchCategory,
    filteredResults,
    copiedId,
    onCopySolution,
    onSelectCase,
}: DashboardCaseSearchProps) {
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
        <Card className="border-border/70 shadow-xs">
            <CardHeader className="p-4 sm:p-6 pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                            <Search className="size-5 text-emerald-600 dark:text-emerald-400" />
                            Pencarian & Referensi Kasus Layanan
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Cari skenario permasalahan, panduan penyelesaian SOP, dan dasar regulasi langsung di bawah ini
                        </CardDescription>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari kasus, solusi, aturan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 text-xs bg-background"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>

                        <Select
                            value={searchCategory}
                            onValueChange={setSearchCategory}
                        >
                            <SelectTrigger className="w-[130px] h-9 text-xs bg-background">
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                <SelectItem value="Klaim">Klaim</SelectItem>
                                <SelectItem value="Kepesertaan">Kepesertaan</SelectItem>
                                <SelectItem value="Pensiun">Pensiun</SelectItem>
                                <SelectItem value="Teknis">Teknis</SelectItem>
                                <SelectItem value="Mutasi">Mutasi</SelectItem>
                                <SelectItem value="Administrasi">Administrasi</SelectItem>
                            </SelectContent>
                        </Select>

                        <Link href="/referensi-kasus">
                            <Button size="sm" variant="outline" className="h-9 text-xs">
                                Buka Menu Kasus <ArrowRight className="ml-1 size-3" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/40">
                            <TableRow>
                                <TableHead className="w-[90px] font-semibold">Kode</TableHead>
                                <TableHead className="w-[120px] font-semibold">Kategori</TableHead>
                                <TableHead className="min-w-[260px] font-semibold">Kasus / Permasalahan</TableHead>
                                <TableHead className="min-w-[280px] font-semibold">Penyelesaian / SOP</TableHead>
                                <TableHead className="min-w-[180px] font-semibold">Dasar Aturan</TableHead>
                                <TableHead className="w-[130px] text-right font-semibold">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredResults.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-1.5">
                                            <BookOpen className="size-6 text-muted-foreground/60" />
                                            <p className="font-medium text-xs">
                                                Tidak ada data kasus yang cocok dengan pencarian "{searchQuery}".
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredResults.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                            {item.kode_kasus || `KS-${item.id}`}
                                        </TableCell>
                                        <TableCell>{getKategoriBadge(item.kategori)}</TableCell>
                                        <TableCell className="max-w-[280px]">
                                            <p className="text-xs font-medium text-foreground leading-relaxed line-clamp-2">
                                                {item.kasus}
                                            </p>
                                        </TableCell>
                                        <TableCell className="max-w-[300px]">
                                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                                {item.penyelesaian}
                                            </p>
                                        </TableCell>
                                        <TableCell className="max-w-[200px]">
                                            {item.aturan ? (
                                                <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium line-clamp-1">
                                                    {item.aturan}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                                    onClick={() => onCopySolution(item)}
                                                    title="Salin Solusi Kasus"
                                                >
                                                    {copiedId === item.id ? (
                                                        <Check className="size-3.5 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="size-3.5" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-7 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300"
                                                    onClick={() => onSelectCase(item)}
                                                    title="Lihat Rincian Lengkap"
                                                >
                                                    <ArrowUpRight className="size-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
