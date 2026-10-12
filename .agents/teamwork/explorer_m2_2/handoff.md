# Handoff Report: Milestone 2 Explorer 2 (Neobrutalism Design Tokens & Landing Components)

**Working Directory:** `c:\laragon\www\fauzanhanif\.agents\teamwork\explorer_m2_2`  
**Author:** Explorer M2-2  
**Target:** Parent Orchestrator (`7d09acd8-1630-4847-91fb-6a87e5315659`) & Worker Agents  

---

## 1. Observation

### 1.1. `resources/css/app.css` Current State vs `docs/DESIGN.md`
- **Current File Content (`resources/css/app.css`, lines 10–62):**
  Uses standard Tailwind CSS v4 `@theme` block referencing default Shadcn/Tailwind variables (`--radius-lg`, `--color-background`, `--color-border: var(--border)`, etc.).
- **Missing Neobrutalism Tokens:**
  - `--spacing-boxShadowX: 2px;` and `--spacing-boxShadowY: 2px;` are not defined.
  - `--spacing-reverseBoxShadowX: -2px;` and `--spacing-reverseBoxShadowY: -2px;` are not defined.
  - `--radius-base: 10px;` is not defined in the `@theme` block.
  - `--shadow-shadow: var(--shadow);` is missing.
  - `--font-weight-base: 500;` and `--font-weight-heading: 700;` are missing.
  - `--color-main: var(--main);` and `--color-secondary-background: var(--secondary-background);` are missing.
  - Default `:root` has `--background: oklch(1 0 0)` and `--border: oklch(0.922 0 0)` (faint gray border) instead of Neobrutalism's signature solid pitch-black border `oklch(0% 0 0)` and soft pastel sky background `hsl(207, 89%, 93%)`.
- **Space Grotesk Font Integration:**
  - Verified in `vite.config.ts` (lines 15–20):
    ```ts
    fonts: [
        bunny('Space Grotesk', {
            weights: [500, 700],
            optimizedFallbacks: false,
        }),
    ],
    ```
  - Verified in `resources/views/app.blade.php` (line 37): `@fonts` directive correctly loads Bunny fonts.
  - In `resources/css/app.css` (lines 11–14): `--font-sans` includes `'Space Grotesk', 'Instrument Sans', ui-sans-serif, system-ui, sans-serif`.

### 1.2. Layout Resolver Bug in `resources/js/app.tsx`
- **Current Code (`resources/js/app.tsx`, lines 12–21):**
  ```tsx
  layout: (name) => {
      switch (true) {
          case name === 'welcome':
              return null;
          case name.startsWith('auth/'):
              return AuthLayout;
          default:
              return AppLayout;
      }
  },
  ```
- **Observed Defect:**
  Any public page other than `welcome` (e.g. `projects`, `articles`, `articles/show`) triggers `default: return AppLayout;`.
  Because `AppLayout` renders the admin CMS sidebar (`<AppSidebar />`), admin breadcrumbs, and admin header, visiting any public archive route wraps public content inside the private CMS dashboard layout!

### 1.3. Existing UI Components & Media Components
- **Button (`resources/js/components/ui/button.tsx`, lines 8–37):**
  Already specifies Neobrutalism variants (`default`, `neutral`, `noShadow`, `reverse`) with classes like `border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none`.
- **Card (`resources/js/components/ui/card.tsx`, lines 14–17):**
  Uses `rounded-base flex flex-col shadow-shadow border-2 border-border bg-background text-foreground font-base`.
- **Badge (`resources/js/components/ui/badge.tsx`, lines 9–22):**
  Uses `rounded-base border-2 border-border px-2.5 py-0.5 text-xs font-base`.
- **Media (`resources/js/components/media/`):**
  `PlaceholderSvg`, `MediaImage`, and `ResponsiveImageWithPlaceholder` exist and apply `rounded-base border-2 border-border`.

### 1.4. Data Interfaces & Seeded Data
- **Interface Contract (`resources/js/types/portfolio.ts`):**
  `Profile`, `Skill`, `Experience`, `Education`, `Certification`, `Project`, `Article`, and `PortfolioHomeProps` are fully typed.
- **Seeded Data (`database/seeders/PortfolioDatabaseSeeder.php`):**
  - Profile includes `headline`, `about`, `email`, and `sosmed` (`github`, `linkedin`, `instagram`, `x`, `email`).
  - Skills are categorized into `Backend`, `Frontend`, and `Tools` with `is_featured` boolean and proficiency `level`.
  - Educations have `institution`, `degree`, `start_year`, `end_year`, `description`.
  - Experiences have `company`, `role`, `start_date`, `end_date` (null represents current), `description`.
  - Certifications have `name`, `issuer`, `issued_at`, `credential_url`.

---

## 2. Logic Chain

1. **Token Unification in Tailwind CSS v4:**
   - Because `button.tsx` relies on `hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none` and `shadow-shadow`, Tailwind CSS v4 must have `--spacing-boxShadowX: 2px;`, `--spacing-boxShadowY: 2px;`, and `--shadow-shadow: var(--shadow);` in `@theme inline`.
   - To support Monochromatic Sky (`:root`), Duotone Sky-Violet (`[data-theme="duotone"]`), and Dark Mode (`.dark`), CSS variables must be declared in CSS root scopes as specified in `docs/DESIGN.md`.
   - Existing CMS components still reference `--card`, `--primary`, `--sidebar`, etc. By aliasing those variables to `--secondary-background`, `--main`, `--border`, etc., both public landing components and private CMS pages share `app.css` without visual distortion or missing token errors.

2. **Public Page Layout Isolation in `app.tsx`:**
   - Public visitors must never see the CMS sidebar.
   - The layout resolver in `app.tsx` must handle `welcome`, `projects`, `articles`, and `articles/*` by returning `null` or a dedicated `PublicLayout`.
   - Providing `resources/js/layouts/public-layout.tsx` guarantees consistent navigation, theme toggle, and footer across all public views (`welcome`, `projects`, `articles`, `articles/show`).

3. **Landing Component Modularity & Fallback Guarantee:**
   - `docs/features/01` mandates that if the profile photo is absent, a clean fallback placeholder SVG must be rendered without breaking layout.
   - `docs/features/03` mandates categorized skills (Backend, Frontend, Tools) with proficiency labels and visual badges for featured skills.
   - `docs/features/05` mandates chronological career and academic timelines and a certification grid with verification links.
   - By creating dedicated components in `resources/js/components/landing/` (`navbar.tsx`, `hero.tsx`, `about.tsx`, `skills-grid.tsx`, `timeline.tsx`, `certifications.tsx`, `contact.tsx`, `footer.tsx`), each component fulfills its respective feature documentation with zero coupled dependencies.

---

## 3. Caveats

1. **TipTap CMS WYSIWYG Styling:**
   - TipTap editor HTML rendered in articles uses specific typography classes detailed in `docs/DESIGN.md` Section 5.5 (`h2`, `blockquote`, `pre`, `code`). Those are scoped to article readers (`articles/show.tsx`) and do not conflict with landing page components.
2. **Icons Dependency:**
   - All component blueprints utilize icons from `lucide-react@0.475.0` (already installed in `package.json`). No additional packages or npm installs are needed.
3. **No Code Modification Undertaken:**
   - Per explorer rules, no application files were modified during this investigation. All blueprints are delivered as complete, copy-pasteable implementations in this report.

---

## 4. Conclusion & Actionable Blueprints

The worker agent should execute the following 4 implementation packages:

### Package 1: Exact `resources/css/app.css` Replacement

Replace `resources/css/app.css` with the complete Neobrutalism design system tokens:

```css
@import 'tailwindcss';

@import 'tw-animate-css';

@source '../views';
@source '../../vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php';

@custom-variant dark (&:is(.dark *));

@theme inline {
    --font-sans:
        'Space Grotesk', 'Instrument Sans', ui-sans-serif, system-ui, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
        'Noto Color Emoji';
    --font-heading:
        'Space Grotesk', 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;

    --color-main: var(--main);
    --color-background: var(--background);
    --color-secondary-background: var(--secondary-background);
    --color-foreground: var(--foreground);
    --color-main-foreground: var(--main-foreground);
    --color-border: var(--border);
    --color-overlay: var(--overlay);
    --color-ring: var(--ring);

    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-popover: var(--popover);
    --color-popover-foreground: var(--popover-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-accent: var(--accent);
    --color-accent-foreground: var(--accent-foreground);
    --color-destructive: var(--destructive);
    --color-destructive-foreground: var(--destructive-foreground);
    --color-input: var(--input);

    --color-chart-1: var(--chart-1);
    --color-chart-2: var(--chart-2);
    --color-chart-3: var(--chart-3);
    --color-chart-4: var(--chart-4);
    --color-chart-5: var(--chart-5);

    --color-sidebar: var(--sidebar);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-ring: var(--sidebar-ring);

    /* Spacing & Dimension Tokens for Neobrutalism Tactile Physics */
    --spacing-boxShadowX: 2px;
    --spacing-boxShadowY: 2px;
    --spacing-reverseBoxShadowX: -2px;
    --spacing-reverseBoxShadowY: -2px;

    /* Radius & Weight Tokens */
    --radius-base: 10px;
    --radius-lg: var(--radius);
    --radius-md: calc(var(--radius) - 2px);
    --radius-sm: calc(var(--radius) - 4px);

    --shadow-shadow: var(--shadow);
    --font-weight-base: 500;
    --font-weight-heading: 700;
}

/* -------------------------------------------------------------------------
   Neobrutalism Color Themes
   ------------------------------------------------------------------------- */

/* Monochromatic Sky Theme (Default) */
:root, [data-theme="monochromatic"] {
    --background: hsl(207, 89%, 93%);
    --secondary-background: oklch(100% 0 0);
    --foreground: oklch(0% 0 0);
    --main-foreground: oklch(0% 0 0);
    --main: hsl(204, 100%, 50%);
    --border: oklch(0% 0 0);
    --ring: oklch(0% 0 0);
    --overlay: oklch(0% 0 0 / 0.8);
    --shadow: 2px 2px 0px 0px var(--border);

    /* CMS / Shadcn Aliases */
    --card: var(--secondary-background);
    --card-foreground: var(--foreground);
    --popover: var(--secondary-background);
    --popover-foreground: var(--foreground);
    --primary: var(--main);
    --primary-foreground: var(--main-foreground);
    --secondary: var(--secondary-background);
    --secondary-foreground: var(--foreground);
    --muted: hsl(207, 40%, 86%);
    --muted-foreground: oklch(35% 0 0);
    --accent: var(--main);
    --accent-foreground: var(--main-foreground);
    --destructive: oklch(0.577 0.245 27.325);
    --destructive-foreground: oklch(100% 0 0);
    --input: var(--border);
    --radius: 10px;

    --sidebar: var(--secondary-background);
    --sidebar-foreground: var(--foreground);
    --sidebar-primary: var(--main);
    --sidebar-primary-foreground: var(--main-foreground);
    --sidebar-accent: hsl(207, 40%, 90%);
    --sidebar-accent-foreground: var(--foreground);
    --sidebar-border: var(--border);
    --sidebar-ring: var(--ring);

    /* Chart & Analytics Tokens */
    --chart-1: #0099ff;
    --chart-2: #ff4d50;
    --chart-3: #facc00;
    --chart-4: #05e17a;
    --chart-5: #7a83ff;
    --chart-active-dot: #000;
}

/* Duotone Sky & Violet Theme */
[data-theme="duotone"] {
    --background: hsl(236, 100%, 80%);
    --secondary-background: oklch(100% 0 0);
    --foreground: oklch(0% 0 0);
    --main-foreground: oklch(0% 0 0);
    --main: hsl(204, 100%, 50%);
    --border: oklch(0% 0 0);
    --ring: oklch(0% 0 0);
    --overlay: oklch(0% 0 0 / 0.8);
    --shadow: 2px 2px 0px 0px var(--border);

    --card: var(--secondary-background);
    --card-foreground: var(--foreground);
    --popover: var(--secondary-background);
    --popover-foreground: var(--foreground);
    --primary: var(--main);
    --primary-foreground: var(--main-foreground);
    --secondary: var(--secondary-background);
    --secondary-foreground: var(--foreground);
    --muted: hsl(236, 40%, 86%);
    --muted-foreground: oklch(35% 0 0);
    --accent: var(--main);
    --accent-foreground: var(--main-foreground);
    --destructive: oklch(0.577 0.245 27.325);
    --destructive-foreground: oklch(100% 0 0);
    --input: var(--border);
    --radius: 10px;

    --sidebar: var(--secondary-background);
    --sidebar-foreground: var(--foreground);
    --sidebar-primary: var(--main);
    --sidebar-primary-foreground: var(--main-foreground);
    --sidebar-accent: hsl(236, 40%, 90%);
    --sidebar-accent-foreground: var(--foreground);
    --sidebar-border: var(--border);
    --sidebar-ring: var(--ring);

    --chart-1: #0099ff;
    --chart-2: #7a83ff;
    --chart-3: #facc00;
    --chart-4: #05e17a;
    --chart-5: #ff4d50;
    --chart-active-dot: #000;
}

/* Dark Mode Adaptation */
.dark {
    --background: oklch(0.145 0 0);
    --secondary-background: oklch(0.205 0 0);
    --foreground: oklch(0.985 0 0);
    --main-foreground: oklch(0% 0 0);
    --main: hsl(204, 100%, 50%);
    --border: oklch(0.985 0 0);
    --ring: oklch(0.985 0 0);
    --overlay: oklch(0% 0 0 / 0.8);
    --shadow: 2px 2px 0px 0px var(--border);

    --card: var(--secondary-background);
    --card-foreground: var(--foreground);
    --popover: var(--secondary-background);
    --popover-foreground: var(--foreground);
    --primary: var(--main);
    --primary-foreground: var(--main-foreground);
    --secondary: var(--secondary-background);
    --secondary-foreground: var(--foreground);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: var(--main);
    --accent-foreground: var(--main-foreground);
    --destructive: oklch(0.396 0.141 25.723);
    --destructive-foreground: oklch(0.637 0.237 25.331);
    --input: var(--border);
    --radius: 10px;

    --sidebar: var(--secondary-background);
    --sidebar-foreground: var(--foreground);
    --sidebar-primary: var(--main);
    --sidebar-primary-foreground: var(--main-foreground);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: var(--foreground);
    --sidebar-border: var(--border);
    --sidebar-ring: var(--ring);

    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
}

@layer base {
    * {
        @apply border-border;
    }

    body {
        @apply bg-background text-foreground font-sans;
    }
}
```

---

### Package 2: Layout Resolver in `resources/js/app.tsx` & Dedicated `PublicLayout`

#### 2.1. Update `resources/js/app.tsx`
Modify lines 12–21 in `resources/js/app.tsx` to handle all public pages:

```tsx
import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name === 'projects':
            case name === 'articles':
            case name.startsWith('articles/'):
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delay={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#0099ff',
    },
});

initializeTheme();
```

#### 2.2. Dedicated Public Layout: `resources/js/layouts/public-layout.tsx`
Create `resources/js/layouts/public-layout.tsx` for shared wrapper across public archive pages:

```tsx
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
```

---

### Package 3: Copy-Pasteable Landing Component Blueprints

All components belong to `resources/js/components/landing/`.

#### Blueprint 3.1: `resources/js/components/landing/navbar.tsx`

```tsx
import * as React from 'react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X, Sun, Moon, ArrowUpRight, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import type { Profile } from '@/types/portfolio';

interface NavbarProps {
    profile?: Profile | null;
}

export function Navbar({ profile }: NavbarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const isHome = typeof window !== 'undefined' ? window.location.pathname === '/' : true;
    const prefix = isHome ? '' : '/';

    const navItems = [
        { label: 'Tentang', href: `${prefix}#about` },
        { label: 'Keahlian', href: `${prefix}#skills` },
        { label: 'Proyek', href: `${prefix}#projects` },
        { label: 'Riwayat', href: `${prefix}#timeline` },
        { label: 'Sertifikat', href: `${prefix}#certifications` },
        { label: 'Artikel', href: `${prefix}#articles` },
        { label: 'Kontak', href: `${prefix}#contact` },
    ];

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
            <nav className="mx-auto max-w-6xl rounded-base border-2 border-border bg-secondary-background/95 px-4 py-3 shadow-shadow backdrop-blur-md transition-all">
                <div className="flex items-center justify-between gap-4">
                    {/* Brand / Logo */}
                    <a
                        href="/#hero"
                        className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-3 py-1 font-heading text-sm text-main-foreground shadow-[1px_1px_0px_0px_var(--border)] transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                    >
                        <Code className="size-4 shrink-0" />
                        <span className="tracking-tight">{profile?.name || 'M FAUZAN HANIF'}</span>
                    </a>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-1.5">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="rounded-base border-2 border-transparent px-2.5 py-1 text-sm font-heading text-foreground transition-all hover:border-border hover:bg-main/20 hover:text-foreground"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden sm:flex items-center gap-2.5">
                        <Button
                            variant="neutral"
                            size="icon-sm"
                            onClick={toggleTheme}
                            aria-label="Toggle dark mode"
                            title="Ganti Tema"
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="size-4 text-amber-400" />
                            ) : (
                                <Moon className="size-4 text-foreground" />
                            )}
                        </Button>

                        <a href="/#contact">
                            <Button variant="default" size="sm" className="gap-1.5">
                                <span>Hubungi Saya</span>
                                <ArrowUpRight className="size-3.5" />
                            </Button>
                        </a>
                    </div>

                    {/* Mobile Menu & Theme Toggle */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <Button
                            variant="neutral"
                            size="icon-xs"
                            onClick={toggleTheme}
                            aria-label="Toggle dark mode"
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="size-3.5 text-amber-400" />
                            ) : (
                                <Moon className="size-3.5 text-foreground" />
                            )}
                        </Button>

                        <Button
                            variant="neutral"
                            size="icon-xs"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileOpen && (
                    <div className="mt-3 border-t-2 border-border pt-3 lg:hidden flex flex-col gap-1.5">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="rounded-base border-2 border-border bg-background px-3 py-2 text-sm font-heading shadow-[1px_1px_0px_0px_var(--border)] transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="pt-2">
                            <a href="/#contact" onClick={() => setMobileOpen(false)} className="w-full">
                                <Button variant="default" size="sm" className="w-full">
                                    Hubungi Saya
                                </Button>
                            </a>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
```

---

#### Blueprint 3.2: `resources/js/components/landing/hero.tsx`

```tsx
import * as React from 'react';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/types/portfolio';

interface HeroProps {
    profile?: Profile | null;
}

export function Hero({ profile }: HeroProps) {
    const headline = profile?.headline || 'Full-Stack Software Engineer | Laravel, React & Cloud Enthusiast';
    const name = profile?.name || 'M FAUZAN HANIF';
    const email = profile?.email || 'fauzanhanif2112@gmail.com';
    const sosmed = profile?.sosmed || {};

    return (
        <section id="hero" className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                    {/* Left Column: Introductions & CTAs (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col items-start gap-6">
                        {/* Status Sticker Badge */}
                        <div className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-black opacity-75"></span>
                                <span className="relative inline-flex size-2 rounded-full bg-black"></span>
                            </span>
                            <span>Tersedia untuk Peluang Rekrutmen & Proyek</span>
                        </div>

                        {/* Title & Name */}
                        <div className="space-y-3">
                            <p className="font-heading text-sm uppercase tracking-wider text-foreground/80 md:text-base">
                                Halo, saya
                            </p>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading tracking-tight leading-none text-foreground">
                                {name}
                            </h1>
                            <p className="text-lg sm:text-xl md:text-2xl font-heading text-foreground/90">
                                {headline}
                            </p>
                        </div>

                        {/* Brief Intro */}
                        <p className="max-w-xl text-base md:text-lg font-base leading-relaxed text-foreground/80">
                            Mengembangkan aplikasi web performa tinggi dengan perpaduan arsitektur backend yang kokoh berbasis Laravel dan pengalaman pengguna responsif, estetis, dan modern dengan React & Tailwind CSS.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <a href="#projects">
                                <Button variant="default" size="lg" className="gap-2">
                                    <span>Lihat Proyek Unggulan</span>
                                    <ArrowDown className="size-4" />
                                </Button>
                            </a>
                            <a href="#contact">
                                <Button variant="neutral" size="lg" className="gap-2">
                                    <span>Hubungi Saya</span>
                                    <ArrowUpRight className="size-4" />
                                </Button>
                            </a>
                        </div>

                        {/* Social Quick Bar */}
                        <div className="flex items-center gap-2.5 pt-2">
                            {sosmed.github && (
                                <a
                                    href={sosmed.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex size-10 items-center justify-center rounded-base border-2 border-border bg-secondary-background text-foreground shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                    aria-label="GitHub Profile"
                                >
                                    <Github className="size-4.5" />
                                </a>
                            )}
                            {sosmed.linkedin && (
                                <a
                                    href={sosmed.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex size-10 items-center justify-center rounded-base border-2 border-border bg-secondary-background text-foreground shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                    aria-label="LinkedIn Profile"
                                >
                                    <Linkedin className="size-4.5" />
                                </a>
                            )}
                            <a
                                href={`mailto:${email}`}
                                className="inline-flex size-10 items-center justify-center rounded-base border-2 border-border bg-secondary-background text-foreground shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                aria-label="Kirim Email"
                            >
                                <Mail className="size-4.5" />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Profile Photo with Neobrutalism Frame & SVG Fallback (5 cols) */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <div className="relative group">
                            {/* Decorative Background Offset Card */}
                            <div className="absolute -inset-2 rounded-base border-2 border-border bg-main -rotate-3 transition-transform group-hover:rotate-0"></div>

                            {/* Main Photo Container */}
                            <div className="relative size-64 sm:size-72 md:size-80 rounded-base border-2 border-border bg-secondary-background shadow-shadow overflow-hidden flex items-center justify-center">
                                {profile?.photo ? (
                                    <img
                                        src={profile.photo}
                                        alt={name}
                                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        loading="eager"
                                    />
                                ) : (
                                    /* Neobrutalism High-Aesthetic Avatar Fallback */
                                    <div className="size-full bg-gradient-to-br from-main/30 via-secondary-background to-main/20 flex flex-col items-center justify-center p-6 text-center select-none">
                                        <div className="size-24 rounded-base border-2 border-border bg-main flex items-center justify-center shadow-shadow mb-4">
                                            <span className="font-heading text-3xl text-main-foreground">MFH</span>
                                        </div>
                                        <span className="font-heading text-base text-foreground tracking-tight">
                                            {name}
                                        </span>
                                        <span className="text-xs font-base text-foreground/75 mt-1">
                                            Software Engineer
                                        </span>
                                        <div className="mt-4 inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-2.5 py-0.5 text-[11px] font-heading shadow-[1px_1px_0px_0px_var(--border)]">
                                            <Sparkles className="size-3 text-amber-500" />
                                            <span>Web Craftsman</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
```

---

#### Blueprint 3.3: `resources/js/components/landing/about.tsx`

```tsx
import * as React from 'react';
import { CheckCircle2, Cpu, Database, Layout } from 'lucide-react';
import type { Profile } from '@/types/portfolio';

interface AboutProps {
    profile?: Profile | null;
}

export function About({ profile }: AboutProps) {
    const aboutText = profile?.about ||
        'Passionate software engineer specializing in building high-performance web applications and maintainable systems. Dedicated to clean code, domain-driven design, and performant backends with Laravel, paired with responsive, accessible user interfaces built on React, Inertia.js, and Tailwind CSS. Enthusiastic about continuous learning, open source contribution, and solving complex architectural challenges.';

    const highlights = [
        {
            title: 'Arsitektur Bersih & Teruji',
            description: 'Menulis kode backend modular dengan validasi ketat, relasi database optimal, dan cakupan automated testing Pest PHP.',
            icon: Database,
        },
        {
            title: 'Antarmuka Responsif & Cepat',
            description: 'Membangun SPA interaktif berbasis React 19 dan Inertia.js v3 dengan estetika Neobrutalism berkarakter tegas.',
            icon: Layout,
        },
        {
            title: 'Deployment Siap Produksi',
            description: 'Ramah terhadap shared hosting cPanel tanpa memerlukan symlink SSH, serta kompatibel dengan pipeline cloud modern.',
            icon: Cpu,
        },
    ];

    return (
        <section id="about" className="w-full py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-base border-2 border-border bg-secondary-background p-6 sm:p-8 md:p-12 shadow-shadow">
                    {/* Header Badge */}
                    <div className="inline-flex items-center rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)] mb-4">
                        TENTANG SAYA
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading tracking-tight text-foreground mb-6">
                        Mendedikasikan Diri untuk Kualitas Perangkat Lunak & Rekayasa Web Handal
                    </h2>

                    {/* Narrative Bio */}
                    <div className="prose max-w-none text-base md:text-lg font-base leading-relaxed text-foreground/85 mb-10">
                        <p>{aboutText}</p>
                    </div>

                    {/* 3 Value Proposition Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t-2 border-border">
                        {highlights.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className="rounded-base border-2 border-border bg-background p-5 shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                >
                                    <div className="size-10 rounded-base border-2 border-border bg-main flex items-center justify-center shadow-[1px_1px_0px_0px_var(--border)] mb-4">
                                        <Icon className="size-5 text-main-foreground" />
                                    </div>
                                    <h3 className="font-heading text-lg text-foreground mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm font-base text-foreground/80 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
```

---

#### Blueprint 3.4: `resources/js/components/landing/skills-grid.tsx`

```tsx
import * as React from 'react';
import { Server, Layout, Wrench, Star, Code } from 'lucide-react';
import type { Skill } from '@/types/portfolio';

interface SkillsGridProps {
    skills: Skill[];
}

export function SkillsGrid({ skills }: SkillsGridProps) {
    // Group skills by category (Backend, Frontend, Tools, etc.)
    const groupedSkills = React.useMemo(() => {
        const groups: Record<string, Skill[]> = {
            Backend: [],
            Frontend: [],
            Tools: [],
        };

        skills.forEach((skill) => {
            const cat = skill.category || 'Tools';
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(skill);
        });

        return groups;
    }, [skills]);

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'backend':
                return Server;
            case 'frontend':
                return Layout;
            case 'tools':
                return Wrench;
            default:
                return Code;
        }
    };

    return (
        <section id="skills" className="w-full py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-10 space-y-3">
                    <div className="inline-flex items-center rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                        KEAHLIAN TEKNIS
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-heading tracking-tight text-foreground">
                        Stack Teknologi & Peralatan Kerja
                    </h2>
                    <p className="text-base font-base text-foreground/80 max-w-2xl">
                        Keahlian teknis yang dikuasai untuk merancang, membangun, dan memelihara aplikasi web modern dari backend hingga antarmuka pengguna.
                    </p>
                </div>

                {/* Categorized Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Object.entries(groupedSkills).map(([category, categorySkills]) => {
                        const Icon = getCategoryIcon(category);

                        return (
                            <div
                                key={category}
                                className="rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow flex flex-col justify-between"
                            >
                                <div>
                                    {/* Category Title Header */}
                                    <div className="flex items-center gap-3 border-b-2 border-border pb-4 mb-5">
                                        <div className="size-10 rounded-base border-2 border-border bg-main flex items-center justify-center shadow-[1px_1px_0px_0px_var(--border)]">
                                            <Icon className="size-5 text-main-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="font-heading text-xl text-foreground">
                                                {category}
                                            </h3>
                                            <span className="text-xs font-base text-foreground/70">
                                                {categorySkills.length} keahlian
                                            </span>
                                        </div>
                                    </div>

                                    {/* Skills List Badges */}
                                    <div className="flex flex-wrap gap-2.5">
                                        {categorySkills.length === 0 ? (
                                            <p className="text-sm font-base text-foreground/60 italic">
                                                Belum ada keahlian terdaftar.
                                            </p>
                                        ) : (
                                            categorySkills.map((skill) => (
                                                <div
                                                    key={skill.id}
                                                    className={`inline-flex items-center gap-1.5 rounded-base border-2 border-border px-3 py-1.5 text-xs font-heading transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none ${
                                                        skill.is_featured
                                                            ? 'bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]'
                                                            : 'bg-background text-foreground shadow-[1px_1px_0px_0px_var(--border)]'
                                                    }`}
                                                >
                                                    {skill.is_featured && (
                                                        <Star className="size-3 fill-current text-foreground shrink-0" />
                                                    )}
                                                    <span>{skill.name}</span>
                                                    {skill.level && (
                                                        <span className="ml-1 opacity-75 font-base text-[10px]">
                                                            ({skill.level})
                                                        </span>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
```

---

#### Blueprint 3.5: `resources/js/components/landing/timeline.tsx`

```tsx
import * as React from 'react';
import { Briefcase, GraduationCap, Calendar, Building2 } from 'lucide-react';
import type { Experience, Education } from '@/types/portfolio';

interface TimelineProps {
    experiences: Experience[];
    educations: Education[];
}

export function Timeline({ experiences, educations }: TimelineProps) {
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'Sekarang';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
        } catch {
            return dateString;
        }
    };

    return (
        <section id="timeline" className="w-full py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-12 space-y-3">
                    <div className="inline-flex items-center rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                        RIWAYAT KARIER & PENDIDIKAN
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-heading tracking-tight text-foreground">
                        Pengalaman Kerja & Rekam Jejak Akademik
                    </h2>
                    <p className="text-base font-base text-foreground/80 max-w-2xl">
                        Perjalanan profesional dan pendidikan terstruktur yang membentuk fondasi keahlian rekayasa sistem.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Experiences Column */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-10 rounded-base border-2 border-border bg-main flex items-center justify-center shadow-[1px_1px_0px_0px_var(--border)]">
                                <Briefcase className="size-5 text-main-foreground" />
                            </div>
                            <h3 className="text-2xl font-heading text-foreground">
                                Pengalaman Kerja
                            </h3>
                        </div>

                        {experiences.length === 0 ? (
                            <div className="rounded-base border-2 border-border bg-secondary-background p-6 text-sm font-base text-foreground/70">
                                Belum ada riwayat pengalaman kerja.
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-border pl-6 ml-3 space-y-8">
                                {experiences.map((exp) => (
                                    <div key={exp.id} className="relative group">
                                        {/* Neobrutalist Timeline Node */}
                                        <div className="absolute -left-[31px] top-1.5 size-4 rounded-xs border-2 border-border bg-main shadow-[1px_1px_0px_0px_var(--border)] transition-transform group-hover:scale-125"></div>

                                        {/* Card */}
                                        <div className="rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <h4 className="font-heading text-lg text-foreground">
                                                    {exp.role}
                                                </h4>
                                                <span className="rounded-base border-2 border-border bg-main px-2 py-0.5 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                                                    {formatDate(exp.start_date)} – {formatDate(exp.end_date)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-sm font-heading text-foreground/80 mb-3">
                                                <Building2 className="size-4" />
                                                <span>{exp.company}</span>
                                            </div>

                                            {exp.description && (
                                                <p className="text-sm font-base leading-relaxed text-foreground/85">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Educations Column */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-10 rounded-base border-2 border-border bg-main flex items-center justify-center shadow-[1px_1px_0px_0px_var(--border)]">
                                <GraduationCap className="size-5 text-main-foreground" />
                            </div>
                            <h3 className="text-2xl font-heading text-foreground">
                                Riwayat Pendidikan
                            </h3>
                        </div>

                        {educations.length === 0 ? (
                            <div className="rounded-base border-2 border-border bg-secondary-background p-6 text-sm font-base text-foreground/70">
                                Belum ada riwayat pendidikan.
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-border pl-6 ml-3 space-y-8">
                                {educations.map((edu) => (
                                    <div key={edu.id} className="relative group">
                                        {/* Neobrutalist Timeline Node */}
                                        <div className="absolute -left-[31px] top-1.5 size-4 rounded-xs border-2 border-border bg-secondary-background shadow-[1px_1px_0px_0px_var(--border)] transition-transform group-hover:scale-125"></div>

                                        {/* Card */}
                                        <div className="rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <h4 className="font-heading text-lg text-foreground">
                                                    {edu.degree}
                                                </h4>
                                                <span className="rounded-base border-2 border-border bg-background px-2 py-0.5 text-xs font-heading shadow-[1px_1px_0px_0px_var(--border)]">
                                                    {edu.start_year} – {edu.end_year || 'Sekarang'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-sm font-heading text-foreground/80 mb-3">
                                                <Building2 className="size-4" />
                                                <span>{edu.institution}</span>
                                            </div>

                                            {edu.description && (
                                                <p className="text-sm font-base leading-relaxed text-foreground/85">
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
```

---

#### Blueprint 3.6: `resources/js/components/landing/certifications.tsx`

```tsx
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
```

---

#### Blueprint 3.7: `resources/js/components/landing/contact.tsx`

```tsx
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
```

---

#### Blueprint 3.8: `resources/js/components/landing/footer.tsx`

```tsx
import * as React from 'react';
import { ArrowUp, Code, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/types/portfolio';

interface FooterProps {
    profile?: Profile | null;
}

export function Footer({ profile }: FooterProps) {
    const currentYear = new Date().getFullYear();
    const name = profile?.name || 'M FAUZAN HANIF';

    return (
        <footer className="w-full border-t-2 border-border bg-secondary-background py-10 mt-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand & Attribution */}
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <div className="inline-flex items-center gap-2 font-heading text-base text-foreground">
                            <span className="rounded-base border-2 border-border bg-main px-2 py-0.5 text-xs text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                                MFH
                            </span>
                            <span>{name}</span>
                        </div>
                        <p className="text-xs font-base text-foreground/75 text-center md:text-left">
                            Personal Portfolio & Content Management System.
                        </p>
                    </div>

                    {/* Quick Section Links */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-heading">
                        <a href="/#hero" className="hover:underline">Beranda</a>
                        <a href="/#about" className="hover:underline">Tentang</a>
                        <a href="/#skills" className="hover:underline">Keahlian</a>
                        <a href="/#projects" className="hover:underline">Proyek</a>
                        <a href="/#timeline" className="hover:underline">Riwayat</a>
                        <a href="/#certifications" className="hover:underline">Sertifikat</a>
                        <a href="/#articles" className="hover:underline">Artikel</a>
                        <a href="/#contact" className="hover:underline">Kontak</a>
                    </div>

                    {/* Back to Top & CMS Admin Login */}
                    <div className="flex items-center gap-3">
                        <a
                            href="/login"
                            className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-background px-2.5 py-1 text-xs font-heading shadow-[1px_1px_0px_0px_var(--border)] transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                            title="Akses CMS Admin"
                        >
                            <Lock className="size-3" />
                            <span>CMS</span>
                        </a>

                        <a href="#hero">
                            <Button variant="neutral" size="icon-xs" title="Kembali ke atas">
                                <ArrowUp className="size-3.5" />
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Bottom Legal Notice */}
                <div className="mt-8 border-t-2 border-border/40 pt-4 text-center text-xs font-base text-foreground/70">
                    © {currentYear} {name}. Seluruh hak cipta dilindungi. Dibangun dengan Laravel 13, React 19, Inertia.js v3, dan Tailwind CSS v4.
                </div>
            </div>
        </footer>
    );
}
```

---

#### Blueprint 3.9: `resources/js/components/landing/index.ts`

```tsx
export { Navbar } from './navbar';
export { Hero } from './hero';
export { About } from './about';
export { SkillsGrid } from './skills-grid';
export { Timeline } from './timeline';
export { Certifications } from './certifications';
export { Contact } from './contact';
export { Footer } from './footer';
```

---

## 5. Verification Method

### 5.1. Files Inspection
Verify that each target file contains the specified code:
1. `resources/css/app.css` includes `@theme inline` with all tokens (`--color-main`, `--spacing-boxShadowX: 2px;`, `--radius-base: 10px;`, `--shadow-shadow: var(--shadow);`, etc.).
2. `resources/js/app.tsx` layout resolver checks `welcome`, `projects`, `articles`, `articles/*` and returns `null`.
3. `resources/js/components/landing/` contains all 8 component files plus `index.ts`.
4. `resources/js/layouts/public-layout.tsx` is created.

### 5.2. Type Checking
Run TypeScript typecheck across all components:
```bash
pnpm run types:check
```
*Expected result:* 0 diagnostic errors for any of the landing components or public layout.

### 5.3. Layout Isolation Test
1. Visit `/` -> Renders landing page without CMS sidebar.
2. Visit `/projects` -> Renders projects catalog without CMS sidebar.
3. Visit `/articles` -> Renders articles catalog without CMS sidebar.
4. Visit `/dashboard` -> Renders protected CMS dashboard with `AppLayout` and CMS sidebar.

### 5.4. Theme Switching Test
Clicking the Sun/Moon button on `Navbar` toggles `.dark` class on `<html>` and dynamically adjusts borders, background colors, and hard shadows.
