import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SupplyChainActivity } from '@/types/index';

interface StatusBadgeProps {
    activity: SupplyChainActivity | 'CREATED';
    className?: string;
}

const activityStyles: Record<SupplyChainActivity | 'CREATED', string> = {
    CREATED: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-transparent',
    HARVESTING: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-transparent',
    SHIPPING: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-transparent',
    RECEIVING: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-transparent',
    SELLING: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-transparent',
};

export function StatusBadge({ activity, className }: StatusBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn('font-medium border', activityStyles[activity], className)}
        >
            {activity}
        </Badge>
    );
}
