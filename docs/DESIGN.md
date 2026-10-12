# Design System & Guidelines (Neobrutalism)
## Web Portofolio Personal

---

## 1. Filosofi Desain (Design Philosophy)

Aplikasi ini mengusung gaya estetika **Neobrutalism** terinspirasi dari referensi standar industri modern seperti [neobrutalism.dev](https://neobrutalism.dev).

### Karakteristik Utama:
1. **Bold Solid Borders:** Setiap komponen memiliki bingkai tegas dengan garis solid 2px (`border-2 border-border`).
2. **Hard Box Shadows (No Blur):** Bayangan tegas tanpa efek blur (`box-shadow: 2px 2px 0px 0px var(--border)`).
3. **Tactile Interaction Physics:** Saat elemen interaktif di-hover atau di-klik, elemen bergeser secara fisik menuju posisi bayangannya (*button press effect*):
   - Standar: `hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none`
   - Reverse: Munculkan bayangan saat di-hover.
4. **Sudut Rounded Terukur:** Tidak tajam kotak murni, tetapi memakai lengkungan terukur (`rounded-base: 10px`) untuk memberikan kesan modern dan ramah (*approachable brutalism*).
5. **High-Contrast Typography:** Tipografi berkarakter kuat menggunakan **Space Grotesk** dengan bobot tebal untuk heading.

---

## 2. Tema & Palet Warna (Themes & Color Palettes)

Aplikasi menyediakan dua opsi tema utama: **Monochromatic (Sky)** dan **Duotone (Sky-Violet)**. Keduanya menggunakan variabel CSS yang kompatibel dengan Tailwind CSS v4 `@theme inline`.

### 2.1. Monochromatic (Sky Theme - Default)
Tema dengan dominasi satu warna aksen cerah (*Sky Blue*) dipadukan dengan latar belakang pastel lembut dan kontras hitam pekat.

```css
/* Neobrutalism Monochromatic: Sky */
:root, [data-theme="monochromatic"] {
  --background: hsl(207, 89%, 93%);          /* Biru pastel lembut */
  --secondary-background: oklch(100% 0 0);    /* Putih solid untuk card/surface */
  --foreground: oklch(0% 0 0);                /* Teks hitam pekat */
  --main-foreground: oklch(0% 0 0);           /* Teks di atas warna utama */
  --main: hsl(204, 100%, 50%);                /* Sky Blue primer */
  --border: oklch(0% 0 0);                    /* Border hitam solid */
  --ring: oklch(0% 0 0);                      /* Ring fokus keyboard */
  --overlay: oklch(0% 0 0 / 0.8);             /* Modal backdrop */
  --shadow: 2px 2px 0px 0px var(--border);

  /* Chart & Analytics Tokens */
  --chart-1: #0099FF;
  --chart-2: #FF4D50;
  --chart-3: #FACC00;
  --chart-4: #05E17A;
  --chart-5: #7A83FF;
  --chart-active-dot: #000;
}
```

---

### 2.2. Duotone (Sky-Violet Theme)
Tema dengan perpaduan dua warna kontras tinggi (*Sky Blue* sebagai elemen interaktif dan *Soft Violet* sebagai latar belakang panggung utama).

```css
/* Neobrutalism Duotone: Sky & Violet */
[data-theme="duotone"] {
  --background: hsl(236, 100%, 80%);          /* Violet cerah */
  --secondary-background: oklch(100% 0 0);    /* Putih solid */
  --foreground: oklch(0% 0 0);                /* Teks hitam */
  --main-foreground: oklch(0% 0 0);
  --main: hsl(204, 100%, 50%);                /* Sky Blue primer */
  --border: oklch(0% 0 0);                    /* Border hitam solid */
  --ring: oklch(0% 0 0);
  --overlay: oklch(0% 0 0 / 0.8);
  --shadow: 2px 2px 0px 0px var(--border);

  --chart-1: #0099FF;
  --chart-2: #7A83FF;
  --chart-3: #FACC00;
  --chart-4: #05E17A;
  --chart-5: #FF4D50;
  --chart-active-dot: #000;
}
```

---

### 2.3. Dark Mode Adaptation
Dalam mode gelap (`.dark`), warna latar belakang berganti menjadi gelap pekat, sementara border dan bayangan berganti menjadi kontras putih/abu-abu terang:

```css
.dark {
  --background: oklch(0.145 0 0);
  --secondary-background: oklch(0.205 0 0);
  --foreground: oklch(0.985 0 0);
  --main-foreground: oklch(0% 0 0);
  --border: oklch(0.985 0 0);
  --shadow: 2px 2px 0px 0px var(--border);
}
```

---

## 3. Tailwind CSS v4 Theme Tokens

Konfigurasi token pada file CSS aplikasi (`resources/css/app.css`):

```css
@theme inline {
  --color-main: var(--main);
  --color-background: var(--background);
  --color-secondary-background: var(--secondary-background);
  --color-foreground: var(--foreground);
  --color-main-foreground: var(--main-foreground);
  --color-border: var(--border);
  --color-overlay: var(--overlay);
  --color-ring: var(--ring);

  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  /* Spacing & Dimension Tokens */
  --spacing-boxShadowX: 2px;
  --spacing-boxShadowY: 2px;
  --spacing-reverseBoxShadowX: -2px;
  --spacing-reverseBoxShadowY: -2px;

  /* Radius & Weight Tokens */
  --radius-base: 10px;
  --shadow-shadow: var(--shadow);
  --font-weight-base: 500;
  --font-weight-heading: 700;
}
```

---

## 4. Tipografi (Typography)

- **Font Family Utama:** `Space Grotesk`, sans-serif (alternatif fallback: `Instrument Sans`).
- **Font Weight:**
  - `font-base`: `500` (teks paragraf, label, button, metadata).
  - `font-heading`: `700` (judul artikel, heading hero, kartu metrik).

### Hierarki Heading:

| Level | Tailwind Classes | Kegunaan |
| :--- | :--- | :--- |
| **Hero Title (H1)** | `text-4xl md:text-6xl font-heading tracking-tight leading-none` | Hero Landing Page |
| **Section Title (H2)** | `text-2xl md:text-3xl font-heading tracking-tight` | Judul Bagian (Projects, Articles, Experience) |
| **Card Title (H3)** | `text-lg md:text-xl font-heading` | Judul Kartu Proyek, Artikel, Perusahaan |
| **Subheading (H4)** | `text-base font-heading` | Subtitle, Jabatan, Kategori |
| **Body Text** | `text-sm md:text-base font-base leading-relaxed` | Deskripsi proyek, bio, konten artikel |
| **Small / Caption** | `text-xs md:text-sm font-base text-muted-foreground` | Metadata waktu, tag, label input |

---

## 5. Komponen Inti & State Interaksi

### 5.1. Button (`resources/js/components/ui/button.tsx`)
Tombol menggunakan token Neobrutalism dengan 4 varian utama:

| Varian | Style Dasar | State Hover & Active |
| :--- | :--- | :--- |
| **`default`** | `bg-main text-main-foreground border-2 border-border shadow-shadow` | `hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none` |
| **`neutral`** | `bg-secondary-background text-foreground border-2 border-border shadow-shadow` | `hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none` |
| **`noShadow`** | `bg-main text-main-foreground border-2 border-border` | Tanpa pergeseran bayangan, cocok untuk tombol toolbar |
| **`reverse`** | `bg-main text-main-foreground border-2 border-border` | `hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow` |

Ukuran standar: `xs` (h-8), `sm` (h-9), `default` (h-10 px-4), `lg` (h-11 px-8), dan icon sizes.

---

### 5.2. Card (`resources/js/components/ui/card.tsx`)
Kontainer standar untuk seluruh blok konten:
```tsx
<div className="rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow transition-all">
  {/* Card Content */}
</div>
```
Untuk kartu yang dapat diklik (*clickable card*):
```tsx
<div className="rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
  {/* Linkable Card */}
</div>
```

---

### 5.3. Badges & Tags (`resources/js/components/ui/badge.tsx`)
Label kategori dan keahlian dengan tampilan *sticker-like*:
```tsx
<span className="inline-flex items-center rounded-base border-2 border-border bg-main px-2.5 py-0.5 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
  Fullstack
</span>
```

---

### 5.4. Form Inputs (`resources/js/components/ui/input.tsx`)
Field input dengan batas tebal dan ring fokus kontras:
```tsx
<input className="rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2" />
```

---

### 5.5. Konten Artikel WYSIWYG (TipTap / HTML Renderer)
Konten artikel yang dihasilkan dari editor HTML wajib mempertahankan nuansa Neobrutalism:
- **Heading di dalam artikel (h2, h3):** `font-heading tracking-tight border-b-2 border-border pb-1 mt-6 mb-3`
- **Blockquote:** `border-l-4 border-border bg-main/10 px-4 py-2 italic font-base rounded-r-base`
- **Code Block:** `border-2 border-border bg-secondary-background rounded-base p-4 font-mono text-sm shadow-[2px_2px_0px_0px_var(--border)]`
- **Gambar di dalam artikel:** `rounded-base border-2 border-border shadow-shadow my-4 max-w-full`

---

### 5.6. Tech Stack Pills & Social Media Buttons
- **Tech Stack Pills (Kartu Proyek):**
  ```tsx
  <span className="inline-flex items-center rounded-base border-2 border-border bg-secondary-background px-2 py-0.5 text-xs font-heading shadow-[1px_1px_0px_0px_var(--border)]">
    Laravel 13
  </span>
  ```
- **Social Media Icon Buttons (Hero & Contact):**
  ```tsx
  <a className="inline-flex size-10 items-center justify-center rounded-base border-2 border-border bg-secondary-background shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
    <Github className="size-5" />
  </a>
  ```

---

## 6. Animasi & Transisi (Framer Motion)

Untuk transisi halaman publik yang memukau (*wow factor*), gunakan preset spring physics berikut:

### Preset Spring Standar:
```ts
export const neoSpring = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};
```

### Motion Variants Rekomendasi:

```ts
// Muncul bertahap (Stagger Container)
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Item Fade-Up dengan Pop Efek
export const popFadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: neoSpring,
  },
};
```

---

## 7. Aturan Vibe Coding untuk Styling

Bagi pengembang dan asisten AI:
1. **Dilarang keras memakai rounded-full atau rounded-3xl pada Card:** Gunakan selalu `rounded-base` (10px) agar konsisten dengan token Neobrutalism.
2. **Dilarang memakai border 1px biasa:** Gunakan selalu `border-2 border-border`.
3. **Dilarang memakai bayangan blur default Tailwind (`shadow-md`, `shadow-lg`):** Gunakan selalu `shadow-shadow` (`2px 2px 0px 0px var(--border)`).
4. **Semua interaksi klik wajib memiliki umpan balik visual (*tactile feedback*):** Tombol dan kartu klik harus merespons kursor dengan pergeseran koordinat `translate-x` / `translate-y`.
