# Handoff Report: Challenger 1 — Milestone 2 (Landing Page & Public Showcases)

**Author:** Challenger 1 (Milestone 2)  
**Working Directory:** `c:\laragon\www\fauzanhanif\.agents\teamwork\challenger_m2_1`  
**Recipient:** Orchestrator (`7d09acd8-1630-4847-91fb-6a87e5315659`)  
**Status:** Hard Handoff (Completed)  
**Verdict:** **APPROVE**

---

## 1. Observation

1. **Mandatory Documentation & Source Files Inspected**:
   - `c:\laragon\www\fauzanhanif\.agents\teamwork\ORIGINAL_REQUEST.md`: Section R2 specifies landing page, public showcase routes (`/projects`, `/articles`, `/articles/{slug}`), eager-loading contract, and Neobrutalism UI requirements.
   - `c:\laragon\www\fauzanhanif\PROJECT.md:74-95`: Contract definition for `PortfolioHomeProps`:
     ```ts
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
   - `c:\laragon\www\fauzanhanif\routes\web.php:18-24`:
     ```php
     Route::get('/', [HomeController::class, 'index'])->name('home');
     Route::get('/projects', [PublicProjectController::class, 'index'])->name('projects.index');
     Route::get('/projects/{slug}', [PublicProjectController::class, 'show'])->name('projects.show');
     Route::get('/articles', [PublicArticleController::class, 'index'])->name('articles.index');
     Route::get('/articles/{slug}', [PublicArticleController::class, 'show'])->name('articles.show');
     ```
   - `app/Http/Controllers/HomeController.php:30-86`: Renders `welcome` with all 7 keys. Provides fallback `Profile` model with default values when `Profile::query()->first()` returns null. Queries `Skill`, `Experience`, `Education`, and `Certification` with defined ordering. Chains `->take(3)` on `featuredProjects` (with `categories`) and `featuredArticles` (with `categories`, `tags`, and `published()`).
   - `app/Http/Controllers/PublicProjectController.php:18-69`: Handles `index()` with query string `?category={slug}` via `whereHas('categories')`, and `show($slug)` using `Project::where('slug', $slug)->firstOrFail()`.
   - `app/Http/Controllers/PublicArticleController.php:19-75`: Scopes `index()` strictly to `published()`, filters keyword search across `title`, `excerpt`, and `content`. `show($slug)` binds `Article::published()->where('slug', $slug)->firstOrFail()`.

2. **Empirical Test Suite Execution (`tests/Feature/Milestone2PublicEndpointsTest.php`)**:
   Authored 20 adversarial tests covering:
   - Contract compliance for `PortfolioHomeProps` (all 7 keys verified) on empty and populated databases.
   - Limit checks: `featuredProjects` strictly capped at 3, `featuredArticles` strictly capped at 3.
   - Draft article exclusion: featured drafts excluded from `welcome`, draft articles excluded from `/articles` search, and querying draft slug in `/articles/{slug}` yields HTTP 404.
   - Project category filtering via `?category={slug}` and invalid category handling.
   - Article keyword search via `?search={term}` matching title, excerpt, and content.
   - Detail route 200 OK and non-existent slug 404 Not Found for both projects and articles.
   - Adversarial inputs: SQL injection payloads (`' OR 1=1 --`), wildcard queries (`%`), and whitespace inputs executed safely without unhandled 500 exceptions.
   - Database seeder end-to-end integration: `PortfolioDatabaseSeeder` loaded all endpoints successfully.

3. **Compact Test Suite Output**:
   Running `php artisan test --compact` yielded:
   ```json
   {"tool":"pest","result":"passed","tests":91,"passed":77,"assertions":621,"duration_ms":3799,"skipped":14}
   ```
   All 77 active tests passed with 621 assertions, 0 errors, 0 failures, and 14 skipped tests (CMS admin tests pending Milestone 3).

---

## 2. Logic Chain

1. **Landing Page Contract Verification (Observation 1 & 2)**:
   - `HomeController@index` queries and serializes all 7 keys defined in `PortfolioHomeProps`: `profile`, `skills`, `experiences`, `educations`, `certifications`, `featuredProjects`, and `featuredArticles`.
   - In `Milestone2PublicEndpointsTest`, when tested against an empty database, the fallback profile is generated with `name = 'M FAUZAN HANIF'` and empty collections for the remaining 6 keys, returning HTTP 200 without throwing null pointer exceptions.
   - When tested against a database with 5 featured projects and 4 featured articles, the collections returned on `/` were exactly 3 items each, confirming `.take(3)` is active.
   - When tested with a draft article flagged `is_featured = true`, `scopePublished()` in `HomeController` prevented it from being sent to `welcome`.

2. **Public Projects & Category Filtering Verification (Observation 1 & 2)**:
   - `PublicProjectController@index` inspects `$request->query('category')`. If provided, it filters using `$projectsQuery->whereHas('categories', ...)`.
   - Empirical test confirmed that `GET /projects?category=mobile` returns only projects attached to that category slug.
   - An unknown category returns 0 projects while retaining the filter slug in `selectedCategory`.
   - Empty or whitespace category string is sanitized and treated as null, returning all projects.
   - `GET /projects/{slug}` returns 200 for existing projects and HTTP 404 for non-existent slugs via `firstOrFail()`.

3. **Public Articles, Search Filtering & Draft Protection Verification (Observation 1 & 2)**:
   - `PublicArticleController@index` enforces `->published()` unconditionally on all queries.
   - Empirical test confirmed that draft articles never appear in `/articles`, even when `?search=` directly queries keywords present inside the draft's title or content.
   - Keyword search correctly matches against `title`, `excerpt`, or `content`.
   - `PublicArticleController@show` enforces `Article::published()->where('slug', $slug)->firstOrFail()`. When a draft article's slug is requested, Eloquent throws `ModelNotFoundException`, resulting in an HTTP 404 Not Found response. Non-existent slugs similarly return 404.

4. **Security & Input Sanitization (Observation 2)**:
   - Passing SQL injection payloads (`' OR '1'='1`, `1; DROP TABLE projects; --`) and SQL LIKE wildcards (`%`) into `?category=` and `?search=` caused no SQL syntax errors or database crashes, confirming Eloquent parameter binding and query escaping protect the application.

5. **Overall Assessment**:
   - The implementation satisfies all 6 requirements of Milestone 2 without regressions.

---

## 3. Caveats

- **No Caveats**: All Milestone 2 requirements have been empirically verified.
- **CMS Admin Tests**: 14 tests remain skipped in the test suite (`CmsAuthorizationTest`, etc.); these are explicitly scheduled for Milestone 3 (Admin Auth & CMS Dashboard) per `PROJECT.md`.

---

## 4. Conclusion

**Verdict: APPROVE**

The Milestone 2 implementation for Landing Page & Public Showcases meets all functional, contractual, and security specifications:
- `GET /` returns 200 OK, renders Inertia component `welcome`, and contains all 7 keys of `PortfolioHomeProps`.
- `GET /projects` supports category filtering, returns 200 OK for detail views, and returns 404 for invalid slugs.
- `GET /articles` supports keyword search filtering across title, excerpt, and content, and returns 200 OK for published article readers.
- Draft article protection is strictly enforced: draft article slugs return HTTP 404 Not Found and draft articles are excluded from all public listings.
- The full Pest test suite passes with 77 passed tests, 621 assertions, and 0 failures.

---

## 5. Verification Method

To independently verify this verdict:

1. **Execute Full Test Suite**:
   ```bash
   php artisan test --compact
   ```
   *Expected Output:*
   ```json
   {"tool":"pest","result":"passed","tests":91,"passed":77,"assertions":621,"duration_ms":...,"skipped":14}
   ```

2. **Inspect Dedicated Milestone 2 Test Suite**:
   View `tests/Feature/Milestone2PublicEndpointsTest.php` to review all 20 adversarial tests covering `PortfolioHomeProps`, draft protection, category filtering, search, and SQL injection resistance.

3. **Invalidation Conditions**:
   - If `HomeController` omits any of the 7 `PortfolioHomeProps` keys, tests in `Milestone2PublicEndpointsTest.php:33-54` will fail.
   - If `PublicArticleController@show` serves a draft article instead of returning 404, test `Milestone2PublicEndpointsTest.php:414-428` will fail.
   - If `PublicProjectController@show` returns 200 for a missing slug, test `Milestone2PublicEndpointsTest.php:258-262` will fail.
