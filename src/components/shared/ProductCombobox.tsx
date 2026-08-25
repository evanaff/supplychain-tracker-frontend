import React, { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products.api';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { Loader2, X, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product.types';

interface ProductComboboxProps {
    id?: string;
    value?: string;
    onChange: (value: string) => void;
    error?: boolean;
}

export function ProductCombobox({
    id,
    value = '',
    onChange,
    error,
}: ProductComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [prevValue, setPrevValue] = useState(value);
    const [prevProductsLength, setPrevProductsLength] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);

        if (value !== prevValue) {
                setPrevValue(value);
                if (!value) {
                setInputValue('');
                }
        }

    const debouncedSearch = useDebounce(inputValue, 300);

    const { data, isLoading } = useQuery({
        queryKey: ['products-search', debouncedSearch],
        queryFn: () =>
            productsApi
                .list({ search: debouncedSearch || undefined, limit: 10 })
                .then((r) => r.data.data.products),
        enabled: isOpen,
    });

    const products = data || [];

    if (products.length !== prevProductsLength) {
        setPrevProductsLength(products.length);
        setSelectedIndex(0);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (product: Product) => {
        setInputValue(product.varietyName);
        onChange(product.gtin);
        setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev < products.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (products[selectedIndex]) {
                    handleSelect(products[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                break;
        }
    };

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        setInputValue('');
        onChange('');
        setIsOpen(true);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative">
                <Input
                    id={id}
                    type="text"
                    placeholder="Search product by name..."
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsOpen(true);
                        onChange(''); // Clear the GTIN as soon as they type to ensure they select a valid product
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className={cn('pr-8', error && 'border-destructive focus-visible:ring-destructive')}
                    autoComplete="off"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
                    {isLoading && isOpen ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : value || inputValue ? (
                        <button
                            type="button"
                            onClick={clearSelection}
                            className="hover:text-foreground focus:outline-none rounded-sm focus:ring-2 focus:ring-ring"
                            aria-label="Clear selection"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md max-h-[168px] overflow-y-auto animate-in fade-in-0 zoom-in-95">
                    {isLoading && products.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                    ) : products.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">No products found.</div>
                    ) : (
                        <ul className="p-1" role="listbox">
                            {products.map((product, index) => {
                                const isSelected = selectedIndex === index;
                                const isCurrentValue = value === product.gtin;

                                return (
                                    <li
                                        key={product.gtin}
                                        role="option"
                                        aria-selected={isSelected}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        onClick={() => handleSelect(product)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={cn(
                                            'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                                            isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50',
                                            isCurrentValue && 'font-medium'
                                        )}
                                    >
                                        <div className="flex flex-col gap-1 w-full">
                                            <div className="flex items-center justify-between w-full">
                                                <span>{product.varietyName}</span>
                                                {isCurrentValue && <Check className="h-4 w-4 text-primary" />}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>GTIN: {product.gtin}</span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
