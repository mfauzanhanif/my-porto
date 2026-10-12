# Project: M FAUZAN HANIF Personal Portfolio & CMS

## Architecture
- **Framework & Backend**: Laravel 13 (PHP 8.5) monolith with Laravel Fortify for authentication and Spatie Media Library for media handling.
- **Frontend**: React 19 + Inertia.js v3 SPA, Vite bundler, Wayfinder route integration.
- **Styling**: Tailwind CSS v4 with Neobrutalism design system (2px solid borders `border-2 border-border`, 2px hard shadows `shadow-shadow`, 10px rounded corners `rounded-base`, tactile hover physics, and Space Grotesk typography).
- **Public Data Flow**: `HomeController` provides single round-trip eager-loaded data (`PortfolioHomeProps`) with `.take(3)` on featured collections. Public archive routes (`/projects`, `/articles`, `/articles/{slug}`) load data directly into dedicated Neobrutalist pages.
- **Admin CMS Flow**: Fortify manages `/login` and session auth. All CMS routes (`/dashboard`, `/admin/*`) are protected by `auth` middleware. Form submissions use Inertia `useForm` with inline `<InputError />` alerts and Sonner toast notifications via shared session flash data.
- **Deployment Compatibility**: Shared hosting cPanel friendly without SSH or symlinks: media stored directly in `public_path('uploads')`, and database export dump in `database/portfolio_dump.sql` for phpMyAdmin.

---

## Feature Inventory

Every feature from the Survey phase is enumerated and assigned to a milestone:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Database Migrations | All 10 entity and pivot tables (`profiles`, `categories`, `tags`, `skills`, `projects`, `articles`, `educations`, `experiences`, `certifications`, `project_category`, `article_category`, `article_tag`) | M1 | Survey (DATABASE.md) |
| 2 | Enums & Casting | `CategoryType` (`article`, `project`) and `ArticleStatus` (`draft`, `published`) Enums and model `casts()` method | M1 | Survey (DATABASE.md) |
| 3 | Eloquent Models & Relations | 9 Eloquent models with relations (`hasMany`, `belongsToMany`), scopes, and Spatie Media traits | M1 | Survey (DATABASE.md) |
| 4 | PortfolioDatabaseSeeder | Complete seeder populating Admin (`fauzanhanif2112@gmail.com` / `password`), profile, skills, projects, articles, etc. | M1 | Survey (ORIGINAL_REQUEST.md R1) |
| 5 | Neobrutalism CSS Design System | Tokens in `resources/css/app.css` (`--main`, `--secondary-background`, `--shadow`, `border-2`, `rounded-base: 10px`, Space Grotesk) | M2 | Survey (DESIGN.md) |
| 6 | Public Layout Resolver | Update `resources/js/app.tsx` so public pages (`welcome`, `projects`, `articles`, `articles/show`) do not inherit CMS sidebar | M2 | Survey (app.tsx) |
| 7 | Sticky Neobrutalism Navbar | Top fixed navigation with section jumping and responsive mobile menu | M2 | Survey (features/01) |
| 8 | Hero Section | Personal photo, large title, tagline, bio, CTAs with fallback placeholder | M2 | Survey (features/01) |
| 9 | About & Categorized Skills Grid | Bio summary and skills grouped by Backend, Frontend, and Tools with Neobrutalism badges | M2 | Survey (features/01, 03) |
| 10 | Featured Projects Showcase | Max 3 featured projects with cover, tech stack tags, demo links | M2 | Survey (features/02) |
| 11 | Projects Archive (`/projects`) | Full catalog of projects with category filter pills and detail view | M2 | Survey (features/02) |
| 12 | Career & Education Timelines | Chronological work experience and academic milestones | M2 | Survey (features/05) |
| 13 | Certifications Showcase | Grid of licenses/certifications with credential verification URLs | M2 | Survey (features/05) |
| 14 | Featured Articles Section | Max 3 published featured articles on landing page | M2 | Survey (features/04) |
| 15 | Articles Archive (`/articles`) | Full listing of published blog posts with client-side keyword search | M2 | Survey (features/04) |
| 16 | Article Reader (`/articles/{slug}`) | Single article reader with Neobrutalism typography rendering for HTML | M2 | Survey (features/04, DESIGN.md) |
| 17 | Contact & Footer Section | Direct email `mailto` and social media buttons from JSON | M2 | Survey (features/01) |
| 18 | HomeController Data Flow | Eager loading controller serving `PortfolioHomeProps` to `welcome.tsx` | M2 | Survey (PRD.md) |
| 19 | Fortify Login Page | Neobrutalism `/login` page (`resources/js/pages/auth/login.tsx`) with rate limit countdown and error feedback | M3 | Survey (features/07) |
| 20 | Protected CMS Dashboard | `/dashboard` overview with content metric counters and Quick Actions | M3 | Survey (features/06) |
| 21 | TipTap WYSIWYG Editor | Rich text HTML editor for article drafting with headings, code blocks, lists | M3 | Survey (features/06, PRD.md) |
| 22 | CMS Profile & Contact CRUD | Admin management of personal profile, photo upload, and social JSON | M3 | Survey (features/06) |
| 23 | CMS Projects CRUD | Project creation/editing with cover image upload and category selection | M3 | Survey (features/06) |
| 24 | CMS Articles CRUD | Article management with TipTap, cover, category, tag, draft/published toggle | M3 | Survey (features/06) |
| 25 | CMS Skills CRUD | Skills inventory management with category, level, and icon | M3 | Survey (features/06) |
| 26 | CMS Education CRUD | Academic records management with start/end year validation | M3 | Survey (features/06) |
| 27 | CMS Experiences CRUD | Work history management with start/end date validation | M3 | Survey (features/06) |
| 28 | CMS Certifications CRUD | Licensing records with credential link and certificate image | M3 | Survey (features/06) |
| 29 | CMS Categories CRUD | Category management with `type` toggle (`article` vs `project`) | M3 | Survey (features/08) |
| 30 | CMS Tags CRUD | Article keyword tag management with usage counter | M3 | Survey (features/08) |
| 31 | Reactive Form Validation & Toasts | Inertia `useForm` with inline `<InputError />`, and Sonner toast via flash session bridge | M3 | Survey (features/06, sonner.tsx) |
| 32 | Fix CMS TypeScript Component Diagnostics | Fix Base UI `asChild`, button variants, and missing Wayfinder imports in `components/cms/` | M3 | Survey (tsc output) |
| 33 | cPanel Symlink-Free Media Disk | Configure `config/filesystems.php` public disk to `public_path('uploads')` for shared hosting | M4 | Survey (ORIGINAL_REQUEST.md R4) |
| 34 | phpMyAdmin SQL Database Export | Export clean schema and seeded dataset to `database/portfolio_dump.sql` | M4 | Survey (ORIGINAL_REQUEST.md R4) |
| 35 | Frontend Production Build | Verify `pnpm run build` succeeds without error or warnings | M4 | Survey (ORIGINAL_REQUEST.md R4) |
| 36 | Test Suite Cleanup & Pest Features | Remove obsolete starter-kit settings tests and implement Pest feature tests | M5 | Survey (tests/Pest.php) |
| 37 | E2E Testing Verification & Coverage Hardening | Run opaque-box E2E suite (Tiers 1-4) and white-box adversarial coverage hardening (Tier 5) | M5 | Survey (Dual Track) |
| 38 | Final Code Quality & Formatting | Pass `vendor/bin/pint --format agent` and `pnpm run types:check` with 0 errors | M5 | Survey (AGENTS.md, ORIGINAL_REQUEST.md) |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Backend Data Layer & Seeding | Enums, migrations, models, casts, relations, `PortfolioDatabaseSeeder` | none | DONE |
| M2 | Landing Page & Public Showcases | CSS tokens, public pages (`/`, `/projects`, `/articles`, `/articles/{slug}`), `HomeController`, landing components | M1 | DONE |
| M3 | Admin Auth & CMS Dashboard | Fortify `/login`, `/dashboard`, TipTap editor, CRUD for all 8 entities, toast notifications, fix CMS TS errors | M1 | IN_PROGRESS |
| M4 | Media Management & cPanel Readiness | Direct public disk in `config/filesystems.php`, `database/portfolio_dump.sql`, frontend build | M2, M3 | PLANNED |
| M5 | E2E Integration & QA Hardening | Clean obsolete tests, pass 100% Pest tests, Tier 1-5 E2E tests, Pint, TypeScript check | M4, TEST_READY | PLANNED |

---

## Interface Contracts

### 1. Backend ↔ Public Frontend (`HomeController` ↔ `welcome.tsx`)
```ts
// Contract in resources/js/types/portfolio.ts
export interface PortfolioHomeProps {
    profile: Profile;
    skills: Skill[];
    experiences: Experience[];
    educations: Education[];
    certifications: Certification[];
    featuredProjects: Project[];
    featuredArticles: Article[];
}
```
`HomeController@index` queries:
- `profile`: `Profile::first()`
- `skills`: `Skill::orderBy('category')->get()`
- `experiences`: `Experience::orderByDesc('start_date')->get()`
- `educations`: `Education::orderByDesc('start_year')->get()`
- `certifications`: `Certification::orderByDesc('issued_at')->get()`
- `featuredProjects`: `Project::where('is_featured', true)->with('categories')->take(3)->get()`
- `featuredArticles`: `Article::where('status', ArticleStatus::Published)->where('is_featured', true)->with(['categories', 'tags'])->take(3)->get()`

### 2. Category & Tag Polymorphism
- `Category`: `type` enum (`article` or `project`).
- Articles only attach categories with `type = 'article'` and tags from `tags` table.
- Projects only attach categories with `type = 'project'`. Projects do NOT attach tags.

### 3. Media Upload Interface
- Media stored on disk `public` writing directly to `public_path('uploads')`.
- Public URLs: `url('/uploads/' . $media->id . '/' . $media->file_name)`.
- No symlinks required (`storage:link` bypassed).

### 4. Admin Auth & Flash Toast Contract
- Fortify handles `/login` (POST to `/login`, redirects to `/dashboard`).
- Admin routes group: `Route::middleware(['auth'])->prefix('admin')->group(...)`.
- `HandleInertiaRequests` shares `flash.toast = ['type' => 'success'|'error', 'message' => '...']` consumed by `useFlashToast.ts` and `sonner.tsx`.

---

## Code Layout

- **Enums**: `app/Enums/CategoryType.php`, `app/Enums/ArticleStatus.php`
- **Models**: `app/Models/` (`Profile.php`, `Category.php`, `Tag.php`, `Skill.php`, `Project.php`, `Article.php`, `Education.php`, `Experience.php`, `Certification.php`)
- **Migrations**: `database/migrations/2026_10_12_080000_*.php`
- **Seeders**: `database/seeders/PortfolioDatabaseSeeder.php`, updated `database/seeders/DatabaseSeeder.php`
- **Controllers**:
  - Public: `app/Http/Controllers/HomeController.php`, `app/Http/Controllers/PublicProjectController.php`, `app/Http/Controllers/PublicArticleController.php`
  - Admin: `app/Http/Controllers/Admin/` (`DashboardController.php`, `ProfileController.php`, `ProjectController.php`, `ArticleController.php`, `SkillController.php`, `EducationController.php`, `ExperienceController.php`, `CertificationController.php`, `CategoryController.php`, `TagController.php`)
- **Routes**: `routes/web.php`
- **Frontend Pages**: `resources/js/pages/`
  - Public: `welcome.tsx`, `projects.tsx`, `articles.tsx`, `articles/show.tsx`
  - Auth: `auth/login.tsx`
  - Admin: `dashboard.tsx`, `admin/profile.tsx`, `admin/projects/*.tsx`, `admin/articles/*.tsx`, `admin/skills/*.tsx`, etc.
- **Frontend Components**: `resources/js/components/`
  - `landing/`: `navbar.tsx`, `hero.tsx`, `about.tsx`, `skills-grid.tsx`, `projects-showcase.tsx`, `timeline.tsx`, `certifications.tsx`, `articles-showcase.tsx`, `contact.tsx`, `footer.tsx`
  - `cms/`: CMS forms, WYSIWYG editor, table grids, metric cards
  - `ui/`: Neobrutalism buttons, cards, badges, inputs
- **Tests**: `tests/Feature/` (`HomeTest.php`, `PublicProjectsTest.php`, `PublicArticlesTest.php`, `AuthTest.php`, `CmsCrudTest.php`)
- **Database Dump**: `database/portfolio_dump.sql`
