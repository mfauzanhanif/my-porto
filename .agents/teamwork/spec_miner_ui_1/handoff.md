# Handoff Report: UI and CMS Specification Mining
**Project**: M FAUZAN HANIF Personal Portfolio and CMS Web Application  
**Miner Role**: UI and CMS Spec Miner (`spec_miner_ui_1`)  
**Date**: 2026-10-12  

---

## 1. Observation

### 1.1 Source Documents and Authoritative Files Inspected
The following files were inspected verbatim to extract UI, CMS, design, and architecture specifications:
- `c:\laragon\www\fauzanhanif\.agents\teamwork\ORIGINAL_REQUEST.md`: High-level prompt specifying requirements R1 through R5, tech stack (Laravel 13, React 19, Inertia.js v3, Tailwind CSS v4, Spatie Media Library, Fortify, Neobrutalism), default credentials (`fauzanhanif2112@gmail.com` / `password`), and acceptance criteria.
- `c:\laragon\www\fauzanhanif\docs\DESIGN.md`: Complete Neobrutalism design system guidelines (lines 1–275).
  - Borders: "Setiap komponen memiliki bingkai tegas dengan garis solid 2px (`border-2 border-border`)" (line 11).
  - Shadows: "Bayangan tegas tanpa efek blur (`box-shadow: 2px 2px 0px 0px var(--border)` / `shadow-shadow`)" (lines 12, 39, 125).
  - Radius: "Sudut rounded terukur (`rounded-base: 10px`)" (line 16, 124).
  - Hover physics: `hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none` (line 14, 160) and reverse variant `hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow` (line 163).
  - Font: Space Grotesk primary, Instrument Sans fallback; weights `font-base: 500`, `font-heading: 700` (lines 135–139).
  - Palettes: Monochromatic Sky default (`--background: hsl(207, 89%, 93%)`, `--main: hsl(204, 100%, 50%)`, `--secondary-background: oklch(100% 0 0)`), Duotone Sky-Violet (`--background: hsl(236, 100%, 80%)`), and Dark mode (`.dark`) (lines 30–92).
  - Article typography rendering tokens: h2/h3 `border-b-2 border-border`, blockquote `border-l-4 border-border bg-main/10`, code block `border-2 border-border bg-secondary-background rounded-base p-4 shadow-[2px_2px_0px_0px_var(--border)]`, article images `rounded-base border-2 border-border shadow-shadow` (lines 204–209).
- `c:\laragon\www\fauzanhanif\docs\PRD.md`: Full requirements document (lines 1–415).
  - Architecture: Monolith modern Laravel 13 + React 19 + Inertia v3 + MySQL.
  - Section breakdown: Hero/About, Featured Skills, Featured Projects, Featured Articles, Education, Experiences, Certifications, Contact & Footer.
  - Eager loading & performance constraint: Single props payload via `HomeController` with eager loading (`with()`) and `.take(3)` limits for featured sections (lines 31–32, 139–143).
  - Deployment constraint: Shared hosting cPanel without Node.js and SSH; Spatie media stored in disk `public` (`public/uploads/...`) without symlink (`storage:link`); SQL seed export for phpMyAdmin import (lines 37–40, 409–414).
- `c:\laragon\www\fauzanhanif\docs\ROADMAP.md`: Phase breakdown (Phase 0 to Phase 5), task tracking matrix T-01 to T-16, and component directories.
- `c:\laragon\www\fauzanhanif\docs\DATABASE.md`: Schema, fields, modifiers, enums (`CategoryType: article, project`, `ArticleStatus: draft, published`), model casting, and pivot relations (`article_category`, `project_category`, `article_tag`) (lines 1–415).
- `c:\laragon\www\fauzanhanif\docs\features/`:
  - `01-beranda-perkenalan.md`: Hero photo fallback placeholder, large title, tagline, bio, contact email `mailto`, dynamic social media links from JSON, sticky navbar with section anchor jumps.
  - `02-daftar-proyek.md`: Featured projects on landing page (max 3), archive page `/projects` with category filtering (`type = 'project'`), project detail view, empty state message.
  - `03-skill-keahlian.md`: Skills grouped by categories (Backend, Frontend, Tools), proficiency levels, featured skills (3–6) on landing page.
  - `04-artikel-blog.md`: Featured articles on landing page (max 3 published), archive page `/articles` with client-side keyword search, reader page `/articles/{slug}` with Neobrutalism typography rendering, drafts hidden from public.
  - `05-riwayat-sertifikat.md`: Chronological education and experience timelines, certifications showcase with credential verification links and preview images.
  - `06-kelola-konten.md`: Admin dashboard metrics and quick actions, CRUD for Projects, Articles (TipTap WYSIWYG, cover, category, tag, draft/published), Skills, Educations, Experiences, Certifications, Profile & Contact (with live photo preview and JSON sosmed editor), form validation with inline errors and toast alerts.
  - `07-login-admin.md`: Fortify login at `/login`, error handling, rate limiting (5 attempts/min), secure logout, guest protection with redirect to `/login`.
  - `08-kategori-tag.md`: Categories management with `type` toggle (`article`/`project`), duplicate prevention, cascade detach without deleting content, Tags management specifically for articles with usage count display.

### 1.2 Existing Project Codebase Observations
Direct inspection of files in `c:\laragon\www\fauzanhanif`:
1. `resources/js/types/portfolio.ts`:
   - Already defines TypeScript contracts: `ArticleStatus` (`'draft' | 'published'`), `CategoryType` (`'article' | 'project'`), `Profile`, `Skill`, `Education`, `Experience`, `Certification`, `Category`, `Tag`, `Article`, `Project`, and `PortfolioHomeProps`.
2. `resources/js/app.tsx`:
   - `createInertiaApp` sets layout dynamically:
     ```tsx
     layout: (name) => {
         switch (true) {
             case name === 'welcome': return null;
             case name.startsWith('auth/'): return AuthLayout;
             default: return AppLayout;
         }
     }
     ```
   - Observed that if public archive pages (`projects`, `articles`, `articles/show`) fall under `default`, they would inherit `AppLayout` (admin sidebar layout) unless explicitly mapped or configured with their own layout.
3. `resources/css/app.css`:
   - Currently contains default Tailwind v4 tokens; needs explicit alignment with `docs/DESIGN.md` tokens (`--radius-base: 10px`, `--shadow-shadow: 2px 2px 0px 0px var(--border)`, `--spacing-boxShadowX: 2px`, `--spacing-boxShadowY: 2px`, `--font-weight-base: 500`, `--font-weight-heading: 700`, `--color-main`, `--color-secondary-background`).
4. `resources/js/components/ui/button.tsx`:
   - Already implements Neobrutalism button variants: `default`, `noShadow`, `neutral`, `reverse` with tactile translation classes `hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none` and `rounded-base`.
5. `resources/js/components/ui/card.tsx`:
   - Uses `rounded-base flex flex-col shadow-shadow border-2 border-border bg-background text-foreground font-base`.
6. `resources/js/components/ui/sonner.tsx` & `resources/js/hooks/use-flash-toast.ts`:
   - Configured with Neobrutalism toast classes and listens to Inertia flash event: `router.on('flash', ...)`.
   - `App\Http\Middleware\HandleInertiaRequests` does not yet share `flash.toast` in `share(Request $request)` props.
7. `resources/js/components/media/`:
   - Pre-built components exist: `MediaImage`, `PlaceholderSvg`, `ResponsiveImage`, `ResponsiveImageWithPlaceholder` using `rounded-base border-2 border-border object-cover`.
8. `package.json`:
   - React 19.2.0, Inertia 3.0.0, Tailwind 4.0.0, Base UI 1.9.0, Lucide React 0.475.0, Sonner 2.0.0.
   - Note: `@tiptap/react` is not currently in `package.json`.
9. `routes/web.php` & `php artisan route:list`:
   - Fortify routes registered: `login` (GET/POST), `logout` (POST), `password.request`, `password.reset`.
   - `FortifyServiceProvider` registers `Fortify::loginView(fn () => Inertia::render('auth/login'))`.
   - Current routes: `/` (`welcome`) and `/dashboard`.

---

## 2. Logic Chain

1. **Design System Consistency**:
   - Observations 1.1 (`docs/DESIGN.md`) and 1.2 (`button.tsx`, `card.tsx`) prove that Neobrutalism is enforced as strict styling laws: 2px solid border (`border-2 border-border`), 10px border-radius (`rounded-base`), 2px non-blurred hard shadow (`shadow-shadow`), tactile translation on hover (`hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none`), and Space Grotesk typography.
   - Any component created (whether public landing or CMS admin) that uses rounded-full, 1px borders, or blurred box-shadows violates the authoritative specification.

2. **Public Data Flow & Performance**:
   - Observation 1.1 (`docs/PRD.md`, `01-beranda-perkenalan.md`) requires the landing page to load immediately without client-side waterfalls.
   - Therefore, `HomeController@index` must retrieve all portfolio sections in a single round-trip using eager loading (`with(['categories', 'tags'])`) and limit featured projects and articles with `.take(3)`.
   - The data contract is strictly defined by `PortfolioHomeProps` in `resources/js/types/portfolio.ts`.

3. **Public Navigation & Archive Routing Architecture**:
   - Observation 1.2 (`app.tsx`) shows that the default layout resolver assigns `AppLayout` (admin shell with sidebar) to any component not starting with `auth/` or equal to `welcome`.
   - Therefore, public archive pages (`projects.tsx`, `articles.tsx`, `articles/show.tsx`) must either define `Page.layout = ...` or be included in a dedicated public layout exemption in `app.tsx`.

4. **Authentication & CMS Dashboard Flow**:
   - Fortify is configured to render `auth/login` (`resources/js/pages/auth/login.tsx`) and redirect authenticated users to `/dashboard`.
   - R1 & R3 dictate default admin credentials (`fauzanhanif2112@gmail.com` / `password`), guest middleware protection (`auth`), and a dashboard displaying content counts and quick links.
   - CMS CRUD actions require Inertia `useForm` for form reactivity, `<InputError />` for inline errors, `<AlertError />` for summary banners, and `sonner` toasts via flash messages.

5. **Quality Assurance & Verification**:
   - Acceptance criteria require 100% passing Pest tests (`tests/Feature/`), clean Pint code formatting, error-free TypeScript (`pnpm run types:check`), and error-free Vite build (`pnpm run build`).
   - cPanel compatibility requires disk `public` (`public/uploads/...`) without symlinks and database dumps ready for phpMyAdmin.

---

## 3. Caveats

1. **WYSIWYG Editor Dependency**:
   - While `docs/features/06-kelola-konten.md` specifies "editor WYSIWYG berbasis TipTap" and `docs/PRD.md` mentions TipTap / Quill, neither package is currently present in `package.json`. The implementation agent will need to decide whether to install `@tiptap/react` or implement a lightweight formatted content editor.
2. **Inertia Flash Toast Data Bridge**:
   - `useFlashToast.ts` is configured to listen to `router.on('flash')`, but `HandleInertiaRequests.php` does not currently include session flash data in its `share()` method. This must be wired up for toast notifications to trigger across Inertia page visits.
3. **Route & Layout Conflict on Public Pages**:
   - If `/projects` or `/articles` are created as new Inertia pages, they must explicitly bypass `AppLayout` in `resources/js/app.tsx` to prevent the admin CMS sidebar from rendering on public pages.
4. **Command Execution Permissions**:
   - Dynamic terminal commands (such as `php artisan test`) required interactive permissions that were denied by system policy during this turn; all specifications were verified by static analysis of code, configuration, and documentation files.

---

## 4. Conclusion & Complete Specification Tables

All UI design, public page, CMS dashboard, and quality criteria specifications have been thoroughly discovered and cataloged below.

### 4.1 Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Neobrutalism Design System | CSS Theme Variables | Base color tokens for Monochromatic (Sky), Duotone (Sky-Violet), and Dark mode | CSS variables (`:root`, `[data-theme]`, `.dark`) | Global theme colors, borders, and shadows | Falls back to system default | `docs/DESIGN.md`, `resources/css/app.css` |
| 2 | Neobrutalism Design System | Bold Solid Borders | 2px solid border applied across all cards, buttons, badges, and inputs | CSS class `border-2 border-border` | Crisp high-contrast outlines | N/A (1px strictly prohibited) | `docs/DESIGN.md` §1, §7 |
| 3 | Neobrutalism Design System | Hard Box Shadows | 2px horizontal and vertical hard shadow without blur | CSS class `shadow-shadow` (`2px 2px 0px 0px var(--border)`) | Tactile Neobrutalist depth | N/A (blurred shadows prohibited) | `docs/DESIGN.md` §1, §3 |
| 4 | Neobrutalism Design System | Measured Corner Radius | Standard 10px rounded corners on all container elements | CSS class `rounded-base` (`--radius-base: 10px`) | Modern approachable brutalist shape | `rounded-full` / `rounded-3xl` banned on cards | `docs/DESIGN.md` §1, §7 |
| 5 | Neobrutalism Design System | Tactile Button Physics | Button press effect shifting 2px towards shadow on hover/click | Hover classes `hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none` | Visual tactile feedback | Reverse variant shifts in opposite direction | `docs/DESIGN.md` §5.1, `button.tsx` |
| 6 | Neobrutalism Design System | Space Grotesk Typography | High-contrast typography hierarchy with Space Grotesk font | `font-base` (500) and `font-heading` (700) | Distinct headings (H1–H4), body text, and captions | Fallback to Instrument Sans | `docs/DESIGN.md` §4 |
| 7 | Neobrutalism Design System | Neobrutalist Article Typography | Styled HTML rendering for WYSIWYG article contents | Rendered HTML elements (`<h2>`, `<blockquote>`, `<pre>`, `<img>`) | Headings with bottom border, callouts with thick left border, shadowed code blocks | Unstyled HTML tags fall back to browser defaults | `docs/DESIGN.md` §5.5 |
| 8 | Neobrutalism Design System | Framer Motion Spring Physics | Spring physics animation variants for page elements | `neoSpring` (stiffness: 400, damping: 25), `staggerContainer`, `popFadeUp` | Smooth pop-in and fade-up animations | N/A | `docs/DESIGN.md` §6 |
| 9 | Public Showcase | Sticky Navbar | Fixed/sticky top navigation bar with Neobrutalism styling | Section anchors, logo, resume download button | Quick scroll jumping to sections with active indicator | Responsive collapse to mobile menu | `docs/features/01-beranda-perkenalan.md` |
| 10 | Public Showcase | Hero Section | Opening showcase featuring owner identity and CTAs | Profile data (`name`, `headline`, `about`, `photo`, `sosmed`) | Hero banner with photo, large title, bio, and CTA buttons | Placeholder SVG displayed if photo is null | `docs/features/01-beranda-perkenalan.md` |
| 11 | Public Showcase | About Section & Skills Grid | Personal summary bio and skills organized by domain | Skills list with categories (`Backend`, `Frontend`, `Tools`), levels, and icons | Categorized badges with Neobrutalism borders | Section hidden or empty state if no skills | `docs/features/01-beranda-perkenalan.md`, `03-skill-keahlian.md` |
| 12 | Public Showcase | Featured Projects Showcase | Highlighted software projects on landing page | Projects where `is_featured = true` (max 3) | Project cards with cover image, title, tech stack pills, and URLs | Hidden gracefully if 0 featured projects | `docs/features/02-daftar-proyek.md` |
| 13 | Public Showcase | Experience & Education Timelines | Chronological work and academic history | `experiences` (by `start_date` desc) and `educations` (by `start_year` desc) | Clean timeline cards with roles, dates, and descriptions | Empty sections hidden or show fallback message | `docs/features/05-riwayat-sertifikat.md` |
| 14 | Public Showcase | Certifications Showcase | Professional licenses and certifications with verification | `certifications` (by `issued_at` desc) with image and credential URL | Card grid with preview image and credential verification link | Placeholder image if certificate image null | `docs/features/05-riwayat-sertifikat.md` |
| 15 | Public Showcase | Featured Articles Section | Highlighted blog posts on landing page | Articles where `status = 'published'` and `is_featured = true` (max 3) | Article cards with cover, title, date, excerpt, and reader link | Hidden gracefully if 0 featured articles | `docs/features/04-artikel-blog.md` |
| 16 | Public Showcase | Contact Section & Footer | Communication channels and social profiles | Email (`mailto`) and parsed `sosmed` JSON links | Tactile social icon buttons and direct email link | Broken icons/links suppressed if value empty | `docs/features/01-beranda-perkenalan.md` |
| 17 | Public Showcase | Projects Archive (`/projects`) | Full catalog of all portfolio projects | Filter query `category` (optional) | Responsive grid of all projects with category filter pills | Displays clear empty message if filter has 0 matches | `docs/features/02-daftar-proyek.md` |
| 18 | Public Showcase | Project Detail View | Complete project information, tech stack, and links | Project slug | Full project description, tech tags, demo URL, and cover | 404 response if slug does not exist | `docs/features/02-daftar-proyek.md` |
| 19 | Public Showcase | Articles Archive (`/articles`) | Full listing of published blog posts | Search query keyword `q` (client-side or server query) | List/grid of articles with search bar, categories, and tags | "Tidak ada artikel ditemukan" if no matches | `docs/features/04-artikel-blog.md` |
| 20 | Public Showcase | Article Reader (`/articles/{slug}`) | Distraction-free article reader with Neobrutalism styling | Article slug | Formatted title, metadata, cover, and WYSIWYG HTML content | 404 if slug not found or status is 'draft' | `docs/features/04-artikel-blog.md` |
| 21 | Public Showcase | HomeController Props Data Flow | Efficient eager loading controller serving landing page | Single GET request to `/` | Consolidated `PortfolioHomeProps` object | Database exceptions handled by Laravel | `docs/PRD.md`, `portfolio.ts` |
| 22 | Admin Authentication | Fortify Login Page (`/login`) | Secure admin authentication portal | Form inputs (`email`, `password`, optional `remember`) | Redirects to `/dashboard` on success | Inline error message on invalid credentials | `docs/features/07-login-admin.md`, `FortifyServiceProvider` |
| 23 | Admin Authentication | Login Rate Limiting | Brute force defense throttling login attempts | Rapid successive invalid login submissions | HTTP 429 Too Many Requests response | Locked out after 5 failed attempts per minute | `docs/features/07-login-admin.md`, `config/fortify.php` |
| 24 | Admin Authentication | Secure Logout | Terminate admin session safely | POST request to `route('logout')` | Session destroyed, redirected to `/` (home) | Unauthenticated user handled gracefully | `docs/features/07-login-admin.md` |
| 25 | Admin Authentication | Auth Middleware Protection | Guard CMS routes against unauthorized access | Unauthenticated GET/POST to `/dashboard` or `/admin/*` | Redirected to `/login` | 403/401 response for API/unauthorized requests | `docs/features/07-login-admin.md`, `routes/web.php` |
| 26 | CMS Dashboard | Dashboard Overview (`/dashboard`) | High-level summary metrics of all website content | Aggregated database counts | Metric cards (total articles, draft/published ratio, projects, skills, certs) | Displays 0 if collections empty | `docs/features/06-kelola-konten.md` |
| 27 | CMS Dashboard | Quick Action Shortcuts | Fast entry points for common admin tasks | Button clicks on dashboard | Immediate navigation to create/edit forms | N/A | `docs/features/06-kelola-konten.md` |
| 28 | CMS Dashboard | Profile & Contact CRUD (`/admin/profile`) | Owner personal data and social links management | Form fields (`name`, `headline`, `about`, `email`, `photo`, `sosmed`) | Updated `profiles` record and Spatie media asset | Validation error on invalid email or required fields | `docs/features/06-kelola-konten.md` |
| 29 | CMS Dashboard | Projects CRUD (`/admin/projects`) | Creation and modification of software project entries | Title, slug, description, tech stack tags, demo URL, cover, categories, is_featured | Persisted `projects` record and `project_category` pivot | Validation error on missing title or duplicate slug | `docs/features/06-kelola-konten.md` |
| 30 | CMS Dashboard | Articles CRUD with WYSIWYG (`/admin/articles`) | Rich-text blogging and content publishing interface | Title, slug, excerpt, HTML content, cover, status, published_at, categories, tags | Persisted `articles` record and category/tag pivots | Rejects empty content or invalid status value | `docs/features/06-kelola-konten.md` |
| 31 | CMS Dashboard | Skills CRUD (`/admin/skills`) | Technical skill inventory and proficiency levels | Name, category, level, icon, is_featured | Persisted `skills` record | Validation error on missing name | `docs/features/06-kelola-konten.md` |
| 32 | CMS Dashboard | Educations CRUD (`/admin/educations`) | Academic records management | Institution, degree, start_year, end_year, description | Persisted `educations` record | Error if end_year is before start_year | `docs/features/06-kelola-konten.md` |
| 33 | CMS Dashboard | Experiences CRUD (`/admin/experiences`) | Professional career history management | Company, role, start_date, end_date, description | Persisted `experiences` record | Error if end_date is before start_date | `docs/features/06-kelola-konten.md` |
| 34 | CMS Dashboard | Certifications CRUD (`/admin/certifications`) | Licensing and certification credentials management | Name, issuer, issued_at, credential_url, certificate image | Persisted `certifications` record and image file | Error on invalid URL format or missing issuer | `docs/features/06-kelola-konten.md` |
| 35 | CMS Dashboard | Categories CRUD (`/admin/categories`) | Centralized category management for articles and projects | Name, slug, type enum (`article` or `project`) | Persisted `categories` record | Disallows duplicate name/slug within same type | `docs/features/08-kategori-tag.md` |
| 36 | CMS Dashboard | Tags CRUD (`/admin/tags`) | Article-exclusive keyword taxonomy management | Name, slug | Persisted `tags` record with article count display | Disallows duplicate tag name/slug | `docs/features/08-kategori-tag.md` |
| 37 | CMS Dashboard | Inertia useForm & Inline Validation | Client-side reactive form management with server validation | Form submissions via Inertia `useForm` | Dynamic processing state, disabled submit buttons | Shows `<InputError message={errors.field} />` | `docs/features/06-kelola-konten.md`, `input-error.tsx` |
| 38 | CMS Dashboard | Toast Notifications System | Instant feedback banners on CRUD lifecycle operations | Inertia flash toast session payloads | Neobrutalist toast rendered via Sonner | Falls back to alert error if toast fails | `docs/features/06-kelola-konten.md`, `sonner.tsx` |
| 39 | Quality & Verification | Pest Feature Test Suite | Automated PHP test coverage for routes, auth, and CRUD | `php artisan test --compact` | 100% test pass rate across Feature tests | Fails pipeline on assertion failure | `ORIGINAL_REQUEST.md` R5, `docs/ROADMAP.md` |
| 40 | Quality & Verification | Pint Code Formatting | Automatic PHP code style formatting | `vendor/bin/pint --format agent` | PSR-12 and Laravel standard compliance | Automatically fixes formatting inconsistencies | `AGENTS.md` (boost rules) |
| 41 | Quality & Verification | TypeScript Typecheck | Strict compile-time typing across all React code | `pnpm run types:check` (`tsc --noEmit`) | 0 TypeScript diagnostic errors | Halts build if props or interfaces drift | `package.json`, `ORIGINAL_REQUEST.md` R5 |
| 42 | Quality & Verification | Frontend Production Build | Production bundle bundling and code splitting | `pnpm run build` | Optimized assets in `public/build/` with `manifest.json` | Fails if unresolvable imports or syntax errors exist | `package.json`, `ORIGINAL_REQUEST.md` R4 |
| 43 | Quality & Verification | cPanel Symlink-Free Storage | Public disk asset storage without requiring `storage:link` | File uploads to `public/uploads/...` | Directly accessible image URLs on shared hosting | Throws exception if upload directory unwritable | `ORIGINAL_REQUEST.md` R4, `docs/PRD.md` |
| 44 | Quality & Verification | phpMyAdmin Database Dump | Clean SQL dump for zero-terminal database initialization | Export command / script generating `portfolio_dump.sql` | Self-contained SQL schema and seeded dataset | SQL import fails if syntax or collation invalid | `ORIGINAL_REQUEST.md` R4, `docs/ROADMAP.md` |

---

### 4.2 Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Hero & Profile Media | Profile photo is null or not yet uploaded | Must render `PlaceholderSvg` fallback without broken image icon |
| 2 | Social Media Links | Profile `sosmed` JSON is empty `{}` or contains null/blank URLs | Suppresses icons/links with empty URLs; no broken hrefs rendered |
| 3 | Featured Sections | 0 featured projects or 0 featured articles in database | Section hidden completely or displays friendly placeholder; no broken layout |
| 4 | Article Visibility | Public visitor requests `/articles/{slug}` for article with status `'draft'` | Returns HTTP 404 Not Found; drafts must never be accessible to public |
| 5 | Article Search Filter | Public search query on `/articles` has no matches | Displays "Tidak ada artikel ditemukan" with active search query preserved |
| 6 | Category Deletion | Admin deletes a category that is currently attached to 10 articles | Deletes category record and cascades detaches pivot entries; articles remain intact |
| 7 | Tag Isolation | Admin creates or edits a Project | Tags multi-select is strictly hidden; tags are exclusively for articles |
| 8 | Category Type Isolation | Admin creates an Article | Category dropdown only lists categories where `type = 'article'` (excludes project categories) |
| 9 | Authentication Rate Limit | User submits 6 invalid login attempts within 60 seconds | Fortify throttles request with HTTP 429 and displays rate limit countdown message |
| 10 | Public Page Layout Resolver | Public visitor accesses `/projects` or `/articles` | Must not inherit CMS `AppLayout` (with admin sidebar); must use public layout |
| 11 | Education / Career End Dates | `end_year` or `end_date` is null (currently studying / currently working) | Renders formatted label "Present" or "Sekarang" instead of blank or error |
| 12 | Tech Stack JSON Format | `tech_stack` column in `projects` stored as JSON array vs comma string | Cast as array in Eloquent model; frontend handles both array and string gracefully |
| 13 | cPanel Storage Access | cPanel shared hosting without SSH cannot run `storage:link` | Media must be stored directly in `public/uploads` so URLs map directly to web root |

---

## 5. Verification Method

To independently verify the completeness, correctness, and adherence of these specifications:

1. **Verify Interface Contracts and Type Definitions**:
   - Inspect `resources/js/types/portfolio.ts` to confirm exact alignment with `PortfolioHomeProps`, `Profile`, `Skill`, `Project`, `Article`, `Category`, `Tag`, `Education`, `Experience`, and `Certification`.
2. **Verify Neobrutalism Tokens and Base UI Components**:
   - Inspect `resources/js/components/ui/button.tsx`, `resources/js/components/ui/card.tsx`, `resources/js/components/ui/badge.tsx`, and `resources/js/components/ui/input.tsx` to verify presence of `border-2 border-border`, `shadow-shadow`, `rounded-base`, and `hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none`.
3. **Verify Auth Configuration and Routes**:
   - Inspect `app/Providers/FortifyServiceProvider.php` and `config/fortify.php` to confirm `Fortify::loginView('auth/login')`, rate limiting, and `/dashboard` home redirect.
4. **Verify Quality Gate Commands**:
   - Run `pnpm run types:check` to verify TypeScript typecheck passes with 0 errors.
   - Run `pnpm run build` to verify frontend build produces `public/build/` with 0 warnings.
   - Run `vendor/bin/pint --format agent` to verify PHP code formatting.
   - Run `php artisan test --compact` to verify test suite passing.
