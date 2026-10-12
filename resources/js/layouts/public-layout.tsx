import * as React from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import type { Profile } from '@/types/portfolio';

interface PublicLayoutProps {
    children: React.ReactNode;
    profile?: Profile | null;
}

export default function PublicLayout({ children, profile }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-base selection:bg-main selection:text-main-foreground">
            <Navbar profile={profile} />
            <main className="flex-1">
                {children}
            </main>
            <Footer profile={profile} />
        </div>
    );
}
