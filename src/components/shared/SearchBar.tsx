import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchBarProps {
    placeholder?: string;
    onSearch: (value: string) => void;
    debounceMs?: number;
    className?: string;
    defaultValue?: string;
}

export function SearchBar({
    placeholder = 'Search…',
    onSearch,
    debounceMs = 300,
    className,
    defaultValue = '',
}: SearchBarProps) {
    const [value, setValue] = useState(defaultValue);
    const debouncedValue = useDebounce(value, debounceMs);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    const handleClear = () => {
        setValue('');
    };

    return (
        <div className={cn('relative', className)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
                id="search-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-9"
                aria-label={placeholder}
            />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
