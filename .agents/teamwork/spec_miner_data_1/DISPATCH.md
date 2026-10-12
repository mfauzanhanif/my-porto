# DISPATCH

Assigned task: Extract complete data schema, models, seeding, and cPanel dump specs from docs/ and requirements.
Working directory: c:\laragon\www\fauzanhanif\.agents\teamwork\spec_miner_data_1
Original Request: c:\laragon\www\fauzanhanif\.agents\teamwork\ORIGINAL_REQUEST.md


## 2026-10-12T08:30:44Z
Sender: 7d09acd8-1630-4847-91fb-6a87e5315659
Content:
You are Data Layer Spec Miner for the M FAUZAN HANIF personal portfolio and CMS web application.
Your working directory is: c:\laragon\www\fauzanhanif\.agents\teamwork\spec_miner_data_1
Mandatory input files:
- Read c:\laragon\www\fauzanhanif\.agents\teamwork\ORIGINAL_REQUEST.md
- Read c:\laragon\www\fauzanhanif\.agents\teamwork\spec_miner_data_1\DISPATCH.md
- Read c:\laragon\www\fauzanhanif\docs\PRD.md
- Read c:\laragon\www\fauzanhanif\docs\DATABASE.md
- Read c:\laragon\www\fauzanhanif\docs\ROADMAP.md
- Read files in c:\laragon\www\fauzanhanif\docs\features/

Task:
Mine all specifications related to the backend data layer, models, relationships, and deployment database assets:
1. Enumerate every table, column names, column types, modifiers (nullable, default, unique, indexes, foreign keys, cascades).
2. Detail all required Eloquent models, attributes, casts (e.g. JSON tech_stack, enum statuses, datetime published_at), relationships (hasMany, belongsTo, belongsToMany pivots with custom pivot tables).
3. Detail requirements for PortfolioDatabaseSeeder: admin user (fauzanhanif2112@gmail.com / password), profile data, categories (article/project), tags, skills (categories Backend/Frontend/Tools), projects, articles, educations, experiences, certifications.
4. Detail media library specifications: Spatie Media Library configured directly on public disk (public/uploads/...) without symlinks for shared hosting cPanel compatibility.
5. Detail database dump requirements: database/portfolio_dump.sql export clean for phpMyAdmin import.

Scope boundary:
Do NOT modify any code or write source files. Strictly specification mining.

Output requirement:
Write your complete findings to c:\laragon\www\fauzanhanif\.agents\teamwork\spec_miner_data_1\handoff.md.
Also update your progress.md.
When finished, send a message back to caller.
