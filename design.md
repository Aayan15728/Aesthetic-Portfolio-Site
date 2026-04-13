# Athrix.me - Forensic UI/UX Design Audit

This document serves as the comprehensive "DNA" and source of truth for the structural and visual framework of athrix.me.

## 1. Brand Identity

**Vibe:** Sophisticated Minimalist / High-Contrast Bento-Grid
**Aesthetic Elements:** Breathable whitespace, high-contrast typography interplay (Serif/Grotesk), subtle grid definition, and deep neutral dark modes.

### Color Palette (Based on Tailwind Tokens)
- **Backgrounds:**
  - Light Mode: `#FFFFFF` (Solid White), `#FAFAFA` (Neutral-50)
  - Dark Mode: `#0A0A0A` (Neutral-950), `#171717` (Neutral-900)
- **Foreground / Text:**
  - Primary: `#000000` (Light) / `#FFFFFF` (Dark)
  - Secondary/Metadata: `#525252` (Neutral-600) / `#A3A3A3` (Neutral-400), often rendered with `opacity-70`, `opacity-50`, or `opacity-40` utilities for hierarchy.
- **Accent Color:**
  - `#006FEE` (Vibrant Blue) – Used sparingly for link hovers and focal points.
  - `#1DB954` (Spotify Green) – Used contextually for the music player widget.
- **Borders & Dividers:**
  - Light Mode: `#E5E5E5` (Neutral-200), `border-black/5` to `border-black/[0.06]`
  - Dark Mode: `#262626` (Neutral-800), `border-white/5` to `border-white/[0.06]`

---

## 2. Typography Scale

The site utilizes a premium dual-font system to craft an editorial, highly engineered look.

- **Display/Headings:** `Instrument Serif` (Italicized frequently to evoke elegance)
- **Body/Sans:** `HK Grotesk` (Loaded via `--font-hk-grotesk` variable)

| Level      | Font Family | Weight / Style | Size | Line-Height | Tracking (Spacing) | Usage / Example |
|------------|-------------|----------------|------|-------------|--------------------|-----------------|
| **H1**     | Instrument Serif | `font-medium` / `italic` | `text-4xl` (36px) | `leading-none` | `tracking-[0.01em]` | Hero Name ("Atharvsinh Jadav") |
| **H2**     | Instrument Serif | `font-regular`           | `text-xl` to `text-3xl` | `leading-tight` | `-tracking-[0.01em]` | Section Titles ("Professional Experience") |
| **H3**     | HK Grotesk       | `font-medium`            | `text-lg` (18px) | `leading-normal` | Normal | Project Titles, Job Roles |
| **Body**   | HK Grotesk       | `font-normal`            | `text-base` to `text-lg`| `leading-relaxed`| `-0.02em` | Bio, Paragraphs |
| **Small**  | HK Grotesk       | `font-normal`            | `text-sm` (14px) | `leading-normal` | Normal | Metadata, Work tags |
| **Micro**  | HK Grotesk       | `font-normal`            | `text-xs` / `text-[10px]` | `leading-none` | Normal | Tech stack labels, Dates |

---

## 3. Component Library

A breakdown of every reusable structural and UI element.

### Container & Layout
- **Main Container:** Single column, centered, bounded at `max-w-4xl`.
- **Padding:** `px-4` on mobile, scaling to `sm:px-8` and `sm:px-12` for desktop.
- **Grid Gaps:** Bento sections use `gap-3` to `gap-4`. 

### Bento Cards (Project Details)
- **Backgrounds:** `bg-white dark:bg-white/10` with internal wrappers using `bg-black/10 dark:bg-white/10`.
- **Borders:** `border-black/10 dark:border-white/5`.
- **Border Radius:** Outer cards are `rounded-[10px]` to `rounded-2xl`. Inner thumbnail images are `rounded-md`.
- **Spacing:** Inner content padding is minimized (`p-1`) to push the focus entirely onto the 4:3 aspect-ratio thumbnails.

### Navigational / Action Triggers
- **Social Badges / Discs:** `w-8 h-8` to `w-12 h-12`, always `rounded-full`. Base styling includes `bg-black/5 dark:bg-white/10`.
- **Profile Avatar:** High-prominence display, `w-24 h-24` scaling to `sm:w-28 sm:h-28`, `rounded-full`, paired with a dense, crisp `ring-4 ring-white shadow-lg`.
- **Badges:** Utilitarian rounded corners `rounded-md` (6px radius).

---

## 4. Interaction Map

The micro-interactions define the feel of the UI. Motion is purposeful, performant, and heavily driven by Tailwind's transition utilities.

### Scroll Reveal (Entrance)
- **Effect:** Sub-components fade in and slide up gently into place.
- **Classes:** `transition-all duration-500 ease-out opacity-0 translate-y-5`.
- **Trigger:** Intersection observer (scroll state) removes the opacity and translate classes, allowing the intrinsic CSS transition to drive the motion.

### Bento Group Hover (Spotlight Effect)
- **Group Dimming:** Surrounding elements fade slightly (`group-has-hover:opacity-40`) to spotlight the hovered element.
- **Self Lift:** The targeted item restores full opacity, scales subtly (`group-has-hover:group-hover/item:scale-[1.02]`), and raises off the page (`shadow-lg`).
- **Timing:** Driven by linear transition defaults spread over `duration-300`.
- **Internal Image Parallax:** Inside the hovered element, images scale intensely (`scale-105`) while the container remains `overflow-hidden`.

### Tactile Button & Link Feedback
- **Click Actions:** Real-world click feel mapped to `active:scale-95` and `hover:scale-105`.
- **Toggle Icons:** `duration-200` smooth rotations (e.g., dropdown chevrons trigger standard 180° transforms).
- **Text Links:** `transition-colors duration-200` to smoothly shift text color to standard solid foreground or the `#006FEE` accent on hover.

---

## 5. Conclusion (Implementation Summary)

The site marries raw simplicity with highly-tuned typography. To replicate this setup, a framework like Next.js mapped with TailwindCSS is optimal. A central `layout.tsx` should inject the two specific font variables (`--font-instrument-serif` and `--font-hk-grotesk`) to enable dynamic switching at the class level. 

### Tailwind config boilerplate:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#006FEE',
      },
      fontFamily: {
        serif: ['var(--font-instrument-serif)', 'serif'],
        sans: ['var(--font-hk-grotesk)', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
      aspectRatio: {
        '4/3': '4 / 3',
      }
    },
  },
  plugins: [],
}
```

The success of this design lies heavily in its strict adherence to constrained neutral color profiles, the use of fractional opacity borders (e.g. `border-black/[0.06]`), and the use of modern CSS group hover mechanics instead of complex JavaScript implementations.
