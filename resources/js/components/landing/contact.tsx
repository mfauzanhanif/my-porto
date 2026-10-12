import * as React from 'react';
import { Mail, Github, Linkedin, Instagram, Twitter, ArrowUpRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/types/portfolio';

interface ContactProps {
    profile?: Profile | null;
}

export function Contact({ profile }: ContactProps) {
    const email = profile?.email || 'fauzanhanif2112@gmail.com';
    const sosmed = profile?.sosmed || {};

    const getSocialIcon = (network: string) => {
        switch (network.toLowerCase()) {
            case 'github':
                return Github;
            case 'linkedin':
                return Linkedin;
            case 'instagram':
                return Instagram;
            case 'x':
            case 'twitter':
                return Twitter;
            default:
                return ArrowUpRight;
        }
    };

    return (
        <section id="contact" className="w-full py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-base border-2 border-border bg-secondary-background p-8 sm:p-12 md:p-16 shadow-shadow text-center relative overflow-hidden">
                    {/* Decorative Corner Badge */}
                    <div className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] mb-6">
                        <MessageSquare className="size-3.5" />
                        <span>KONSULTASI & KERJASAMA</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading tracking-tight text-foreground max-w-2xl mx-auto mb-4">
                        Mari Berdiskusi & Bangun Proyek Digital Impian Anda
                    </h2>

                    <p className="max-w-xl mx-auto text-base sm:text-lg font-base text-foreground/80 leading-relaxed mb-8">
                        Apakah Anda memiliki tawaran pekerjaan, proyek konsultasi sistem, atau sekadar ingin bertukar wawasan seputar arsitektur Laravel & React? Pintu komunikasi selalu terbuka.
                    </p>

                    {/* Primary Mailto Action */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                        <a href={`mailto:${email}`} className="w-full sm:w-auto">
                            <Button variant="default" size="lg" className="w-full sm:w-auto gap-2">
                                <Mail className="size-5" />
                                <span>Kirim Email Langsung</span>
                            </Button>
                        </a>
                        <div className="rounded-base border-2 border-border bg-background px-4 py-2 font-mono text-sm shadow-[2px_2px_0px_0px_var(--border)]">
                            {email}
                        </div>
                    </div>

                    {/* Social Channels Grid */}
                    <div className="border-t-2 border-border pt-8">
                        <p className="text-sm font-heading uppercase tracking-wider text-foreground/70 mb-4">
                            Atau terhubung melalui media sosial:
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {Object.entries(sosmed).map(([network, url]) => {
                                if (network.toLowerCase() === 'email' || !url) return null;
                                const Icon = getSocialIcon(network);

                                return (
                                    <a
                                        key={network}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-background px-3.5 py-2 text-sm font-heading shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                    >
                                        <Icon className="size-4 shrink-0" />
                                        <span className="capitalize">{network}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
