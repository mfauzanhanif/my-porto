## 2026-10-12T09:54:26Z
You are Milestone 3 Explorer 2 (CMS Backend CRUD Controllers & Validation).
Your working directory is: c:\laragon\www\fauzanhanif\.agents\teamwork\explorer_m3_2
Mandatory inputs to read:
- Read c:\laragon\www\fauzanhanif\.agents\teamwork\ORIGINAL_REQUEST.md
- Read c:\laragon\www\fauzanhanif\PROJECT.md
- Read c:\laragon\www\fauzanhanif\.agents\teamwork\explorer_m3_2\DISPATCH.md
- Read c:\laragon\www\fauzanhanif\docs\PRD.md
- Read c:\laragon\www\fauzanhanif\docs\DATABASE.md
- Read c:\laragon\www\fauzanhanif\docs\features\06-admin-cms-dashboard.md
- Read c:\laragon\www\fauzanhanif\docs\features\08-kategori-tag.md
- Read app/Models/ (all 9 models)

Task:
Formulate the exact backend CRUD architecture and controllers for all CMS entities in Milestone 3:
1. Controllers in `app/Http/Controllers/Admin/`:
   - `ProfileController`: edit() and update() handling profile details, avatar/photo upload via Spatie MediaLibrary (clearMediaCollection('avatar') / addMediaFromRequest('photo')->toMediaCollection('avatar')), and sosmed JSON array.
   - `ProjectController`: Full resource CRUD (index, create, store, edit, update, destroy); cover image upload via MediaLibrary, tech_stack array parsing, project_category sync, is_featured toggle.
   - `ArticleController`: Full resource CRUD; TipTap WYSIWYG content (LONGTEXT HTML), cover image upload via MediaLibrary, article_category sync, article_tag sync, status enum (draft / published), published_at timestamping, is_featured toggle.
   - `SkillController`: Resource CRUD; category enum/string, proficiency level, icon.
   - `CategoryController`: Resource CRUD; type enum (article vs project), unique slug.
   - `TagController`: Resource CRUD; name, unique slug.
   - `EducationController`: Resource CRUD; institution, degree, field_of_study, start_year, end_year.
   - `ExperienceController`: Resource CRUD; company, role, description, start_date, end_date.
   - `CertificationController`: Resource CRUD; name, issuer, issued_at, credential_url, certificate image via MediaLibrary.
2. Route Architecture:
   - Formulate routes in routes/web.php under Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(...).
3. Validation & Error Handling:
   - Formulate validation rules for every store/update action, ensuring flash messages (with('success', '...')) and graceful redirection.
4. Provide copy-pasteable PHP controller and route code for the Worker.

Scope boundary:
Do NOT write or modify application source code. Strictly produce analysis and recommendation report.

Output requirement:
Write your complete report to c:\laragon\www\fauzanhanif\.agents\teamwork\explorer_m3_2\handoff.md.
Also update your progress.md.
When finished, send a message back to caller.
