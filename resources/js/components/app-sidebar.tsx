import { Link, usePage } from '@inertiajs/react';
import {
    BookOpenCheck,
    FileText,
    LayoutGrid,
    ShieldCheck,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem, User } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth?.user;
    const isAdmin =
        user?.role === 'admin' ||
        user?.roles?.some((r) => r.name === 'admin');

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Berita Acara',
            href: '/berita-acara',
            icon: FileText,
        },
        {
            title: 'Referensi Kasus',
            href: '/referensi-kasus',
            icon: BookOpenCheck,
        },
    ];

    const adminNavItems: NavItem[] = [
        {
            title: 'Manajemen User',
            href: '/users',
            icon: Users,
        },
        {
            title: 'Role & Permissions',
            href: '/roles',
            icon: ShieldCheck,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-4">
                <NavMain items={mainNavItems} label="Menu Utama" />

                {isAdmin && (
                    <NavMain
                        items={adminNavItems}
                        label="Administrasi & Akses"
                    />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
