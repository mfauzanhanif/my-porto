# Design

## Themes

this design using neo brutalism, we change light and dark theme into monochormatic and duotone.

### Monochromatic

```css
@import "tailwindcss";
@import "tw-animate-css";

/* Neobrutalism monochromatic palette: sky */
:root {
  --background: hsl(207, 89%, 93%);
  --secondary-background: oklch(100% 0 0);
  --foreground: oklch(0% 0 0);
  --main-foreground: oklch(0% 0 0);
  --main: hsl(204, 100%, 50%);
  --border: oklch(0% 0 0);
  --ring: oklch(0% 0 0);
  --overlay: oklch(0% 0 0 / 0.8);
  --shadow: 2px 2px 0px 0px var(--border);
  --chart-1: #0099FF;
  --chart-2: #FF4D50;
  --chart-3: #FACC00;
  --chart-4: #05E17A;
  --chart-5: #7A83FF;
  --chart-active-dot: #000;
}

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

  --spacing-boxShadowX: 2px;
  --spacing-boxShadowY: 2px;
  --spacing-reverseBoxShadowX: -2px;
  --spacing-reverseBoxShadowY: -2px;
  --radius-base: 10px;
  --shadow-shadow: var(--shadow);
  --font-weight-base: 500;
  --font-weight-heading: 700;
}

@layer base {
  body {
    @apply text-foreground font-base bg-background;
  }

  h1, h2, h3, h4, h5, h6{
    @apply font-heading;
  }
}
```

### Duotone

```css
@import "tailwindcss";
@import "tw-animate-css";

/* Neobrutalism duotone palette: sky */
:root {
  --background: hsl(236, 100%, 80%);
  --secondary-background: oklch(100% 0 0);
  --foreground: oklch(0% 0 0);
  --main-foreground: oklch(0% 0 0);
  --main: hsl(204, 100%, 50%);
  --border: oklch(0% 0 0);
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

  --spacing-boxShadowX: 2px;
  --spacing-boxShadowY: 2px;
  --spacing-reverseBoxShadowX: -2px;
  --spacing-reverseBoxShadowY: -2px;
  --radius-base: 10px;
  --shadow-shadow: var(--shadow);
  --font-weight-base: 500;
  --font-weight-heading: 700;
}

@layer base {
  body {
    @apply text-foreground font-base bg-background;
  }

  h1, h2, h3, h4, h5, h6{
    @apply font-heading;
  }
}
```

## UI Components

### Shadcn UI

### Framer Motion

## Typography

Menggunakan font Space Grotesk.
