'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Box, LayoutDashboard, Package, ShoppingCart, Users, LogOut, Tags } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navItems = [
        {
            title: 'Dashboard',
            href: '/admin',
            icon: LayoutDashboard,
        },
        {
            title: 'Products',
            href: '/admin/products',
            icon: Package,
        },
        {
            title: 'Orders',
            href: '/admin/orders',
            icon: ShoppingCart,
        },
        {
            title: 'Categories',
            href: '/admin/categories',
            icon: Tags,
        },
        {
            title: 'Customers',
            href: '/admin/customers',
            icon: Users,
        },
    ];

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <Box className="w-6 h-6" />
                        <span>Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        {/* Placeholder for user avatar if available */}
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold">
                            {session?.user?.name?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 md:hidden">
                    <span className="font-bold">Admin Panel</span>
                    {/* Mobile menu trigger could go here */}
                </header>
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
