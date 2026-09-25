import { BookOpenCheck, Layers, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RkStatsProps {
    stats: {
        total: number;
        categories_count: number;
    };
}

export function RkStats({ stats }: RkStatsProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Kasus Terdata</CardTitle>
                    <BookOpenCheck className="size-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.total}</div>
                    <p className="text-xs text-muted-foreground mt-1">Referensi SOP dan penyelesaian kasus</p>
                </CardContent>
            </Card>

            <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Kategori Layanan</CardTitle>
                    <Layers className="size-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.categories_count} Kategori</div>
                    <p className="text-xs text-muted-foreground mt-1">Klaim, Kepesertaan, Pensiun, Kasus Hukum, dst.</p>
                </CardContent>
            </Card>

            <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Dasar Regulasi &amp; Hukum</CardTitle>
                    <Scale className="size-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-sm font-semibold text-foreground">UU 11/1969, PP 70/2015, PP 66/2017</div>
                    <p className="text-xs text-muted-foreground mt-1">Diselaraskan dengan petunjuk teknis PT Taspen</p>
                </CardContent>
            </Card>
        </div>
    );
}
