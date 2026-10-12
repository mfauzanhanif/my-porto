# DISPATCH

Assigned task: Extract complete Neobrutalism design specifications, page layouts, public showcases, and CMS admin dashboard specs.
Working directory: c:\laragon\www\fauzanhanif\.agents\teamwork\spec_miner_ui_1
Original Request: c:\laragon\www\fauzanhanif\.agents\teamwork\ORIGINAL_REQUEST.md
## 2026-10-12T08:30:44Z
Sender: 7d09acd8-1630-4847-91fb-6a87e5315659
Priority: MESSAGE_PRIORITY_HIGH
Content:
You are UI and CMS Spec Miner for the M FAUZAN HANIF personal portfolio and CMS web application.
Your working directory is: c:\laragon\www\fauzanhanif\.agents\teamwork\spec_miner_ui_1
Mandatory input files:
- Read c:\laragon\www\fauzanhanif\.agents\teamwork\ORIGINAL_REQUEST.md
- Read c:\laragon\www\fauzanhanif\.agents\teamwork\spec_miner_ui_1\DISPATCH.md
- Read c:\laragon\www\fauzanhanif\docs\PRD.md
- Read c:\laragon\www\fauzanhanif\docs\DESIGN.md
- Read c:\laragon\www\fauzanhanif\docs\ROADMAP.md
- Read files in c:\laragon\www\fauzanhanif\docs\features/

Task:
Mine all specifications related to UI design, public pages, admin authentication, CMS dashboard, and testing requirements:
1. Neobrutalism design system: color palette, borders (border-2 border-border), shadows (shadow-shadow), border-radius (rounded-base: 10px), tactile hover interactions, font families (Space Grotesk).
2. Public showcase pages and components:
   - resources/js/pages/welcome.tsx (Navbar sticky, Hero, About & Skills, Featured Projects, Experience & Education timelines, Certifications, Featured Articles, Contact & Footer).
   - /projects archive page with category filtering and project details.
   - /articles archive page with search and /articles/{slug} reader page with Neobrutalism typography.
   - HomeController props data flow and eager loading requirements.
3. Admin Authentication & CMS Dashboard:
   - Fortify login page /login (resources/js/pages/auth/login.tsx) and logout.
   - /dashboard summary metrics and quick actions.
   - CRUD forms and management interfaces: Profile & Contact, Projects, Articles (TipTap WYSIWYG editor), Skills, Categories, Tags, Educations, Experiences, Certifications.
   - Validation, inline errors, toast notifications, Inertia useForm.
4. Quality and verification criteria: Pest tests, Pint formatting, TypeScript typecheck, frontend production build.

Scope boundary:
Do NOT modify any code or write source files. Strictly specification mining.

Output requirement:
Write your complete findings to c:\laragon\www\fauzanhanif\.agents\teamwork\spec_miner_ui_1\handoff.md.
Also update your progress.md.
When finished, send a message back to caller.
