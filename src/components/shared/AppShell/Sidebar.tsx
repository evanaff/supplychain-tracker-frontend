import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    MapPin,
    ChevronRight,
    ScanLine,
    Route,
    Apple,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.svg';

interface NavItem {
    to: string;
    label: string;
    icon: React.ReactNode;
    roles?: string[];
}

const navItems: NavItem[] = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, roles: ['ADMIN'] },
    { to: '/trace-products', label: 'Trace Products', icon: <Route className="h-4 w-4" /> },
    { to: '/products', label: 'Products', icon: <Apple className="h-4 w-4" /> },
    { to: '/actors', label: 'Actors', icon: <Users className="h-4 w-4" />, roles: ['ADMIN'] },
    { to: '/locations', label: 'Locations', icon: <MapPin className="h-4 w-4" />, roles: ['ADMIN'] },
    { to: '/scan', label: 'Scan', icon: <ScanLine className="h-4 w-4" />, roles: ['GROWER', 'DISTRIBUTOR', 'RETAILER'] },
];

interface SidebarProps {
    onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
    const { role } = useAuth();

    const visibleItems = navItems.filter(
        (item) => !item.roles || (role !== null && item.roles.includes(role)),
    );

    return (
        <aside className="app-sidebar flex flex-col h-full w-64 shrink-0">
            {/* Brand */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
                <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-12 w-12 rounded-lg" 
                />
                <div>
                    <p className="text-sl font-bold text-sidebar-foreground leading-tight">Supply Chain</p>
                    <p className="text-xm text-sidebar-foreground/60 leading-tight">Tracker</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                    Navigation
                </p>
                {visibleItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        onClick={onClose}
                        className={({ isActive }) =>
                            cn('sidebar-nav-item', isActive && 'active')
                        }
                    >
                        {item.icon}
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                ))}
            </nav>

            {/* Role chip */}
            {role && (
                <div className="p-3 border-t border-sidebar-border">
                    <div className="rounded-lg bg-sidebar-accent/10 px-3 py-2">
                        <p className="text-xs text-sidebar-foreground/60">Signed in as</p>
                        <p className="text-sm font-semibold text-sidebar-foreground/90 capitalize">
                            {role.toLowerCase()}
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
}
