import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-center gap-2 ${className ?? ''}`}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                aria-label="Go to previous page"
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </Button>

            <span className="text-sm text-muted-foreground px-3">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                aria-label="Go to next page"
            >
                Next
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
