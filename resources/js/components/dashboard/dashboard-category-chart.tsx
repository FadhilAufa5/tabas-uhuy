import { PieChart } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export interface CategoryStat {
    category: string;
    count: number;
    percentage: number;
    color: string;
}

interface DashboardCategoryChartProps {
    categoryData: CategoryStat[];
    totalKasus: number;
}

export function DashboardCategoryChart({
    categoryData,
    totalKasus,
}: DashboardCategoryChartProps) {
    return (
        <Card className="border-border/70 shadow-xs">
            <CardHeader className="p-4 sm:p-6 pb-2">
                <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <PieChart className="size-5 text-purple-600 dark:text-purple-400" />
                    Distribusi Kategori Kasus
                </CardTitle>
                <CardDescription className="text-xs">
                    Proporsi topik masalah layanan Taspen
                </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 pt-2 space-y-4">
                {categoryData.map((cat) => (
                    <div key={cat.category} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div
                                    className="size-2.5 rounded-full"
                                    style={{ backgroundColor: cat.color }}
                                />
                                <span className="font-semibold text-foreground">
                                    {cat.category}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-muted-foreground">
                                    {cat.count} kasus
                                </span>
                                <Badge
                                    variant="outline"
                                    className="text-[10px] py-0 px-1 font-semibold"
                                >
                                    {cat.percentage}%
                                </Badge>
                            </div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${cat.percentage}%`,
                                    backgroundColor: cat.color,
                                }}
                            />
                        </div>
                    </div>
                ))}

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>Total Bank Data Kasus:</span>
                    <span className="font-bold text-foreground">
                        {totalKasus} Kasus
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
