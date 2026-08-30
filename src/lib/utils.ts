import config from '@/config';
import type { SiweMessagePayload } from '@/types/auth.types';
import type { SupplyChainActivity } from '@/types/index';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function shortenAddress(address: string, chars = 4): string {
    if (!address) return '';
    return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`;
}

export function formatDateTime(iso: string): string {
    if (!iso) return '-';
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(iso));
}

export function formatDate(iso: string): string {
    if (!iso) return '-';
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(iso));
}

export function activityVariant(
    activity: SupplyChainActivity | 'CREATED',
): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (activity) {
        case 'CREATED':
            return 'secondary';
        case 'HARVESTING':
            return 'default';
        case 'SHIPPING':
            return 'default';
        case 'RECEIVING':
            return 'default';
        case 'SELLING':
            return 'default';
        default:
            return 'outline';
    }
}

export function activityColorClass(activity: SupplyChainActivity | 'CREATED'): string {
    switch (activity) {
        case 'CREATED':
            return 'status-created';
        case 'HARVESTING':
            return 'status-harvesting';
        case 'SHIPPING':
            return 'status-shipping';
        case 'RECEIVING':
            return 'status-receiving';
        case 'SELLING':
            return 'status-selling';
        default:
            return '';
    }
}

export function capitalise(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '…';
}

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export function buildSiwePayload(address: string): SiweMessagePayload {
    return {
        domain: config.app.domain,
        address,
        uri: window.location.origin,
        version: '1',
        chainId: config.chain.id,
    };
}