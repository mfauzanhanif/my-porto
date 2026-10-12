import { Head } from '@inertiajs/react';
import type { PortfolioHomeProps } from '@/types/portfolio';
import {
    Navbar,
    Hero,
    About,
    SkillsGrid,
    ProjectsShowcase,
    Timeline,
    Certifications,
    ArticlesShowcase,
    Contact,
    Footer,
} from '@/components/landing';

export default function Welcome({
    profile,
    skills,
    experiences,
    educations,
    certifications,
    featuredProjects,
    featuredArticles,
}: PortfolioHomeProps) {
    const pageTitle = profile?.name
        ? `${profile.name} - ${profile.headline || 'Full-Stack Software Engineer'}`
        : 'M FAUZAN HANIF - Portfolio';

    return (
        <>
            <Head title={pageTitle}>
                <meta
                    name="description"
                    content={profile?.about || 'Personal Portfolio and Showcase of M FAUZAN HANIF'}
                />
            </Head>

            <div className="min-h-screen bg-background text-foreground font-sans selection:bg-main selection:text-main-foreground flex flex-col">
                {/* Sticky Neobrutalism Navigation */}
                <Navbar profile={profile} />

                <main className="flex-1">
                    {/* Hero Section */}
                    <Hero profile={profile} />

                    {/* About Section */}
                    <About profile={profile} />

                    {/* Grouped Skills Grid */}
                    <SkillsGrid skills={skills} />

                    {/* Featured Projects Showcase */}
                    <ProjectsShowcase projects={featuredProjects} />

                    {/* Experience & Education Timelines */}
                    <Timeline experiences={experiences} educations={educations} />

                    {/* Certifications Showcase */}
                    <Certifications certifications={certifications} />

                    {/* Featured Articles Showcase */}
                    <ArticlesShowcase articles={featuredArticles} />

                    {/* Contact & Social Section */}
                    <Contact profile={profile} />
                </main>

                {/* Footer */}
                <Footer profile={profile} />
            </div>
        </>
    );
}
