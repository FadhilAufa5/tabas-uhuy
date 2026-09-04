import { BarChart3, Filter } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface MonthlyStat {
    month: string;
    monthName: string;
    shortName: string;
    beritaAcaraCount: number;
    kasusCount: number;
    total: number;
}

export interface MonthOption {
    value: string;
    label: string;
}

interface DashboardMonthlyChartProps {
    monthlyStats: MonthlyStat[];
    monthsList: MonthOption[];
    selectedMonth: string;
    selectedYear: string;
    onMonthChange: (month: string) => void;
}

export function DashboardMonthlyChart({
    monthlyStats,
    monthsList,
    selectedMonth,
    selectedYear,
    onMonthChange,
}: DashboardMonthlyChartProps) {
    const maxMonthlyTotal = Math.max(
        ...monthlyStats.map((m) => Math.max(m.total, m.beritaAcaraCount, m.kasusCount, 5)),
        10
    );

    return (
        <Card className="border-border/70 shadow-xs lg:col-span-2">
            <CardHeader className="p-4 sm:p-6 pb-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                            <BarChart3 className="size-5 text-indigo-600 dark:text-indigo-400" />
                            Rekapitulasi Tren Kasus & Berita Acara
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Grafik aktivitas penanganan kasus layanan sepanjang tahun {selectedYear}
                        </CardDescription>
                    </div>

                    {/* Filter Bulanan */}
                    <div className="flex items-center gap-2">
                        <Filter className="size-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-medium">Filter:</span>
                        <Select
                            value={selectedMonth}
                            onValueChange={onMonthChange}
                        >
                            <SelectTrigger className="w-[140px] h-8 text-xs bg-background">
                                <SelectValue placeholder="Pilih Bulan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Bulan</SelectItem>
                                {monthsList.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                        {m.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 pt-4">
                {/* Bar Chart Visual */}
                <div className="h-64 w-full flex items-end justify-between gap-1.5 sm:gap-3 pt-6 pb-2 border-b border-border">
                    {monthlyStats.map((item) => {
                        const isHighlighted =
                            selectedMonth === 'all' ||
                            selectedMonth === item.month;
                        const barHeight = Math.max(
                            (item.total / maxMonthlyTotal) * 100,
                            6
                        );

                        return (
                            <div
                                key={item.month}
                                className={`flex-1 flex flex-col items-center gap-1.5 group cursor-pointer transition-all ${
                                    isHighlighted
                                        ? 'opacity-100'
                                        : 'opacity-30 hover:opacity-75'
                                }`}
                                onClick={() => onMonthChange(item.month)}
                            >
                                {/* Tooltip value */}
                                <div className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {item.total}
                                </div>

                                {/* Bar */}
                                <div className="w-full max-w-[32px] h-48 flex items-end justify-center rounded-t-md bg-muted/40 overflow-hidden">
                                    <div
                                        style={{ height: `${barHeight}%` }}
                                        className={`w-full rounded-t-md transition-all duration-500 ${
                                            selectedMonth === item.month
                                                ? 'bg-gradient-to-t from-indigo-600 to-purple-500 shadow-md ring-2 ring-indigo-400'
                                                : 'bg-gradient-to-t from-blue-500/80 to-indigo-500/80 hover:from-blue-600 hover:to-indigo-600'
                                        }`}
                                    />
                                </div>

                                {/* Month Label */}
                                <span
                                    className={`text-[11px] font-medium tracking-tight ${
                                        selectedMonth === item.month
                                            ? 'text-indigo-600 font-bold dark:text-indigo-400'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {item.shortName}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Chart Legend */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="size-3 rounded-xs bg-indigo-500" />
                            <span>Total Kasus & Berita Acara</span>
                        </div>
                        {selectedMonth !== 'all' && (
                            <Badge variant="secondary" className="text-[10px]">
                                Terfilter: Bulan{' '}
                                {
                                    monthsList.find(
                                        (m) => m.value === selectedMonth
                                    )?.label
                                }
                            </Badge>
                        )}
                    </div>
                    <span className="text-[11px]">
                        Klik bar bulan untuk memfilter data
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
