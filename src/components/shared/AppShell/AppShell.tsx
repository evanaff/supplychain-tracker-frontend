import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { WalletButton } from './WalletButton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import config from '@/config';

export function AppShell() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Desktop sidebar */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            {/* Mobile sidebar */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="p-0 w-64">
                    <Sidebar onClose={() => setMobileOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Main content area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 shrink-0">
                    {/* Mobile menu button */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open navigation menu"
                            id="mobile-menu-button"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <span className="font-semibold text-sm text-foreground md:hidden">{config.app.name}</span>
                    </div>

                    {/* Wallet button */}
                    <WalletButton />
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="container max-w-7xl mx-auto p-4 md:p-6 animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
