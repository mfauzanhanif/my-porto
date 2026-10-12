# Engineering Roadmap & Implementation Plan
## Web Portofolio Personal — M FAUZAN HANIF

---

## 1. Visi & Strategi Pengembangan

Roadmap ini merupakan panduan langkah demi langkah yang selaras dengan **[`docs/PRD.md`](file:///c:/laragon/www/fauzanhanif/docs/PRD.md)** dan **[`docs/DATABASE.md`](file:///c:/laragon/www/fauzanhanif/docs/DATABASE.md)**, dioptimalkan untuk alur kerja **Vibe Coding** serta target deployment **shared hosting cPanel (tanpa SSH & tanpa Node.js di server)**.

### Karakteristik Arsitektur:
- **Backend:** Laravel 13, Fortify Auth, Spatie MediaLibrary (disk `public` tanpa symlink).
- **Frontend:** React 19, Inertia.js v3, Tailwind CSS v4, Base UI, Neobrutalism tokens (`neobrutalism.dev`).
- **Database:** MySQL 8.0+ / MariaDB (skema siap ekspor `.sql` untuk phpMyAdmin).
- **Build & Deploy:** Aset di-bundle di lokal (`pnpm run build`), folder `public/build/` diunggah ke server cPanel.

```
Progress Timeline:
[██████████░░░░░░░░░░░░░░░░░░░░] 30% Complete
Fase 0: Selesai | Fase 1: Siap Dijalankan | Fase 2-5: Terencana Rinci
```

---

## 2. Rincian Fase Implementasi

```
           FASE 0: Pondasi, Tooling & Reorganisasi (SELESAI)
                                │
                                ▼
           FASE 1: Fondasi Portofolio & Personal Branding
                   (Database, Model, Hero, Projects, Skills)
                                │
                                ▼
           FASE 2: Konten & Rekam Jejak
                   (Artikel WYSIWYG, Educations, Experiences, Certifications)
                                │
                                ▼
           FASE 3: Pengelolaan Konten Mandiri (CMS & Auth)
                   (Login Fortify, Dashboard, CRUD Semua Modul)
                                │
                                ▼
           FASE 4: Penataan Konten & Filter Kategori/Tag
                   (Kategori 'article'/'project', Tag, Client Search)
                                │
                                ▼
           FASE 5: Pengujian, Optimasi & Kesiapan Deploy cPanel
                   (Pest Tests, Export SQL phpMyAdmin, Build Upload)
```

---

### Fase 0: Pondasi, Tooling & Reorganisasi Komponen `[SELESAI]`
- [x] **0.1. Reorganisasi Komponen:** Folder terbagi ke `cms/`, `shared/`, `landing/`, `media/`, dan `ui/`.
- [x] **0.2. Konsolidasi Layout:** Penggabungan ke `layouts/app-layout.tsx` dan `layouts/auth-layout.tsx`.
- [x] **0.3. Komponen Media Spatie:** 4 komponen React TSX di `components/media/` sinkron dengan styling neobrutalism.
- [x] **0.4. Optimalisasi Build Rolldown:** Code splitting vendor chunks, bundle `app.js` turun 93% (39.6 kB), 0 warning.
- [x] **0.5. Integrasi Tipografi:** Font Space Grotesk terpasang via bunny font & Tailwind v4.
- [x] **0.6. Kontrak TypeScript:** `resources/js/types/portfolio.ts` sinkron dengan skema database PRD.

---

### Fase 1: Fondasi Portofolio & Personal Branding `[PRIORITAS TINGGI - NEXT]`
Membangun data layer awal dan tampilan pembuka landing page yang langsung menonjolkan persona M FAUZAN HANIF.
*Spesifikasi rincian sub-fitur:* [01-beranda-perkenalan.md](file:///c:/laragon/www/fauzanhanif/docs/features/01-beranda-perkenalan.md), [02-daftar-proyek.md](file:///c:/laragon/www/fauzanhanif/docs/features/02-daftar-proyek.md), [03-skill-keahlian.md](file:///c:/laragon/www/fauzanhanif/docs/features/03-skill-keahlian.md).

- [ ] **1.1. Backend Data Layer (Bagian 1):**
  - Buat migration tabel `users`, `profiles`, `skills`, `projects`, `categories`, `project_category`.
  - Buat PHP Enum `App\Enums\CategoryType` (`article`, `project`).
  - Buat Model `User`, `Profile`, `Skill`, `Project`, `Category` dengan casts dan relasi.
- [ ] **1.2. Seeder Fondasi:**
  - `ProfileSeeder`: data diri M FAUZAN HANIF, headline, about, email, JSON sosmed (LinkedIn, GitHub, dll).
  - `SkillSeeder`: daftar skill dengan kategori (Backend, Frontend, Tools), level, dan `is_featured`.
  - `ProjectSeeder`: beberapa proyek unggulan dengan `tech_stack` (JSON) dan `project_url`.
  - Script ekspor SQL awal untuk persiapan phpMyAdmin.
- [ ] **1.3. Landing Page Sections (Bagian 1):**
  - `navbar.tsx`: Header sticky neobrutalism, logo, link seksi, download resume button.
  - `hero-section.tsx`: Foto profil, nama besar, headline, bio singkat, tombol CTA.
  - `about-section.tsx`: Deskripsi tentang diri dan fokus keahlian saat ini.
  - `skills-grid.tsx`: Grid keahlian dikelompokkan berdasarkan kategori bidang dengan badge warna neobrutalism.
  - `projects-showcase.tsx`: Kartu proyek unggulan dengan gambar sampul, pill tech stack, dan tombol tautan hasil karya.
  - Integrasi rute `GET /` di `HomeController` mengirimkan props via Inertia ke `welcome.tsx`.

---

### Fase 2: Konten & Rekam Jejak `[PRIORITAS TINGGI]`
Melengkapi konten landing page dengan rekam jejak riwayat karier, pendidikan, sertifikasi, serta artikel teknis.
*Spesifikasi rincian sub-fitur:* [04-artikel-blog.md](file:///c:/laragon/www/fauzanhanif/docs/features/04-artikel-blog.md), [05-riwayat-sertifikat.md](file:///c:/laragon/www/fauzanhanif/docs/features/05-riwayat-sertifikat.md).

- [ ] **2.1. Backend Data Layer (Bagian 2):**
  - Buat migration tabel `educations`, `experiences`, `certifications`, `tags`, `articles`, `article_tag`, `article_category`.
  - Buat PHP Enum `App\Enums\ArticleStatus` (`draft`, `published`).
  - Buat Model `Education`, `Experience`, `Certification`, `Tag`, `Article` lengkap dengan casts dan scopes (`scopeFeatured`, `scopePublished`).
- [ ] **2.2. Seeder Rekam Jejak & Artikel:**
  - Tambahkan data riwayat pendidikan (`start_year`, `end_year`).
  - Tambahkan pengalaman kerja (`company`, `role`, `start_date`, `end_date`, `description`).
  - Tambahkan sertifikat (`name`, `issuer`, `issued_at`, `credential_url`).
  - Tambahkan contoh artikel teknis dengan konten HTML WYSIWYG.
- [ ] **2.3. Landing Page Sections (Bagian 2):**
  - `experience-timeline.tsx`: Timeline kronologis riwayat kerja dan peran.
  - `education-timeline.tsx`: Riwayat pendidikan formal/bootcamp.
  - `certifications-section.tsx`: Kartu sertifikat beserta link verifikasi kredensial.
  - `articles-section.tsx`: Artikel unggulan di beranda dengan tanggal terbit dan ringkasan.
  - `contact-section.tsx` & `footer.tsx`: Tautan kontak langsung (email mailto & sosmed).
- [ ] **2.4. Halaman Baca Artikel (`/articles/{slug}`) & Galeri Proyek (`/projects`):**
  - Halaman baca tulisan lengkap yang nyaman dibaca dengan styling tipografi neobrutalism.
  - Halaman galeri semua proyek dengan kartu neobrutalism.

---

### Fase 3: Pengelolaan Konten Mandiri (CMS & Autentikasi) `[PRIORITAS TINGGI]`
Panel kontrol pribadi agar seluruh konten dapat diperbarui langsung dari antarmuka web.
*Spesifikasi rincian sub-fitur:* [06-kelola-konten.md](file:///c:/laragon/www/fauzanhanif/docs/features/06-kelola-konten.md), [07-login-admin.md](file:///c:/laragon/www/fauzanhanif/docs/features/07-login-admin.md).

- [ ] **3.1. Autentikasi Fortify:**
  - Halaman `/login` khusus admin dengan tampilan kartu neobrutalism (`auth-layout.tsx`).
  - Proteksi middleware `auth` pada rute dashboard dan operasi CRUD.
- [ ] **3.2. Dashboard Overview (`/dashboard`):**
  - Ringkasan metrik statistik (jumlah artikel, proyek, skill, sertifikat).
  - Tautan cepat (*Quick Actions*) untuk menambah konten baru.
- [ ] **3.3. CRUD Profil & Kontak (`/admin/profile`):**
  - Form pengelolaan nama, headline, about, email, foto profil, dan daftar JSON media sosial.
- [ ] **3.4. CRUD Proyek & Skill (`/admin/projects`, `/admin/skills`):**
  - Tambah/edit proyek dengan upload gambar sampul dan input tech stack.
  - Tambah/edit skill dengan kategori bidang dan level kemahiran.
- [ ] **3.5. CRUD Artikel dengan WYSIWYG (`/admin/articles`):**
  - Integrasi editor teks kaya (TipTap / Quill) untuk menghasilkan konten HTML.
  - Upload gambar di dalam artikel dan gambar sampul.
  - Status publikasi (`draft` / `published`) dan tanggal terbit.
- [ ] **3.6. CRUD Riwayat & Sertifikat:**
  - Kelola pendidikan, pengalaman kerja, dan sertifikat beserta tautan verifikasi.

---

### Fase 4: Penataan Konten & Filter Kategori/Tag `[PRIORITAS SEDANG]`
*Spesifikasi rincian sub-fitur:* [08-kategori-tag.md](file:///c:/laragon/www/fauzanhanif/docs/features/08-kategori-tag.md).
- [ ] **4.1. Kelola Kategori & Tag di CMS:**
  - CRUD Kategori dengan pemilihan tipe (`article` atau `project`).
  - CRUD Tag khusus artikel.
  - Antarmuka multi-select kategori & tag pada form artikel dan proyek.
- [ ] **4.2. Filter & Pencarian di Halaman Publik:**
  - Filter kategori pada galeri proyek (`/projects`).
  - Pencarian artikel instan berdasarkan kata kunci di `/articles`.

---

### Fase 5: Pengujian, Kesiapan cPanel & Deployment `[FINAL]`
Menjamin aplikasi stabil, ringan, dan siap diunggah ke shared hosting cPanel tanpa kendala terminal/Node.js.

- [ ] **5.1. Testing Suite (Pest PHP):**
  - Test akses landing page (`GET /`) memastikan seluruh eager loading berjalan mulus.
  - Test autentikasi Fortify (login, logout, proteksi CMS).
  - Test operasi CRUD admin.
- [ ] **5.2. Media Storage Tanpa Symlink:**
  - Konfigurasi penyimpanan disk `public` (menyimpan ke `public/uploads/` langsung) agar tidak membutuhkan perintah `storage:link`.
- [ ] **5.3. Build & Export Package:**
  - Jalankan `pnpm run build` lokal untuk menghasilkan artefak `public/build/`.
  - Ekspor file SQL bersih (skema + data awal seeder) untuk diimpor ke phpMyAdmin cPanel.
  - Dokumentasi konfigurasi file `.env` produksi (`APP_DEBUG=false`, `APP_ENV=production`, kredensial DB).

---

## 3. Matriks Tugas & Prioritas (Task Tracking Matrix)

| ID | Tugas | Estimasi | Prioritas | Status | Target File / Lokasi |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **T-01** | Enums & Migrations (Users, Profiles, Skills, Projects, Categories) | S | P0 | `[ ]` | `database/migrations/`, `app/Enums/` |
| **T-02** | Migrations (Articles, Tags, Experiences, Educations, Certs, Pivots) | S | P0 | `[ ]` | `database/migrations/` |
| **T-03** | Eloquent Models & Casts | S | P0 | `[ ]` | `app/Models/` |
| **T-04** | PortfolioDatabaseSeeder (Data Awal Realistis) | S | P0 | `[ ]` | `database/seeders/` |
| **T-05** | Landing Sections (Navbar, Hero, About, Skills, Projects) | M | P0 | `[ ]` | `resources/js/components/landing/` |
| **T-06** | Landing Sections (Experiences, Educations, Certs, Articles, Contact) | M | P0 | `[ ]` | `resources/js/components/landing/` |
| **T-07** | Welcome Page Integration (`resources/js/pages/welcome.tsx`) | S | P0 | `[ ]` | `resources/js/pages/welcome.tsx` |
| **T-08** | Fortify Login Page Neobrutalism | S | P1 | `[ ]` | `resources/js/pages/auth/login.tsx` |
| **T-09** | CMS Dashboard Overview & Quick Actions | S | P1 | `[ ]` | `resources/js/pages/dashboard.tsx` |
| **T-10** | CMS Profile & Sosmed Editor | S | P1 | `[ ]` | `resources/js/pages/cms/profile/` |
| **T-11** | CMS Projects & Skills CRUD | M | P1 | `[ ]` | `resources/js/pages/cms/` |
| **T-12** | CMS Articles CRUD (WYSIWYG Editor) | M | P1 | `[ ]` | `resources/js/pages/cms/articles/` |
| **T-13** | CMS Categories & Tags Management | S | P2 | `[ ]` | `resources/js/pages/cms/categories/` |
| **T-14** | Public Projects & Articles Archive Pages | M | P2 | `[ ]` | `resources/js/pages/` |
| **T-15** | Pest Feature Test Suite | M | P1 | `[ ]` | `tests/Feature/` |
| **T-16** | Media Storage & cPanel Deployment Guide | S | P1 | `[ ]` | `config/filesystems.php`, `docs/DEPLOYMENT.md` |

*Keterangan Prioritas: `P0` (Krusial/Blocker), `P1` (Fitur Utama), `P2` (Penyempurnaan)*
