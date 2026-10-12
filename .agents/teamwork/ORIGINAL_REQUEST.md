# Original User Request

## 2026-10-12T08:27:52Z

# Teamwork Project Prompt

Selesaikan pembangunan web portofolio personal dan CMS mandiri untuk M FAUZAN HANIF berbasis Laravel 13, React 19, Inertia.js v3, Tailwind CSS v4 dengan estetika Neobrutalism, Spatie Laravel Media Library (disk public cPanel friendly tanpa symlink), dan Fortify Authentication secara end-to-end sesuai dengan roadmap (Fase 1 sampai Fase 5).

Working directory: c:\laragon\www\fauzanhanif
Integrity mode: development

Referensi spesifikasi:
- docs/PRD.md
- docs/DATABASE.md
- docs/DESIGN.md
- docs/ROADMAP.md
- docs/features/

## Requirements

### R1. Backend Data Layer & Database Seeding (Fase 1 & Fase 2)
- Implementasikan migration dan Eloquent models lengkap dengan casting dan relasi:
  - `users`: Akun admin (`fauzanhanif2112@gmail.com` / `password`).
  - `profiles`: Data diri pemilik (M FAUZAN HANIF), headline, about, photo, email, JSON sosmed (LinkedIn, GitHub, dll).
  - `categories`: Master kategori dengan enum `type` (`article`, `project`).
  - `tags`: Master tag kata kunci khusus artikel.
  - `skills`: Keahlian teknis, bidang kategori (Backend, Frontend, Tools), level kemahiran, icon, `is_featured`.
  - `projects`: Judul, slug unik, deskripsi, `tech_stack` (JSON), image, `project_url`, `is_featured`, dan pivot `project_category`.
  - `articles`: Judul, slug unik, excerpt, `content` (LONGTEXT HTML dari WYSIWYG), `cover_image`, status enum (`draft`, `published`), `is_featured`, `published_at`, dan pivot `article_category` & `article_tag`.
  - `educations`, `experiences`, `certifications`: Riwayat pendidikan, pengalaman kerja kronologis, dan sertifikat berlisensi.
- Buat `PortfolioDatabaseSeeder` yang menginisialisasi seluruh data di atas secara realistis dan komprehensif.

### R2. Landing Page & Public Showcases (Fase 1, Fase 2, Fase 4)
- Bangun landing page terpadu (`resources/js/pages/welcome.tsx`) dan halaman arsip publik dengan gaya Neobrutalism (`border-2 border-border`, `shadow-shadow`, `rounded-base: 10px`, tactile hover feedback, Space Grotesk):
  - Sticky Navbar Neobrutalism dengan lompatan section cepat dan tombol aksi.
  - Hero Section (foto profil, nama besar, headline, bio ringkas, CTA).
  - About Section & Skills Grid terkelompok per bidang dengan badge Neobrutalism.
  - Featured Projects Showcase & Galeri Proyek (`/projects`) dengan filter kategori dan halaman detail proyek.
  - Work Experience & Education Timelines kronologis.
  - Certifications Showcase dengan tautan verifikasi kredensial.
  - Featured Articles Section & Galeri Artikel (`/articles`) dengan fitur pencarian klien dan halaman baca artikel (`/articles/{slug}`) yang merender tipografi Neobrutalism untuk konten HTML.
  - Contact Section & Footer dengan tautan email `mailto` dan media sosial.
- Seluruh data dikirim melalui `HomeController` dengan eager loading efisien (`with()`) dan prop terpadu.

### R3. Admin Authentication & Protected CMS Dashboard (Fase 3 & Fase 4)
- Autentikasi Laravel Fortify: Halaman login `/login` bergaya Neobrutalism (`resources/js/pages/auth/login.tsx`) dan fitur logout aman.
- Middleware proteksi autentikasi (`auth`) pada semua rute pengelolaan.
- Dashboard Ringkasan (`resources/js/pages/dashboard.tsx`) dengan metrik konten (total artikel, proyek, skill, sertifikat, rasio draf/terbit) dan Quick Actions.
- Form CRUD responsif dengan validasi error inline, toast notification, dan Inertia `useForm`:
  - CRUD Profil & Kontak (`/admin/profile`)
  - CRUD Proyek (upload cover & pemilihan kategori)
  - CRUD Artikel (editor WYSIWYG TipTap, cover, kategori & tag, status draf/published)
  - CRUD Skill, Pendidikan, Pengalaman, dan Sertifikat
  - CRUD Kategori (filter type: article/project) dan Tag

### R4. Media Management & cPanel Deployment Readiness (Fase 5)
- Konfigurasi Spatie Media Library menggunakan disk `public` langsung (`public/uploads/...`) agar berjalan sempurna di shared hosting cPanel tanpa memerlukan symlink `storage:link`.
- Ekspor skema dan data database bersih ke `database/portfolio_dump.sql` untuk impor langsung via phpMyAdmin.
- Build aset frontend (`pnpm run build`) harus selesai tanpa error atau warning.

### R5. Test Automation & Quality Assurance (Fase 5)
- Rangkaian pengujian fitur Pest PHP (`tests/Feature/`) yang memverifikasi:
  - Akses landing page, galeri proyek, galeri artikel, dan detail artikel publik.
  - Autentikasi Fortify (login sukses, login gagal, proteksi rute admin dari tamu).
  - Operasi CRUD konten utama CMS oleh admin.
- Format kode PHP sesuai standar dengan `vendor/bin/pint --format agent`.
- Pemeriksaan TypeScript tanpa error (`pnpm run types:check`).

## Acceptance Criteria

### Data & Backend
- [ ] Migrasi berhasil dieksekusi tanpa error (`php artisan migrate:fresh`).
- [ ] `PortfolioDatabaseSeeder` berhasil mengisi data akun admin (`fauzanhanif2112@gmail.com`), profil, skill, pengalaman, pendidikan, proyek, sertifikat, dan artikel.
- [ ] Seluruh relasi model Eloquent (hasMany, belongsToMany pivot) berfungsi dengan benar.

### Tampilan & Frontend
- [ ] Landing page (`/`) merender seluruh komponen dengan tema Neobrutalism sesuai panduan `docs/DESIGN.md`.
- [ ] Galeri Proyek (`/projects`) dan Galeri Artikel (`/articles`) serta halaman baca artikel (`/articles/{slug}`) berfungsi dengan baik.
- [ ] Tampilan responsif di layar mobile dan desktop.

### CMS & Autentikasi
- [ ] Admin dapat login di `/login` dengan `fauzanhanif2112@gmail.com` dan diarahkan ke `/dashboard`.
- [ ] Rute dashboard dan CRUD admin terlindungi dari akses tanpa login.
- [ ] Admin dapat melakukan CRUD pada Profil, Proyek, Artikel (WYSIWYG), Skill, Kategori, Tag, Pendidikan, Pengalaman, dan Sertifikat.

### Quality & Verifikasi
- [ ] Seluruh test Pest PHP lulus 100% (`php artisan test --compact`).
- [ ] TypeScript typecheck lulus tanpa error (`pnpm run types:check`).
- [ ] Frontend build sukses (`pnpm run build`).
