# Codebase Survey Report: M FAUZAN HANIF Portfolio & CMS

## 1. Observation

A comprehensive, read-only survey of the repository at `c:\laragon\www\fauzanhanif` was performed across 8 core architectural domains.

### 1.1. Backend Dependencies (`composer.json`)
- **File**: `c:\laragon\www\fauzanhanif\composer.json`
- **PHP Version**: `^8.3` (Runtime environment PHP 8.5 per system info)
- **Framework & Core**:
  - `laravel/framework`: `^13.17`
  - `inertiajs/inertia-laravel`: `^3.0`
  - `laravel/fortify`: `^1.37.2`
  - `spatie/laravel-medialibrary`: `^11.23`
  - `laravel/wayfinder`: `^0.1.14`
  - `laravel/chisel`: `^0.1.0`
  - `laravel/tinker`: `^3.0`
- **Testing & Tooling (Dev)**:
  - `pestphp/pest`: `^5.3`
  - `pestphp/pest-plugin-laravel`: `^5.0`
  - `laravel/pint`: `^1.27`
  - `larastan/larastan`: `^3.9`
  - `laravel/boost`: `^2.2`

### 1.2. Frontend Dependencies (`package.json`)
- **File**: `c:\laragon\www\fauzanhanif\package.json`
- **React & Inertia**:
  - `react`: `^19.2.0`, `react-dom`: `^19.2.0`
  - `@inertiajs/react`: `^3.0.0`, `@inertiajs/vite`: `^3.0.0`
- **Styling & Neobrutalism**:
  - `tailwindcss`: `^4.0.0`, `@tailwindcss/vite`: `^4.1.11`
  - `tw-animate-css`: `^1.4.0`, `tailwind-merge`: `^3.0.1`
- **UI & Primitives**:
  - `@base-ui/react`: `^1.9.0`
  - `@radix-ui/react-*` (13 packages: avatar, checkbox, collapsible, dialog, dropdown-menu, label, navigation-menu, select, separator, slot, toggle, toggle-group, tooltip)
  - `lucide-react`: `^0.475.0`
  - `sonner`: `^2.0.0`
  - `class-variance-authority`: `^0.7.1`, `clsx`: `^2.1.1`
- **Tooling**:
  - `vite`: `^8.0.0`, `vite-plus`: `0.3.0`
  - `@laravel/vite-plugin-wayfinder`: `^0.1.3`
  - `typescript`: `^5.7.2`
- **Missing Dependency**:
  - Neither `@tiptap/react` (nor any TipTap extensions / Quill) is installed in `package.json`, despite being required by `docs/PRD.md:396` and `docs/ROADMAP.md:126` for the article WYSIWYG editor.

### 1.3. Database Migrations & Seeders
- **Directory**: `database/migrations/`
  - `0001_01_01_000000_create_users_table.php` (creates `users`, `password_reset_tokens`, `sessions`)
  - `0001_01_01_000001_create_cache_table.php` (creates `cache`, `cache_locks`)
  - `0001_01_01_000002_create_jobs_table.php` (creates `jobs`, `job_batches`, `failed_jobs`)
  - `2026_10_12_070640_create_media_table.php` (creates `media` table for Spatie Media Library)
  - **Status**: None of the portfolio entity migrations exist yet (`profiles`, `categories`, `tags`, `skills`, `projects`, `articles`, `project_category`, `article_category`, `article_tag`, `educations`, `experiences`, `certifications`).
- **Directory**: `database/seeders/`
  - `DatabaseSeeder.php`: Only creates a dummy user (`'name' => 'Test User', 'email' => 'test@example.com'`).
  - `PortfolioDatabaseSeeder` does not exist.

### 1.4. Models, Enums & Controllers
- **Directory**: `app/Models/`
  - Only `User.php` exists. (Configured with PHP 8.4 attributes `#[Fillable]` and `#[Hidden]`).
  - Portfolio models (`Profile`, `Category`, `Tag`, `Skill`, `Project`, `Article`, `Education`, `Experience`, `Certification`) do not exist.
- **Directory**: `app/Enums/`
  - Directory does not exist. Enums `CategoryType` (`article`, `project`) and `ArticleStatus` (`draft`, `published`) are missing.
- **Directory**: `app/Http/Controllers/`
  - `Controller.php` (base abstract controller).
  - `Settings/ProfileController.php` and `Settings/SecurityController.php` exist (starter kit remnants).
  - `HomeController.php` and CMS admin controllers do not exist.

### 1.5. Routes & Fortify Authentication
- **File**: `routes/web.php`
  - Line 5: `Route::inertia('/', 'welcome')->name('home');`
  - Line 7-9: `Route::middleware(['auth', 'verified'])->group(fn() => Route::inertia('dashboard', 'dashboard')->name('dashboard'));`
  - `routes/settings.php` has been deleted in git working tree.
- **Fortify Configuration**:
  - `bootstrap/providers.php:8`: `FortifyServiceProvider::class` registered.
  - `config/fortify.php`:
    - `'guard' => 'web'`
    - `'home' => '/dashboard'`
    - `'features' => [ Features::resetPasswords() ]` (registration and 2FA are disabled).
    - Rate limiter `login`: 5 per minute per email|IP.
  - `app/Providers/FortifyServiceProvider.php`:
    - `Fortify::loginView` -> `auth/login`
    - `Fortify::resetPasswordView` -> `auth/reset-password`
    - `Fortify::requestPasswordResetLinkView` -> `auth/forgot-password`
    - `Fortify::confirmPasswordView` -> `auth/confirm-password`
    - `Fortify::resetUserPasswordsUsing(ResetUserPassword::class)`

### 1.6. Frontend Architecture & Design System
- **Directory**: `resources/js/pages/`
  - **Status**: Completely EMPTY. All initial starter kit pages (`welcome.tsx`, `dashboard.tsx`, `auth/login.tsx`, `settings/*`) were deleted during Phase 0 preparation.
- **Directory**: `resources/js/layouts/`
  - `app-layout.tsx`: Uses CMS sidebar components (`AppShell`, `AppSidebar`, `AppContent`, `AppSidebarHeader`).
  - `auth-layout.tsx`: Uses `Card` and `AppLogoIcon`.
- **Directory**: `resources/js/components/`
  - `cms/`: 13 components (`app-content`, `app-header`, `app-sidebar`, `nav-main`, `nav-user`, etc.).
  - `landing/`: Only `index.ts` placeholder export. No landing sections exist.
  - `media/`: 4 components (`media-image.tsx`, `placeholder-svg.tsx`, `responsive-image.tsx`, `responsive-image-with-placeholder.tsx`).
  - `shared/`: 9 helper components (`app-logo`, `user-info`, `password-input`, etc.).
  - `ui/`: 28 components with Neobrutalism tokens (`button.tsx`, `card.tsx`, `badge.tsx`, etc.).
- **File**: `resources/css/app.css`
  - Imports `@import 'tailwindcss';` and `@import 'tw-animate-css';`.
  - Currently contains standard starter kit OKLCH variables instead of the custom Neobrutalism tokens (`--main`, `--secondary-background`, `--shadow`, etc.) documented in `docs/DESIGN.md:28-49`.
- **File**: `resources/js/types/portfolio.ts`
  - Fully populated with TypeScript interfaces (`Profile`, `Skill`, `Education`, `Experience`, `Certification`, `Category`, `Tag`, `Article`, `Project`, `PortfolioHomeProps`).

### 1.7. Test Setup & Suite Status
- **Files**: `tests/Pest.php`, `phpunit.xml`
- **Pest Configuration**: Feature tests use `RefreshDatabase` with in-memory SQLite (`:memory:`).
- **Execution Result (`php artisan test --compact`)**:
  - Total tests: 27 | Passed: 15 | Failures: 1 | Errors: 7 | Skipped: 4.
  - **Failure**:
    - `PasswordConfirmationTest::test_confirm_password_screen_can_be_rendered`: "Inertia page component file [auth/confirm-password] does not exist."
  - **Errors**:
    - `ProfileUpdateTest`: 5 errors because `Route [profile.edit] not defined` and `Route [profile.update] not defined` (due to deletion of `routes/settings.php`).
    - `SecurityTest`: 2 errors because `Route [security.edit] not defined`.
  - **Root Cause**: Starter kit test files in `tests/Feature/Settings/` are still present while corresponding routes and page components were deleted.

### 1.8. Storage & Media Setup
- **Config**: `config/media-library.php`
  - `'disk_name' => env('MEDIA_DISK', 'public')`
  - `'max_file_size' => 1024 * 1024 * 10` (10MB)
  - `'image_driver' => env('IMAGE_DRIVER', 'gd')`
- **Config**: `config/filesystems.php`
  - `'public'` disk root: `storage_path('app/public')` with URL `/storage`, symlinked via `public_path('storage') => storage_path('app/public')`.
  - **Conflict with Requirement R4**: Shared hosting (cPanel) without SSH requires uploads stored directly in `public/uploads` without requiring `storage:link`. Disk root needs to be adjusted or dedicated for cPanel compatibility.

### 1.9. TypeScript Check Diagnostics (`pnpm run types:check`)
- `tsc --noEmit` fails with 25 errors primarily in `resources/js/components/cms/` and `components/shared/app-logo.tsx`:
  - `asChild` property error on Base UI `DialogTrigger`, `DialogClose`, and `SidebarMenuButton`.
  - Button variant `'ghost'`, `'destructive'`, `'secondary'` passed where Neobrutalism `buttonVariants` only permits `'default' | 'noShadow' | 'neutral' | 'reverse'`.
  - Missing Wayfinder action module `@/actions/App/Http/Controllers/Settings/ProfileController` in `delete-user.tsx`.
  - Untyped `auth` on Inertia shared page props.

---

## 2. Logic Chain

1. **State of Repository Baseline**:
   - The repository is in an intermediate state between Phase 0 (cleanup/tooling reorganization) and Phase 1 (foundational backend data layer and landing page).
   - Git status shows starter-kit pages (`resources/js/pages/*`) and settings routes were deleted, creating test failures in the remaining starter-kit tests.

2. **Backend Readiness**:
   - Spatie Media Library and Fortify are installed and their base provider/migration setups are present.
   - However, no portfolio tables, models, enums, seeders, or controllers exist yet.
   - Therefore, the data layer must be built from scratch following `docs/DATABASE.md`.

3. **Frontend Readiness**:
   - UI primitive components (`components/ui/`) and layout skeletons are prepared with Neobrutalism classes.
   - TypeScript contracts for portfolio entities exist in `resources/js/types/portfolio.ts`.
   - However, since `resources/js/pages/` is empty, visiting any web route will fail to render until `welcome.tsx`, `dashboard.tsx`, and `auth/login.tsx` are created.
   - `resources/css/app.css` needs the Neobrutalism CSS tokens from `docs/DESIGN.md` so that utility classes like `bg-main`, `bg-secondary-background`, `shadow-shadow`, and `rounded-base` resolve properly.
   - Missing TipTap dependency will prevent article WYSIWYG implementation in Phase 3 unless installed or substituted.

4. **Testing & QA Readiness**:
   - The test suite is currently broken due to legacy settings tests looking for deleted routes (`routes/settings.php`).
   - Fixing or replacing legacy tests with portfolio tests (per Acceptance Criteria R5) is required to restore green tests.

5. **Storage & Deployment Readiness**:
   - In accordance with R4 and `docs/PRD.md:38-40`, the application must support cPanel shared hosting without symlinks.
   - The filesystem configuration for the media disk must be set to write directly to `public_path('uploads')` so that files are served directly without symlinks.

---

## 3. Caveats

1. **Read-Only Scope**:
   - As an explorer subagent under strictly read-only constraints, no code modifications, file deletions, package installations, or git operations were performed.
2. **Environment File (.env)**:
   - Access to `.env` was prevented by security policy. Database connection details were verified through `config/database.php` default configurations and standard Laravel conventions.
3. **TipTap Package**:
   - TipTap packages (`@tiptap/react`, `@tiptap/starter-kit`) are not in `package.json`. Downstream implementers will need to install them or coordinate with the orchestrator.

---

## 4. Conclusion

The application is properly structured as a Laravel 13 + React 19 + Inertia v3 application with Tailwind v4, Spatie Media Library, and Fortify. Phase 0 component reorganization has laid out the component directories (`cms`, `landing`, `media`, `shared`, `ui`), but the project currently has **no active pages**, **no portfolio database migrations/models/seeders**, **no portfolio controllers**, and has **failing legacy tests** and **TypeScript errors in CMS components**.

### Actionable Implementation Roadmap for Downstream Agents:
1. **Phase 1 Data Layer**:
   - Create enums `CategoryType` and `ArticleStatus` in `app/Enums/`.
   - Create migrations for `profiles`, `categories`, `tags`, `skills`, `projects`, `articles`, `project_category`, `article_category`, `article_tag`, `educations`, `experiences`, `certifications`.
   - Create models with casts, relations, and Spatie `HasMedia` / `InteractsWithMedia` traits.
   - Create `PortfolioDatabaseSeeder` with realistic Fauzan Hanif data.
2. **Phase 1 Landing Page**:
   - Update `resources/css/app.css` with Neobrutalism design tokens (`--main`, `--secondary-background`, `--shadow`, etc.).
   - Build landing sections in `resources/js/components/landing/` (`navbar`, `hero`, `about`, `skills`, `projects`, `experiences`, `educations`, `certifications`, `articles`, `contact`, `footer`).
   - Create `resources/js/pages/welcome.tsx` wired to `HomeController`.
3. **Phase 3 CMS & Auth**:
   - Create `resources/js/pages/auth/login.tsx` using `auth-layout.tsx` and Neobrutalism styling.
   - Create `resources/js/pages/dashboard.tsx` with metrics and quick actions.
   - Install TipTap or rich text editor package for article content.
   - Clean up CMS component TypeScript errors (Base UI `asChild` and button variants).
4. **Phase 4 & 5 Testing, Media & Deployment**:
   - Configure media disk in `config/filesystems.php` to `public_path('uploads')` for cPanel symlink-free hosting.
   - Clean up obsolete settings tests and add comprehensive Pest feature tests in `tests/Feature/`.
   - Export initial schema and seed data to `database/portfolio_dump.sql`.

---

## 5. Verification Method

To independently verify these findings, run the following commands from `c:\laragon\www\fauzanhanif`:

1. **Verify Dependencies**:
   - Inspect composer: `composer show --direct`
   - Inspect npm: `type package.json` (check absence of `@tiptap/react`)
2. **Verify Migrations & Seeders**:
   - `dir database\migrations` (only 4 files present)
   - `dir database\seeders` (only `DatabaseSeeder.php` present)
3. **Verify Models & Controllers**:
   - `dir app\Models` (only `User.php` present)
   - `dir app\Http\Controllers` (only `Controller.php` and `Settings/` present)
4. **Verify Frontend Pages**:
   - `dir resources\js\pages` (empty directory)
5. **Verify TypeScript Errors**:
   - `pnpm run types:check` (exits with code 2 and lists component errors in `app-header.tsx`, `delete-user.tsx`, etc.)
6. **Verify Test Failures**:
   - `vendor/bin/pest` or `php artisan test --compact` (exits with code 1, reporting 1 failure and 7 errors due to deleted settings routes and auth pages)
