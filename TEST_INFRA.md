# Comprehensive E2E Testing Infrastructure Specification (TEST_INFRA)
**Project**: M FAUZAN HANIF Personal Portfolio & CMS  
**Architecture**: Laravel 13 (PHP 8.5) Monolith + React 19 + Inertia.js v3 + Tailwind CSS v4 (Neobrutalism) + Spatie Media Library + Fortify Authentication  
**Author**: E2E Testing Track Orchestrator / Test Lead (`test_writer_e2e_1`)  
**Status**: APPROVED & ACTIVE  

---

## 1. Executive Summary & Quality Strategy

This document establishes the authoritative End-to-End (E2E) testing infrastructure, methodology, and test matrix for the personal portfolio and self-hosted CMS of M FAUZAN HANIF.

The testing strategy follows a rigorous **4-Tier Testing Methodology**:
- **Tier 1 — Feature Coverage**: Minimum of 5 discrete test cases per core feature verifying positive functional behavior, response contracts, and state transitions.
- **Tier 2 — Boundary & Corner Cases**: Minimum of 5 boundary, edge, adversarial, and failure-mode test cases per core feature testing extreme data limits, invalid inputs, unauthenticated access, and injection defense.
- **Tier 3 — Cross-Feature Combinations**: Multi-feature integration tests verifying relational integrity, category polymorphism, lifecycle propagation, and shared state reactivity across modules.
- **Tier 4 — Real-World Workflows**: Full lifecycle user journeys simulating real-world visitor discovery and administrative content publishing operations from initial request to database persistence and cache/view updates.

### Principles & Conventions
1. **Opaque-Box Testing**: Tests verify observable HTTP responses, redirects, Inertia page props, session flashes, and database state transitions without coupling to private internal class implementations.
2. **Progressive Testability**: Tests detect whether a route or module is already registered in the current milestone. Tests for planned future milestones gracefully skip with descriptive metadata and automatically activate once the implementing agent ships the route.
3. **Self-Contained & Independent**: Every test executes within isolated database transactions via `Illuminate\Foundation\Testing\RefreshDatabase` and SQLite in-memory storage (`:memory:`).
4. **Authoritative Expected Output Derivation**: Expected outputs are derived strictly from `PROJECT.md`, `docs/PRD.md`, `docs/DATABASE.md`, and `docs/DESIGN.md`.

---

## 2. Core Feature Inventory & Scope

| Feature ID | Feature Name | Primary Endpoint(s) | Responsible Controller / Service | Milestone |
|---|---|---|---|---|
| **F01** | Landing Page & Public Showcases | `GET /` | `HomeController@index` | M2 |
| **F02** | Public Projects Archive & Detail | `GET /projects`, `GET /projects/{slug}` | `PublicProjectController` | M2 |
| **F03** | Public Articles Archive & Reader | `GET /articles`, `GET /articles/{slug}` | `PublicArticleController` | M2 |
| **F04** | Fortify Authentication & Security | `GET /login`, `POST /login`, `POST /logout` | Fortify `AuthenticatedSessionController` | M3 |
| **F05** | CMS Dashboard & Metrics Overview | `GET /dashboard` | `Admin\DashboardController@index` | M3 |
| **F06** | CMS Profile & Contact CRUD | `GET /admin/profile`, `PUT /admin/profile` | `Admin\ProfileController` | M3 |
| **F07** | CMS Projects CRUD & Categorization | `/admin/projects/*` | `Admin\ProjectController` | M3 |
| **F08** | CMS Articles CRUD & TipTap WYSIWYG | `/admin/articles/*` | `Admin\ArticleController` | M3 |
| **F09** | CMS Skills Management | `/admin/skills/*` | `Admin\SkillController` | M3 |
| **F10** | CMS Timelines & Certifications | `/admin/educations/*`, `/admin/experiences/*`, `/admin/certifications/*` | `Admin\EducationController`, `ExperienceController`, `CertificationController` | M3 |
| **F11** | CMS Categories & Tags Management | `/admin/categories/*`, `/admin/tags/*` | `Admin\CategoryController`, `Admin\TagController` | M3 |
| **F12** | Media Upload & Symlink-Free Disk | `POST /admin/media/upload`, direct public disk | Spatie Media Library / FileSystem config | M4 |

---

## 3. Tier 1: Feature Coverage (>= 5 Cases per Feature)

### Feature F01: Landing Page & Public Showcases (`GET /`)
- **F01-T1-01 (Happy Path Status)**: `GET /` as guest returns HTTP 200 with Inertia component `welcome`.
- **F01-T1-02 (Portfolio Props Contract)**: `GET /` provides root Inertia props `profile`, `skills`, `experiences`, `educations`, `certifications`, `featuredProjects`, and `featuredArticles`.
- **F01-T1-03 (Featured Projects Cap)**: When 10 featured projects exist in database, `featuredProjects` prop contains exactly 3 items ordered by `id` or `created_at` desc.
- **F01-T1-04 (Featured Articles Status Filter)**: Only articles with status `published` and `is_featured = true` appear in `featuredArticles` prop; `draft` articles are excluded.
- **F01-T1-05 (Categorized Skills Grouping)**: Skills prop returns collection containing items categorized into Backend, Frontend, and Tools.

### Feature F02: Public Projects Archive & Detail (`GET /projects`)
- **F02-T1-01 (Catalog Render)**: `GET /projects` returns HTTP 200 with Inertia component `projects`.
- **F02-T1-02 (Category Filter Query)**: `GET /projects?category=web-development` returns only projects associated with the specified category slug.
- **F02-T1-03 (Tech Stack Props)**: Each project item in `projects` prop supplies `tech_stack` array parsed from JSON.
- **F02-T1-04 (Project Category Eager Loading)**: Projects collection eagerly loads related `categories` without causing N+1 query loops.
- **F02-T1-05 (Single Project Reader/Modal)**: `GET /projects/{slug}` with valid slug returns HTTP 200 and passes selected project model with categories and demo URL.

### Feature F03: Public Articles Archive & Reader (`GET /articles`)
- **F03-T1-01 (Archive Render)**: `GET /articles` returns HTTP 200 with Inertia component `articles`.
- **F03-T1-02 (Keyword Search Query)**: `GET /articles?search=Laravel` returns published articles matching "Laravel" in title or excerpt.
- **F03-T1-03 (Draft Concealment)**: Articles with status `draft` never appear in `articles` prop regardless of query parameters.
- **F03-T1-04 (Article Reader Route)**: `GET /articles/{slug}` for a published article returns HTTP 200 and loads `articles/show` component.
- **F03-T1-05 (Article Relational Metadata)**: Single article response includes eager-loaded `categories` and `tags` pivot relationships and raw WYSIWYG `content`.

### Feature F04: Fortify Authentication & Security (`/login`, `/logout`)
- **F04-T1-01 (Login Form Render)**: `GET /login` as guest returns HTTP 200 with Inertia component `auth/login`.
- **F04-T1-02 (Valid Admin Login)**: `POST /login` with `fauzanhanif2112@gmail.com` and correct password authenticates session and redirects to `/dashboard`.
- **F04-T1-03 (Invalid Password Rejection)**: `POST /login` with wrong password fails authentication, redirects back to `/login`, and returns validation errors.
- **F04-T1-04 (Guest Redirection from Dashboard)**: Unauthenticated `GET /dashboard` is redirected to `/login` with HTTP 302.
- **F04-T1-05 (Secure Logout)**: Authenticated `POST /logout` invalidates user session, flushes auth token, and redirects to `/` with guest status.

### Feature F05: CMS Dashboard & Metrics Overview (`GET /dashboard`)
- **F05-T1-01 (Admin Dashboard Access)**: Authenticated admin `GET /dashboard` returns HTTP 200 and renders `dashboard` component.
- **F05-T1-02 (Metric Counters Contract)**: Dashboard response supplies `metrics` prop containing counts for total projects, total articles, draft articles, skills, and certifications.
- **F05-T1-03 (Ratio Calculation Accuracy)**: Metric counter accurately calculates published vs draft article count matching database records.
- **F05-T1-04 (Shared Auth User Props)**: Inertia shared props include authenticated user's name and email for topbar avatar display.
- **F05-T1-05 (Quick Actions Links)**: Dashboard props supply navigation links for creating article, adding project, and editing profile.

### Feature F06: CMS Profile & Contact CRUD (`/admin/profile`)
- **F06-T1-01 (Profile Form Render)**: `GET /admin/profile` returns HTTP 200 with existing profile details.
- **F06-T1-02 (Profile Information Update)**: `PUT /admin/profile` updates headline, bio text, and email, redirecting back with success toast.
- **F06-T1-03 (Social Links JSON Persistence)**: `PUT /admin/profile` accepts JSON array of social platforms (GitHub, LinkedIn) and persists properly in database.
- **F06-T1-04 (Avatar Media Upload)**: `POST /admin/profile/avatar` with valid JPG/PNG image associates media with profile model via Spatie Media Library.
- **F06-T1-05 (Flash Notification Contract)**: Profile update sets `session('toast') = ['type' => 'success', 'message' => 'Profile updated successfully']`.

### Feature F07: CMS Projects Management (`/admin/projects`)
- **F07-T1-01 (Projects Table Index)**: `GET /admin/projects` returns HTTP 200 with paginated list of all projects.
- **F07-T1-02 (Project Creation)**: `POST /admin/projects` with title, slug, description, tech stack, and category IDs creates record and redirects with 302.
- **F07-T1-03 (Tech Stack JSON Storage)**: Validates that array of tech tags `['Laravel', 'React', 'Tailwind']` is stored as valid JSON.
- **F07-T1-04 (Project Update)**: `PUT /admin/projects/{id}` modifies title, featured toggle, and updates category pivot records.
- **F07-T1-05 (Project Deletion)**: `DELETE /admin/projects/{id}` removes project and detaches pivot relationships cleanly.

### Feature F08: CMS Articles Management (`/admin/articles`)
- **F08-T1-01 (Articles Table Index)**: `GET /admin/articles` returns list containing both draft and published articles with category and tag labels.
- **F08-T1-02 (Article Creation with TipTap HTML)**: `POST /admin/articles` creates article with longtext HTML content, excerpt, and draft status.
- **F08-T1-03 (Status Toggle)**: `PATCH /admin/articles/{id}/status` toggles status between `draft` and `published` and sets `published_at` timestamp.
- **F08-T1-04 (Article Category & Tag Attachment)**: `PUT /admin/articles/{id}` synchronizes `article_category` and `article_tag` pivot records.
- **F08-T1-05 (Article Deletion)**: `DELETE /admin/articles/{id}` deletes record and removes pivot connections.

### Feature F09: CMS Skills Management (`/admin/skills`)
- **F09-T1-01 (Skills List Index)**: `GET /admin/skills` lists all skills ordered by category.
- **F09-T1-02 (Skill Creation)**: `POST /admin/skills` creates skill with name, category (Backend/Frontend/Tools), proficiency level, and icon.
- **F09-T1-03 (Featured Skill Toggle)**: `PATCH /admin/skills/{id}/featured` updates `is_featured` boolean flag.
- **F09-T1-04 (Skill Update)**: `PUT /admin/skills/{id}` updates proficiency rating and category.
- **F09-T1-05 (Skill Deletion)**: `DELETE /admin/skills/{id}` deletes skill record and removes it from landing page props.

### Feature F10: CMS Timelines & Certifications (`/admin/educations`, `/admin/experiences`, `/admin/certifications`)
- **F10-T1-01 (Education CRUD)**: `POST /admin/educations` creates educational history record with institution, degree, start_year, and end_year.
- **F10-T1-02 (Experience CRUD)**: `POST /admin/experiences` creates work record with company, position, start_date, end_date, and description.
- **F10-T1-03 (Certification CRUD)**: `POST /admin/certifications` creates certificate record with title, issuer, issue_date, and credential_url.
- **F10-T1-04 (Chronological Sorting)**: Experiences and Educations endpoints return records sorted in descending chronological order.
- **F10-T1-05 (Credential Verification URL Link)**: Public endpoints render valid external URL links for verifying certifications.

### Feature F11: CMS Categories & Tags Management (`/admin/categories`, `/admin/tags`)
- **F11-T1-01 (Category Creation with Type Enum)**: `POST /admin/categories` creates category with required `type` (`article` or `project`).
- **F11-T1-02 (Category Filter by Type)**: `GET /admin/categories?type=project` returns only categories with `type = 'project'`.
- **F11-T1-03 (Tag Creation for Articles)**: `POST /admin/tags` creates keyword tag with unique name and slug.
- **F11-T1-04 (Tag Usage Counter)**: Tag listing displays count of articles currently attached to each tag.
- **F11-T1-05 (Safe Category Deletion)**: Deleting a category detaches pivot records without deleting associated articles or projects.

### Feature F12: Media Management & Shared Hosting Readiness
- **F12-T1-01 (Public Disk Storage Path)**: Uploaded media writes directly to `public/uploads` without requiring `storage:link` symlinks.
- **F12-T1-02 (Public Asset URL Structure)**: Generated media URL matches `/uploads/{media_id}/{file_name}` format.
- **F12-T1-03 (Direct File Deletion)**: Deleting an Eloquent model with media removes physical file from `public/uploads/{id}/`.
- **F12-T1-04 (MIME Type Validation)**: Rejects unsupported file uploads (e.g., `.exe`, `.sh`) with HTTP 422.
- **F12-T1-05 (SQL Dump Export Integrity)**: `database/portfolio_dump.sql` exists and contains valid MySQL CREATE TABLE and INSERT statements.

---

## 4. Tier 2: Boundary & Corner Cases (>= 5 Cases per Feature)

### Feature F01: Landing Page Boundaries
- **F01-T2-01 (Empty Database Graceful Degradation)**: When database has 0 projects, 0 articles, and 0 skills, `GET /` returns HTTP 200 without PHP errors, supplying empty arrays.
- **F01-T2-02 (Missing Profile Fallback)**: When `profiles` table is empty, landing page supplies default fallback values for name, headline, and placeholder avatar.
- **F01-T2-03 (Large Unicode Bio Text)**: Profile bio containing emojis (`🚀💻`), Japanese characters (`こんにちは`), and 5000+ characters renders without JSON truncation.
- **F01-T2-04 (Zero Featured Items)**: When database contains 20 projects but none have `is_featured = true`, `featuredProjects` prop is empty array `[]` without error.
- **F01-T2-05 (Strict Draft Isolation)**: Even if all articles are marked `is_featured = true`, any article with `status = draft` is omitted from `GET /`.

### Feature F02: Public Projects Boundaries
- **F02-T2-01 (Non-Existent Category Filter)**: `GET /projects?category=invalid-non-existent-uuid-999` returns empty list with HTTP 200 (not 500).
- **F02-T2-02 (Special Characters in Tech Stack)**: Tech stack array containing symbols (`C#`, `C++`, `.NET Core 8.0`, `Node.js`) parses safely in JSON.
- **F02-T2-03 (Non-Existent Project Slug)**: `GET /projects/unknown-phantom-project-slug` returns HTTP 404 Not Found.
- **F02-T2-04 (XSS in Project Description)**: Project description with `<script>alert(1)</script>` is safely escaped and does not execute script in props.
- **F02-T2-05 (Maximum Pagination Limit)**: Extreme `page` query (`GET /projects?page=999999`) returns empty page collection without error.

### Feature F03: Public Articles Boundaries
- **F03-T2-01 (Draft Slug Access Restriction)**: `GET /articles/{draft-slug}` returns HTTP 404 to guests (drafts cannot be viewed publicly by URL guessing).
- **F03-T2-02 (SQL Injection in Search Query)**: `GET /articles?search=' OR 1=1 --` sanitizes input, searches literally, and does not dump database.
- **F03-T2-03 (Deeply Nested TipTap HTML)**: Article content containing deeply nested HTML elements (`<table><tr><td><code>...</code></td></tr></table>`) preserves valid HTML structure.
- **F03-T2-04 (Empty Search Query)**: `GET /articles?search=` returns all published articles without error.
- **F03-T2-05 (Duplicate Slugs Prevention)**: Attempting to query article with duplicate slug matches exact active published model.

### Feature F04: Fortify Authentication Boundaries
- **F04-T2-01 (Brute-Force Rate Limiting Throttling)**: After 5 failed consecutive login attempts for an email/IP, subsequent requests return HTTP 429 Too Many Requests.
- **F04-T2-02 (SQL Injection in Email Field)**: POST `/login` with `admin' OR '1'='1` fails validation with 422/302 and prevents authentication bypass.
- **F04-T2-03 (Whitespace in Email)**: Email submitted with leading/trailing spaces (` fauzanhanif2112@gmail.com `) is trimmed or sanitized according to Fortify configuration.
- **F04-T2-04 (Empty Credentials Submission)**: POST `/login` with empty strings returns specific session validation errors for both fields.
- **F04-T2-05 (Session Fixation Defense)**: User session ID is regenerated upon successful login to prevent session hijacking.

### Feature F05: CMS Dashboard Boundaries
- **F05-T2-01 (Guest Tampering with Dashboard URL)**: Guest attempting to access `/dashboard?admin=true` is strictly redirected to `/login`.
- **F05-T2-02 (Zero Metrics Representation)**: When database is blank, metric counters return `0` instead of `null` or NaN.
- **F05-T2-03 (Division by Zero in Published Ratio)**: When total articles is 0, published-to-draft ratio calculates cleanly as 0% without division-by-zero fatal error.
- **F05-T2-04 (Stale Session Expiration)**: Expired admin session visiting `/dashboard` triggers re-authentication redirect without server crash.
- **F05-T2-05 (Malformed Header Injection)**: Requests with spoofed `X-Forwarded-For` or modified headers cannot bypass auth middleware.

### Feature F06: CMS Profile Boundaries
- **F06-T2-01 (Oversized Bio Payload)**: Bio submitted with 65,000 characters is rejected by validation or cleanly stored in text column without database overflow.
- **F06-T2-02 (Invalid Social URL Format)**: Submitting non-URL strings for LinkedIn or GitHub triggers inline validation error.
- **F06-T2-03 (Corrupted Social JSON)**: Submitting malformed JSON in social field is intercepted before saving to database.
- **F06-T2-04 (Non-Image File as Avatar)**: Uploading a `.pdf` or `.php` file as avatar returns HTTP 422 with validation error.
- **F06-T2-05 (Avatar File Size Limit)**: Image file exceeding 5MB is rejected with file size validation error.

### Feature F07: CMS Projects Boundaries
- **F07-T2-01 (Duplicate Project Slug Collision)**: Submitting a project with an already existing slug returns validation error requiring unique slug.
- **F07-T2-02 (Missing Required Fields)**: POST `/admin/projects` with null title or empty description returns 422 with field errors.
- **F07-T2-03 (Invalid Category Association)**: Attempting to attach category of `type = article` to a project is rejected by category type validator.
- **F07-T2-04 (Malformed Demo URL)**: Entering `javascript:alert(1)` as `project_url` fails URL validation.
- **F07-T2-05 (Empty Tech Stack Array)**: Project created without tech stack defaults to empty JSON array `[]` rather than null.

### Feature F08: CMS Articles Boundaries
- **F08-T2-01 (XSS Vector in WYSIWYG Content)**: HTML containing `<script>` or `<iframe onload="...">` is sanitized or safely contained.
- **F08-T2-02 (Empty Article Title / Slug)**: Creating article without title or slug triggers 422 validation response.
- **F08-T2-03 (Article Attachment of Project Category)**: Attempting to associate category with `type = project` to an article is prevented.
- **F08-T2-04 (Future Publication Date)**: Article with `published_at` in the future remains hidden from public archive until date arrives.
- **F08-T2-05 (Extremely Large Article HTML)**: Article containing 500KB of rich HTML content stores and retrieves without truncation.

### Feature F09: CMS Skills Boundaries
- **F09-T2-01 (Invalid Skill Category Enum)**: Skill submitted with category `DevOps` (when allowed are Backend, Frontend, Tools) triggers validation error.
- **F09-T2-02 (Proficiency Level Out of Bounds)**: Proficiency level submitted as `150` or `-10` (valid range 1-100) triggers validation error.
- **F09-T2-03 (Special Characters in Skill Name)**: Skill named `Node.js / Express (ES6+)` saves and displays correctly.
- **F09-T2-04 (Empty Icon Identifier)**: Skill created without icon uses fallback default badge icon.
- **F09-T2-05 (Bulk Deletion Boundary)**: Deleting the last skill in a category leaves category empty without crashing group queries.

### Feature F10: CMS Timelines & Certifications Boundaries
- **F10-T2-01 (Inverted Academic Years)**: Education with `start_year = 2024` and `end_year = 2020` fails chronological validation.
- **F10-T2-02 (Future Employment Dates)**: Experience with start date in future validates according to business rule.
- **F10-T2-03 (Expired Certification Status)**: Expired certification displays expiration date without crashing timeline.
- **F10-T2-04 (Broken External Credential URL)**: Non-HTTP URL for certification link fails validation.
- **F10-T2-05 (Present Employment with Null End Date)**: Active job with `end_date = null` renders as "Present" / "Sekarang" correctly.

### Feature F11: CMS Categories & Tags Boundaries
- **F11-T2-01 (Invalid Category Type Enum)**: Category created with `type = 'tutorial'` fails enum validation (only `article` or `project` allowed).
- **F11-T2-02 (Duplicate Tag Slug)**: Creating tag with existing slug returns validation error.
- **F11-T2-03 (Special Character Tag Slugs)**: Tag named `CI/CD & DevOps` generates clean URL-safe slug `ci-cd-devops`.
- **F11-T2-04 (Orphan Pivot Cleanup)**: Deleting a tag cleanly detaches all `article_tag` pivot records without foreign key restraint error.
- **F11-T2-05 (Case-Insensitive Tag Uniqueness)**: Tags `Laravel` and `laravel` are flagged as duplicate.

### Feature F12: Media Management Boundaries
- **F12-T2-01 (Missing Directory Auto-Creation)**: If `public/uploads` directory does not exist, upload automatically creates directory with write permissions.
- **F12-T2-02 (Corrupted Image Header)**: Uploading a text file renamed to `.png` fails MIME-type inspection.
- **F12-T2-03 (Path Traversal in File Name)**: File upload with name `../../etc/passwd.png` is sanitized to safe random/sanitized filename.
- **F12-T2-04 (Multiple Uploads on Same Model)**: Uploading new cover image replaces or appends to collection according to single-file configuration.
- **F12-T2-05 (Disk Full or Write Error Handling)**: Graceful error response when disk write operation fails.

---

## 5. Tier 3: Cross-Feature Combinations

### Scenario X01: Category Polymorphism & Cross-Type Enforcement
- **Components**: `Category` (`type`), `Project`, `Article`, `project_category` pivot, `article_category` pivot.
- **Flow**:
  1. Create Category A with `type = 'article'`.
  2. Create Category B with `type = 'project'`.
  3. Create an Article and attempt to attach Category B (Project) -> System rejects or filters out Category B.
  4. Attach Category A to Article -> Successful attachment.
  5. Create a Project and attempt to attach Category A (Article) -> System rejects or filters out Category A.
  6. Attach Category B to Project -> Successful attachment.
  7. Verify `/projects` filter only lists Category B; `/articles` filter only lists Category A.

### Scenario X02: Media Attachment & Cascading Model Cleanup
- **Components**: `Project`, `Media` (Spatie), `public/uploads/` disk.
- **Flow**:
  1. Admin uploads cover image `project-mockup.png` when creating Project X.
  2. Verify file exists in `public/uploads/{media_id}/project-mockup.png`.
  3. Guest visits `/` and `/projects` -> Verify project cover URL points to direct public path and returns HTTP 200 image.
  4. Admin deletes Project X via `/admin/projects/{id}`.
  5. Verify Project X record removed from database.
  6. Verify associated media record and physical file in `public/uploads/{media_id}` are removed.

### Scenario X03: Article Draft-to-Publish Lifecycle & Public Reflection
- **Components**: `Article`, `Admin\ArticleController`, `HomeController`, `PublicArticleController`.
- **Flow**:
  1. Admin authors article "Neobrutalism in React 19" with TipTap HTML and sets status to `draft`, `is_featured = true`.
  2. Guest visits `/` (Landing Page) -> Article is NOT present in `featuredArticles`.
  3. Guest visits `/articles` -> Article is NOT present in archive.
  4. Guest requests `/articles/neobrutalism-in-react-19` directly -> HTTP 404 returned.
  5. Admin updates status to `published` via CMS.
  6. Guest visits `/` -> Article is now present in `featuredArticles`.
  7. Guest visits `/articles` -> Article is visible in list.
  8. Guest requests `/articles/neobrutalism-in-react-19` -> HTTP 200 returned with rendered HTML content.

### Scenario X04: Profile Bio Update & Instant Landing Page Reflection
- **Components**: `Profile`, `Admin\ProfileController`, `HomeController`, `welcome.tsx`.
- **Flow**:
  1. Admin logs into CMS and updates headline to "Senior Full-Stack Architect" and adds GitHub URL.
  2. Admin submits form -> Session flash toast receives success message.
  3. Guest makes fresh request to `GET /`.
  4. Landing page Inertia props contain updated headline and social links immediately.

### Scenario X05: Tag Deletion Cascade & Article Integrity
- **Components**: `Tag`, `Article`, `article_tag` pivot.
- **Flow**:
  1. Tag "PestPHP" is created and attached to Article 1 and Article 2.
  2. Verify Article 1 has 1 tag.
  3. Admin deletes Tag "PestPHP" from CMS.
  4. Verify Tag record deleted and `article_tag` pivot rows removed.
  5. Verify Article 1 and Article 2 remain intact and published.

### Scenario X06: Featured Projects Cap & Priority
- **Components**: `Project`, `HomeController`.
- **Flow**:
  1. Seed 5 projects with `is_featured = true`.
  2. Guest requests `GET /`.
  3. `featuredProjects` prop contains strictly 3 items (`.take(3)` rule).
  4. Guest visits `GET /projects` -> All 5 projects are visible in full catalog.

### Scenario X07: CMS Flash Session & Toast UI Bridge
- **Components**: `Admin Controller`, `HandleInertiaRequests`, `Sonner Toast`.
- **Flow**:
  1. Admin performs any write action (e.g., creates skill).
  2. Backend sets `session()->flash('toast', ['type' => 'success', 'message' => 'Skill created'])`.
  3. Inertia shares flash data through `HandleInertiaRequests`.
  4. Subsequent page visit consumes flash message and clears session flash.

### Scenario X08: Guest Authorization Barrier Across All Admin Routes
- **Components**: Fortify auth guard, `Route::middleware(['auth'])`.
- **Flow**:
  1. Guest attempts direct GET, POST, PUT, DELETE requests across `/dashboard`, `/admin/profile`, `/admin/projects`, `/admin/articles`, `/admin/skills`, `/admin/educations`, `/admin/experiences`, `/admin/certifications`, `/admin/categories`, `/admin/tags`.
  2. Every request is redirected to `/login` (or rejected with 401/302).
  3. No administrative state change occurs.

---

## 6. Tier 4: Real-World Workflows

### Workflow W01: Recruiter / Client Discovery Journey
- **Persona**: Tech Recruiter exploring Fauzan's portfolio.
- **Steps**:
  1. **Landing Page Arrival**: Recruiter navigates to `GET /`.
  2. **Hero & Identity Verification**: Inspects profile photo, full name "M FAUZAN HANIF", headline, and about bio.
  3. **Skills Evaluation**: Scrolls to Categorized Skills Grid; reviews Backend (Laravel, MySQL), Frontend (React, Inertia, Tailwind), and Tools.
  4. **Featured Projects Exploration**: Reviews top 3 featured projects; clicks "View All Projects" navigating to `GET /projects`.
  5. **Project Filtering**: Filters projects by category "Web Application"; clicks project link to view live demo URL.
  6. **Experience & Education Review**: Returns to landing page; inspects chronological work experiences and educational degrees.
  7. **Credential Verification**: Clicks external certification credential link; opens verification URL.
  8. **Article Reading**: Clicks featured article; navigates to `GET /articles/{slug}`; reads formatted technical article.
  9. **Contact Outreach**: Clicks contact email mailto button and LinkedIn profile link.

### Workflow W02: Admin Technical Article Authoring & Publishing
- **Persona**: Fauzan (Admin/Owner) publishing a new tutorial.
- **Steps**:
  1. **Authentication**: Navigates to `/login`, enters email `fauzanhanif2112@gmail.com` and password, redirects to `/dashboard`.
  2. **Category & Tag Setup**: Navigates to `/admin/categories`, creates category "Architecture" (`type = 'article'`); navigates to `/admin/tags`, creates tags "Laravel 13", "Inertia v3".
  3. **Article Drafting**: Navigates to `/admin/articles/create`; inputs title "Building Symlink-Free Laravel Monoliths"; selects category and tags; writes rich HTML in TipTap editor; uploads cover image; saves as `draft`.
  4. **Draft Verification**: Confirms article appears in CMS table with badge "Draft"; verifies public archive `GET /articles` does NOT show the draft.
  5. **Publication**: Edits article, toggles status to `published`, saves.
  6. **Public Proof Verification**: Logs out; visits `/articles`; verifies new article is listed; opens `/articles/building-symlink-free-laravel-monoliths`; verifies rich HTML, category badge, and tags are beautifully rendered.

### Workflow W03: Admin Project Showcase Addition
- **Persona**: Fauzan adding a new client project.
- **Steps**:
  1. **Admin Login**: Authenticates at `/login`.
  2. **Project Entry**: Navigates to `/admin/projects/create`; inputs title, slug, description, tech stack tags (`['Laravel 13', 'React 19', 'Tailwind v4']`), demo URL, and selects project category.
  3. **Media Upload**: Uploads project screenshot via Spatie media handler directly into `public/uploads`.
  4. **Featured Promotion**: Sets `is_featured = true`.
  5. **Persistence Check**: Verifies project saved in database and appears on CMS project table.
  6. **Public Reflection**: Visits `/` and `/projects`; verifies project image loads from `/uploads/...` without symlink errors.

### Workflow W04: Career Profile & Resume Refresh
- **Persona**: Fauzan updating career achievements.
- **Steps**:
  1. **Admin Login**: Authenticates at `/login`.
  2. **Profile Edit**: Navigates to `/admin/profile`; updates bio and headline; updates social links JSON.
  3. **Skill Additions**: Navigates to `/admin/skills`; adds new skill "TypeScript 5" under Frontend with proficiency 90.
  4. **Timeline Entry**: Navigates to `/admin/experiences`; adds latest role with company, start date, and description.
  5. **Public Inspection**: Navigates to `/`; verifies new headline, new skill, and new work experience appear in chronological sequence.

### Workflow W05: Adversarial Intrusion & Security Boundary Audit
- **Persona**: Malicious actor attempting to breach portfolio CMS.
- **Steps**:
  1. **Direct Admin Access Probe**: Guest attempts direct GET requests to `/dashboard`, `/admin/profile`, `/admin/projects`, `/admin/articles` -> Verified all redirect to `/login`.
  2. **Unauthenticated Write Exploit**: Guest sends POST to `/admin/projects` with fake project data -> Verified rejected without database change.
  3. **Brute-Force Login Attack**: Attacker scripts rapid POST requests to `/login` with random passwords -> Verified rate limiter activates on 6th attempt returning HTTP 429 Too Many Requests.
  4. **SQL Injection Probing**: Attacker submits SQL injection payloads (`' OR 1=1 --`) in search query and login inputs -> Verified safely handled without SQL syntax error or unauthorized data dump.
  5. **Draft Article Enumeration**: Attacker attempts to guess draft article slug `/articles/top-secret-draft` -> Verified returns HTTP 404.

---

## 7. Test Execution & Automation Guide

### Test Runner & Framework
- Framework: **Pest PHP** (built on PHPUnit 11, PHP 8.5, Laravel 13).
- Runner: `php artisan test` or `vendor/bin/pest`.

### Key Execution Commands
```bash
# Run complete test suite (compact mode)
php artisan test --compact

# Run single test file
php artisan test tests/Feature/HomeTest.php
php artisan test tests/Feature/AuthTest.php
php artisan test tests/Feature/PublicRoutesTest.php
php artisan test tests/Feature/CmsAuthorizationTest.php

# Filter by test name
php artisan test --filter="landing page"
php artisan test --filter="login"
```

### Progressive Testability Rules
When writing tests for features whose routes or controllers are planned for subsequent milestones (M2, M3, M4):
1. Test dynamically detects if route or controller action is registered.
2. If route is not yet defined, the test marks itself skipped via `$this->markTestSkipped('Route [...] is pending Milestone M... implementation.')`.
3. As soon as the feature is implemented, the exact same test activates automatically without requiring test modifications.
4. Existing tests must never fail or block CI.

---

## 8. Expected Output Derivation & Verification Oracles

| Feature / Action | Authoritative Specification Source | Expected Output Oracle |
|---|---|---|
| `GET /` | `PROJECT.md` § 1, `docs/PRD.md` § 5 | HTTP 200, Inertia component `welcome`, single round-trip props matching `PortfolioHomeProps`. |
| `POST /login` | `PROJECT.md` § 4, `docs/PRD.md` § 3 | Valid credentials -> Session authenticated, 302 redirect to `/dashboard`. Invalid -> Guest, session errors, redirect to `/login`. |
| `GET /dashboard` | `PROJECT.md` § 4, `docs/PRD.md` § 3 | Authenticated -> HTTP 200, component `dashboard`. Guest -> HTTP 302 redirect to `/login`. |
| `POST /admin/projects` | `PROJECT.md` § 2, `docs/DATABASE.md` | Valid data -> Record created in `projects` table, categories attached in `project_category`, redirect back with toast flash. |
| `GET /articles/{slug}` | `PROJECT.md` § 1, `docs/PRD.md` § 3 | Published -> HTTP 200, component `articles/show`, HTML `content` intact. Draft -> HTTP 404 for guests. |
| Media Upload | `PROJECT.md` § 3, `ORIGINAL_REQUEST.md` R4 | File stored on disk `public` in `public/uploads/{id}/{name}` directly without symlink. |

---

## 9. Defect Escalation Protocol

When an implementation bug is discovered during test execution:
1. **Never modify implementation code**: As Test Writer / QA, modify test code only.
2. **Escalate immediately**: Document reproduction steps, expected vs actual behavior, and affected file paths.
3. **Report format**:
   ```markdown
   ### Implementation Defect Report
   - **Severity**: Critical / High / Medium / Low
   - **Feature ID**: [e.g., F03]
   - **Endpoint**: [e.g., GET /articles/{slug}]
   - **Expected**: [e.g., Draft article returns 404 to guest]
   - **Actual**: [e.g., Draft article returns 200]
   - **Reproduction Command**: `php artisan test --filter="draft_concealment"`
   - **Assignee**: Backend Agent (M1/M2/M3)
   ```
