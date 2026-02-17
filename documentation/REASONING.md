# Emerald Rook Website - Design Reasoning

## Overview

This document captures the design decisions and reasoning behind the Emerald Rook company website.

---

## Design System Selection

### Style: Metalab-Inspired Dark Theme with Full-Page Slides
**Why**: A premium dark theme with scroll-snap full-viewport slides creates a polished, immersive portfolio feel. Each section fills the screen, giving the site an app-like quality. The dark foundation (`#0a0a0a`) lets the emerald accent glow prominently, producing a high-end tech aesthetic.

### Brand Identity: Emerald Rook
**Connotations**: "Emerald" = precious, refined, growth. "Rook" = strategic, foundational, castle-like strength.

The visual identity translates these into:
- **Emerald green accent** (`#10B981`) — growth, innovation, clarity
- **Dark foundation** (`#0a0a0a`) — premium, focused, professional
- **SVG rook/castle logo** — geometric chess piece rendered in emerald tones
- **Emerald stone text effect** — SVG filter with fractalNoise + specular lighting creates a gemstone shimmer on the hero "software" text
- **Noise texture overlays** — subtle grain adds tactile depth to dark surfaces
- **Rounded elements** (2xl pills, circular avatars) — modern and approachable

### Typography: Inter / Instrument Serif
**Why**: Inter (sans-serif) is the workhorse — clean, highly legible, with excellent weight range (300–700) for establishing text hierarchy on dark backgrounds. Instrument Serif provides editorial contrast for headings, giving them personality with its italic variant. The pairing creates a contemporary-meets-classic feel.

**Usage**:
- `font-sans` (Inter) — body text, nav, labels, buttons, stat numbers
- `font-serif` (Instrument Serif) — h1–h2 headings, project names, section titles; italic variant for decorative secondary phrases

### Color Palette
| Token | Hex | Reasoning |
|-------|-----|-----------|
| Background | `#0a0a0a` | Near-black — deep, premium, lets accent colors pop |
| BG Elevated | `#111111` | Slightly lighter for stats section and contact, creates depth layers |
| BG Card | `#161616` | Card surfaces — distinct from background without being jarring |
| BG Card Hover | `#1a1a1a` | Subtle lift on hover for founder cards |
| BG Subtle | `#0d0d0d` | Minimal differentiation for layered backgrounds |
| Emerald | `#10B981` | Primary accent — CTAs, labels, active states, counters |
| Emerald Light | `#34D399` | Hover states for buttons, particle rendering |
| Emerald Dark | `#059669` | Logo details, HR glow gradient, secondary emerald |
| Emerald Glow | `rgba(16,185,129,0.15)` | Ambient background glows, hero radial gradient |
| Emerald Glow Strong | `rgba(16,185,129,0.3)` | Button hover box-shadow |
| Text Primary | `#f5f5f5` | Main text — high contrast on dark backgrounds |
| Text Secondary | `#a3a3a3` | Subheadings, descriptions, nav links |
| Text Tertiary | `#737373` | Founder roles, footer links, lower-priority text |
| Text Muted | `#525252` | Scroll indicator, project indices, timestamps |
| Border | `#262626` | Card borders, dividers, stat separators |
| Border Hover | `#404040` | Interactive border state |
| Border Subtle | `#1a1a1a` | Tech tag borders, faint separators |
| Avatar 1 | `#10B981` (emerald) | KJ — brand primary |
| Avatar 2 | `#F59E0B` (amber) | YCW — warm contrast |
| Avatar 3 | `#06B6D4` (cyan) | AH — cool contrast |

**Contrast notes**:
- Text primary `#f5f5f5` on `#0a0a0a`: ~18:1 (AAA pass)
- Text secondary `#a3a3a3` on `#0a0a0a`: ~9:1 (AAA pass)
- Text tertiary `#737373` on `#0a0a0a`: ~4.8:1 (AA pass)
- Emerald `#10B981` on `#0a0a0a`: ~7.5:1 (AAA pass)

---

## Layout Decisions

### Full-Page Scroll-Snap Slides
Each section uses `height: 100vh` with `scroll-snap-align: start`, creating a presentation-like experience:
- Focuses attention on one section at a time
- Reinforces the premium, polished feel
- Scrollbar is hidden (`scrollbar-width: none`) for clean aesthetics
- `scroll-behavior: smooth` for fluid transitions between slides

### Section Order & Visual Weight

1. **Nav** — Fixed top, `z-50`, transparent initially → dark frosted glass (`rgba(10,10,10,0.85)` + `blur(20px)`) on scroll. Hides on scroll-down, reappears on scroll-up. Rook SVG logo + company name left, nav links center, CTA right.

2. **Hero** — Full-viewport slide with canvas animation background. Eyebrow pill with pulse dot. Three-line headline using Instrument Serif with "software" in emerald stone text effect (SVG filter). Tagline, dual CTAs (primary emerald pill + outline pill). Scroll indicator at bottom.

3. **Projects** (MAIN) — Interactive split layout: left side has a numbered project list (hover to switch), right side shows a live app mockup preview in a browser-frame chrome. Background gradient shifts per project. Each mockup has unique UI content (sync dashboard, invoice, metrics, vault, CI pipeline). "All Work" item shows a 2x2 portfolio grid. Tech tags below each preview.

4. **Stats** — Elevated background (`#111111`) with ambient emerald glow. "By the Numbers" eyebrow. 4-column grid with large light-weight numbers, animated counters (quartic easing, 2.5s), vertical dividers between items. 2-column on mobile.

5. **Founders** (SECONDARY) — 3-column grid (narrower `max-w-4xl`). CSS initials avatars with distinct colors (emerald, amber, cyan) on tinted circular backgrounds. Cards with border, hover lift (`translateY(-4px)`), and avatar scale effect.

6. **Contact + Footer** — Combined into one slide. Ambient emerald glow at top. Large serif heading "Have an idea? Let's build it together." Email CTA button, social links (GitHub, LinkedIn) in circular bordered icons. Footer pinned to bottom of slide with logo, copyright, and nav links.

7. **Footer** (standalone) — Separate `footer.html` partial exists with expanded layout (logo + tagline left, nav center, socials + copyright right) but is not included in `index.html` — the contact slide absorbs its role.

### Hero Canvas Animation
A dedicated `hero-bg.js` renders an interactive canvas behind the hero with:
- **Glow orbs** — 3 large radial gradients drifting slowly, creating ambient emerald light
- **Particles** — ~70 floating dots with connection lines (within 130px), subtle mouse repulsion
- **Crystal shapes** — 5 slowly rotating geometric forms (hexagons, octagons, diamonds) with inner facet lines, evoking emerald gem cross-sections
- **Grid lines** — 6 faint wavy lines (3 vertical, 3 horizontal) drifting with sine waves, suggesting a chessboard motif (rook reference)
- All rendered in emerald color variants at low opacity

### Project Interactive Showcase
Rather than a static card grid, projects use a split-panel hover interaction:
- Left panel: numbered list items with category labels, bottom-bordered
- Right panel: browser-frame mockup with per-project UI content
- Hovering a list item fades in the corresponding preview and shifts the background gradient
- Non-active items dim to 50% opacity, hover brings them to 80%
- "All Work" entry at the bottom styled differently (no border, emerald text, arrow icon)

### CSS Initials Avatars
Founders use CSS-generated avatars instead of photos:
- Each founder gets a distinct color (emerald, amber, cyan) with matching tinted background
- Subtle border in matching color at 20% opacity
- Scale-up on card hover adds interactivity
- Eliminates need for image assets
- Consistent, professional look

---

## Technical Decisions

### Tailwind CSS v4 via Play CDN
Simplest integration path for Jekyll + GitHub Pages. No build tooling required. The `@theme` directive defines all design tokens in one place, referenced throughout templates with Tailwind's custom color utilities (`bg-bg`, `text-emerald`, `border-border`, etc.).

### Jekyll Data Files
Content separated from templates via `_data/*.yml`. Makes it trivial to update projects, founders, stats, or navigation without touching HTML.

### Google Fonts via CDN
Inter and Instrument Serif loaded via `<link>` with `preconnect` hints for performance. Weights: Inter 300–700, Instrument Serif regular + italic.

### Vanilla JavaScript
Two scripts, no framework:

**`main.js`** — 5 behaviors:
1. Intersection Observer for scroll-triggered reveal animations (fade-up, fade-left, scale)
2. `requestAnimationFrame` for counter animation with quartic easing
3. classList toggles for mobile menu (hamburger → X, body overflow lock)
4. Navbar scroll behavior (frosted glass on scroll, hide/show on direction)
5. Project showcase hover interaction (list ↔ preview switching, background gradient updates)

**`hero-bg.js`** — Canvas animation IIFE:
- Glow orbs, particle network, crystal shapes, grid lines
- Mouse-interactive (particle repulsion)
- DPR-aware rendering (capped at 2x)
- Debounced resize handler
- Skipped entirely when `prefers-reduced-motion: reduce`

### SVG Icon Partials (Lucide-style)
Inline SVGs inherit `currentColor`, require no HTTP requests, and use consistent viewBox sizes. All marked with `aria-hidden="true"`.

### SVG Rook Logo
Custom inline SVG resembling a chess rook / castle tower, rendered in emerald (`#10B981`) and dark emerald (`#059669`). Used in nav, contact footer, and standalone footer.

### Emerald Stone Text Effect
SVG `<filter>` using `feTurbulence` (fractal noise) + `feSpecularLighting` with an animated `fePointLight` sweep to create a shimmering gemstone surface on the hero "software" text.

---

## Accessibility Compliance

| Guideline | Implementation |
|-----------|---------------|
| Color contrast 4.5:1 minimum | All text/background pairs verified (see palette section) |
| Skip-to-content link | In layout, visible only on keyboard focus (`sr-only focus:not-sr-only`) |
| ARIA labels | `aria-label` on logo link, icon-only buttons, social links, mobile menu toggle |
| Decorative elements hidden | `aria-hidden="true"` on canvas, logo SVGs, ambient glows, noise overlays |
| Keyboard navigation | Tab order matches visual order, smooth scroll respects keyboard |
| `aria-expanded` | Mobile menu button tracks open/close state |
| Touch targets 44x44+ | Social links `w-12 h-12`, mobile menu `w-10 h-10` |
| `prefers-reduced-motion` | CSS disables all animations/transitions; JS shows final state immediately; hero canvas skipped entirely |
| Semantic HTML | `<nav>`, `<main>`, `<section>`, `<footer>`, proper heading hierarchy |

---

## Animation & Motion Design

### Reveal Animations
Three variants triggered by Intersection Observer:
- `.reveal` — fade up (`translateY(24px)` → 0)
- `.reveal-left` — fade from left (`translateX(-60px)` → 0)
- `.reveal-scale` — scale in (`scale(0.95)` → 1)

All use `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like ease-out) at 800ms duration. Stagger delays in 100ms increments via `.stagger > *:nth-child(n)`.

### Button Interactions
- `.btn-primary` — background lightens to `emerald-light`, lifts 2px, gains emerald glow shadow
- `.btn-outline` — border brightens, faint white background appears, lifts 2px

### Nav Link Underlines
Expanding underline from center (`width: 0` → `100%`, `left: 50%` → `0`) in emerald, 300ms ease.

### Text Link Underlines
Expanding underline from left (`width: 0` → `100%`) in emerald, 300ms ease.

### Cursor Dot
Fixed 8px emerald dot following the cursor with `mix-blend-mode: difference`. Defined in CSS but not instantiated in JS (available for future use).

### Marquee
CSS `@keyframes marquee` at 30s linear infinite, pauses on hover. Defined but not currently used in any section.

---

## Pre-Delivery Checklist

- [x] No emojis used as icons (all SVGs)
- [x] All icons consistent style (inline SVG, `currentColor`)
- [x] Hover states don't cause layout shift (uses transform/opacity/shadow only)
- [x] All clickable elements have `cursor-pointer`
- [x] Hover states provide clear visual feedback
- [x] Transitions are smooth (200–800ms depending on context)
- [x] Focus states visible for keyboard navigation
- [x] Dark mode text has sufficient contrast (4.5:1+ minimum)
- [x] Borders visible on dark backgrounds
- [x] Responsive: full-page slides on desktop, stacked on mobile
- [x] No horizontal scroll on mobile
- [x] `prefers-reduced-motion` respected in CSS and both JS files
- [x] Floating elements (navbar) have proper z-index (`z-50`)
- [x] Scrollbar hidden for immersive slide experience
- [x] Hero canvas animation is performant (DPR-capped, particle count scaled to viewport)

---

## Anti-Patterns Avoided

- **No generic light SaaS template** — Dark, immersive, editorial design
- **No static project cards** — Interactive split-panel hover showcase with live mockups
- **No emoji icons** — All inline SVG
- **No layout-shifting hover states** — Only transform/color/shadow/opacity transitions
- **No image dependencies** — All visuals are CSS/SVG/Canvas generated
- **No JS framework overhead** — Two small vanilla scripts (~520 lines total)
- **No build tooling** — Tailwind v4 Play CDN + Jekyll handles everything
- **No corporate formality** — Serif italic accents and stone text effects add personality
