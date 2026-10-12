import { AppContent } from '@/components/cms/app-content';
import { AppShell } from '@/components/cms/app-shell';
import { AppSidebar } from '@/components/cms/app-sidebar';
import { AppSidebarHeader } from '@/components/cms/app-sidebar-header';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="min-w-0 overflow-x-clip">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
