## 2026-10-12T09:09:17Z
You are Milestone 2 Explorer 1 (Public Backend Controllers & Routes).
Your working directory is: c:\laragon\www\fauzanhanif\.agents\teamwork\explorer_m2_1
Mandatory inputs:
- Read c:\laragon\www\fauzanhanif\.agents\teamwork\ORIGINAL_REQUEST.md
- Read c:\laragon\www\fauzanhanif\PROJECT.md
- Read c:\laragon\www\fauzanhanif\docs\PRD.md
- Read c:\laragon\www\fauzanhanif\resources\js\types\portfolio.ts

Task:
Formulate the exact implementation plan for public controllers and routes in Milestone 2:
1. `app/Http/Controllers/HomeController.php`:
   - Single round-trip `index()` action returning `Inertia::render('welcome', [...])`
   - Strict adherence to `PortfolioHomeProps`: profile, skills, experiences, educations, certifications, featuredProjects (max 3, with categories), featuredArticles (status published, max 3, with categories and tags).
2. `app/Http/Controllers/PublicProjectController.php`:
   - `index()` for `/projects` archive page with category filtering by slug
   - `show($slug)` for project detail view (or modal/page)
3. `app/Http/Controllers/PublicArticleController.php`:
   - `index()` for `/articles` archive with search query handling
   - `show($slug)` for `/articles/{slug}` reader, ensuring draft articles return 404
4. `routes/web.php`:
   - Register public named routes: `home`, `projects.index`, `projects.show`, `articles.index`, `articles.show`.
5. Provide copy-pasteable PHP controller and route code for the Worker.

Scope boundary:
Do NOT write or modify application source code. Strictly produce analysis and recommendation report.

Output requirement:
Write your complete report to c:\laragon\www\fauzanhanif\.agents\teamwork\explorer_m2_1\handoff.md.
When finished, send a message back to caller.
