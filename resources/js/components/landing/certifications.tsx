import * as React from 'react';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Certification } from '@/types/portfolio';

interface CertificationsProps {
    certifications: Certification[];
}

export function Certifications({ certifications }: CertificationsProps) {
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <section id="certifications" className="w-full py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 space-y-3">
                    <div className="inline-flex items-center rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                        SERTIFIKASI & LISENSI
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-heading tracking-tight text-foreground">
                        Kredensial Profesional & Lisensi Resmi
                    </h2>
                    <p className="text-base font-base text-foreground/80 max-w-2xl">
                        Bukti kompetensi terverifikasi dari lembaga dan platform teknologi kredibel.
                    </p>
                </div>

                {certifications.length === 0 ? (
                    <div className="rounded-base border-2 border-border bg-secondary-background p-8 text-center text-sm font-base text-foreground/70">
                        Belum ada data sertifikasi terdaftar.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certifications.map((cert) => (
                            <div
                                key={cert.id}
                                className="rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow flex flex-col justify-between transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                            >
                                <div>
                                    {/* Preview Image or Neobrutalism Award Header */}
                                    {cert.image ? (
                                        <div className="aspect-video w-full rounded-base border-2 border-border overflow-hidden bg-background mb-4">
                                            <img
                                                src={cert.image}
                                                alt={cert.name}
                                                className="size-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video w-full rounded-base border-2 border-border bg-main/20 flex flex-col items-center justify-center p-4 text-center mb-4 border-dashed">
                                            <div className="size-12 rounded-base border-2 border-border bg-main flex items-center justify-center shadow-[1px_1px_0px_0px_var(--border)] mb-2">
                                                <Award className="size-6 text-main-foreground" />
                                            </div>
                                            <span className="text-xs font-heading text-foreground">
                                                {cert.issuer}
                                            </span>
                                        </div>
                                    )}

                                    {/* Certificate Details */}
                                    <div className="space-y-1.5 mb-4">
                                        <div className="inline-flex items-center gap-1.5 text-xs font-base text-foreground/75">
                                            <Calendar className="size-3.5" />
                                            <span>Diterbitkan: {formatDate(cert.issued_at)}</span>
                                        </div>
                                        <h3 className="font-heading text-lg text-foreground line-clamp-2">
                                            {cert.name}
                                        </h3>
                                        <p className="text-sm font-heading text-foreground/80">
                                            {cert.issuer}
                                        </p>
                                    </div>
                                </div>

                                {/* Credential URL Button */}
                                {cert.credential_url && (
                                    <div className="pt-3 border-t-2 border-border">
                                        <a
                                            href={cert.credential_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full inline-block"
                                        >
                                            <Button variant="neutral" size="sm" className="w-full gap-1.5">
                                                <span>Verifikasi Kredensial</span>
                                                <ExternalLink className="size-3.5" />
                                            </Button>
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
