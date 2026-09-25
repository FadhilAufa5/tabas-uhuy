import { Badge } from '@/components/ui/badge';
import { getCfg } from './types';

interface KategoriBadgeProps {
    kategori: string;
}

export function KategoriBadge({ kategori }: KategoriBadgeProps) {
    return (
        <Badge className={`${getCfg(kategori).badge} border font-medium text-xs`}>
            {kategori}
        </Badge>
    );
}
