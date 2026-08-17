import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, ChevronDown, AlertTriangle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { authApi } from '@/api/auth.api';
import { shortenAddress } from '@/lib/utils';

export function WalletButton() {
    const { actor, clearAuth, refreshToken } = useAuth();
    const { isCorrectChain, switchChain, chainId } = useWallet();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            if (refreshToken) {
                await authApi.logout({ refreshToken });
            }
        } catch {
            // logout
        } finally {
            clearAuth();
            navigate('/login');
        }
    };

    if (!actor) return null;

    return (
        <div className="flex items-center gap-2">
            {/* Chain mismatch warning */}
            {!isCorrectChain && chainId !== null && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void switchChain()}
                    className="gap-1.5 text-amber-600 border-amber-300 hover:bg-amber-50 text-xs"
                >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Wrong network - click to switch
                </Button>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button variant="outline" size="sm" className="gap-2" id="wallet-menu-trigger">
                            <Wallet className="h-4 w-4 text-primary" />
                            <span className="hidden sm:block font-mono text-xs">
                                {shortenAddress(actor.address)}
                            </span>
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                    }
                />
                <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                        <p className="text-xs text-muted-foreground">Connected as</p>
                        <p className="font-semibold text-sm">{actor.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                            {shortenAddress(actor.address, 6)}
                        </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => void handleLogout()}
                        className="text-destructive focus:text-destructive gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
