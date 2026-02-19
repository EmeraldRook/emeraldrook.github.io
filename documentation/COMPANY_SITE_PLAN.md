# Emerald Rook - Company Website Plan

## Context

Emerald Rook is a single-page company website deployed via GitHub Pages. Built with Jekyll, Tailwind CSS v4, GSAP + ScrollTrigger + Lenis, and vanilla JavaScript. The design direction is **Apple-keynote-meets-luxury-brand** with heavy scroll-driven animation: pinned sections, scroll-linked project switching, a hero that morphs into the nav, and persistent stat badges that transform into a full section. Typography uses a single sans family (Sora). Section count: 3 (Hero, Projects, Stats+Founders).

**Tagline**: "Rare by design"

---

## File Structure

```
./
  CLAUDE.md                           Project rules for Claude Code (pre-commit doc update)
  _config.yml                         Company variables (name, tagline, contact)
  index.html                          Single-page entry with include directives
  _layouts/
    default.html                      Full HTML shell, Tailwind v4 CDN, Sora font, GSAP/Lenis CDN, theme
  _includes/
    hero.html                         Full-height centered hero with canvas bg, logo, title, tagline, CTA
    stat-badges.html                  Fixed corner stat badges (desktop only, GSAP-animated)
    projects.html                     Scroll-driven project showcase with pin + scroll switching
    stats-founders.html               Merged stats grid + founders grid + footer strip
    icons/                            Inline SVG icon partials (Lucide)
  _data/
    projects.yml                      6 projects + 1 "All Work" meta item
    founders.yml                      3 founders (with initials field)
    stats.yml                         4 stat counters
  assets/
    js/main.js                        Lenis, GSAP ScrollTrigger, hero-to-nav, stat badges, project scroll, reveals
    js/hero-bg.js                     Crystalline triangulated mesh canvas animation
  documentation/
    COMPANY_SITE_PLAN.md              This file
    REASONING.md                      Design reasoning and decisions
```

### Deleted Files (from previous version)
- `_includes/nav.html` — Traditional nav removed; replaced by assembled-nav in default.html
- `_includes/stats.html` — Merged into stats-founders.html
- `_includes/founders.html` — Merged into stats-founders.html
- `_includes/contact.html` — No standalone contact; CTA in nav, footer in stats-founders
- `_includes/footer.html` — Already unused; footer now in stats-founders
- `_data/navigation.yml` — No nav links consumed anymore

---

## Design System

### Typography
| Token | Value | Usage |
|-------|-------|-------|
| Font Sans | Sora (200, 300, 400, 500, 600, 700) | All text — weight-based hierarchy |

No serif font. Single-family design.

### Typography Utility Classes
| Class | Properties | Usage |
|-------|-----------|-------|
| `.text-hero` | weight 200, clamp(3rem,8vw,8rem), line-height 0.95 | Hero company name |
| `.text-stat-number` | weight 200, clamp(3rem,5vw,4.5rem) | Stat counter numbers |
| `.text-label` | weight 500, 11px, uppercase, tracking 0.2em | Eyebrow labels, section labels |

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0a0a` | Main bg (near-black) |
| BG Elevated | `#111111` | Available for elevated surfaces (no longer used on stats-founders) |
| BG Card | `#161616` | Card surfaces |
| BG Card Hover | `#1a1a1a` | Card hover state |
| BG Subtle | `#0d0d0d` | Subtle layers |
| Emerald | `#10B981` | Primary accent — CTAs, labels |
| Emerald Light | `#34D399` | Button hover, highlights |
| Emerald Dark | `#059669` | Logo details, HR glow |
| Text Primary | `#f5f5f5` | Main text (18:1 contrast) |
| Text Secondary | `#a3a3a3` | Descriptions (9:1 contrast) |
| Text Tertiary | `#737373` | Roles, footer (4.8:1 contrast) |
| Text Muted | `#525252` | Indices, timestamps |
| Border | `#262626` | Dividers, card borders |
| Avatar KJ | `#10B981` | Emerald |
| Avatar YCW | `#F59E0B` | Amber |
| Avatar AH | `#06B6D4` | Cyan |

---

## Section Order & Architecture

### 1. Assembled Nav + Fixed Background Layers (in default.html)
- **Canvas mesh** (`#hero-canvas`): `position: fixed`, full viewport, rendered by `hero-bg.js`
- **Noise grain** (`#hero-noise`): `position: fixed`, full viewport, uses `.noise::after` pseudo-element
- Both use CSS `mask-image` (not opacity) for scroll fade + mouse flashlight effect: at hero, mask is `none` (fully visible); as `#projects-scroll-wrapper` enters viewport, ambient alpha fades 1→0; once faded, hovering the mouse reveals a soft 250px-radius spotlight at ~50% opacity via `radial-gradient`; mouse offscreen = uniform mask at ambient level; `-webkit-mask-image` included for Safari
- **Nav**: Fixed top, z-50, starts invisible (opacity-0, pointer-events-none)
- Populated by hero-to-nav GSAP animation
- Left: Rook SVG logo + emerald-stone-textured company name
- Right: "Get in Touch" CTA (mailto link)
- Frosted glass: rgba(10,10,10,0.85) + blur(20px)

### 2. Hero
- Full-viewport centered layout
- Rook SVG logo (64–80px)
- "Emerald Rook" in Sora extralight (weight 200) with emerald-stone-text SVG filter
- "Rare by design" tagline in Sora 400, text-secondary
- "Get in Touch" CTA btn-primary (mailto)
- Bouncing chevron scroll indicator at bottom
- **GSAP pin**: Hero pins for 100vh scroll distance, elements animate out → nav fades in
- **Canvas + noise are body-level fixed layers** (see Assembled Nav section) — not inside hero, to avoid GSAP pin transforms trapping `position: fixed`

### 3. Projects (Scroll-Driven)
- Wrapped in `#projects-scroll-wrapper` for GSAP pin distance
- **Transparent background** (no `bg-bg`) — fixed canvas mesh shows through and fades out via ScrollTrigger as section scrolls into view
- Split-panel layout: numbered list left, browser-frame mockup right
- GSAP ScrollTrigger pins section, `(numProjects - 1) * 80vh` pin distance (~80vh per transition)
- Scroll progress drives active project switching with snap (`scrub: 0.6`, `power2.inOut` ease, `duration: { min: 0.3, max: 0.6 }`)
- Project preview transitions use GSAP crossfade (opacity + scale, 0.4s `power2.inOut`) instead of instant class toggles
- Background gradient shifts per project (radial gradient at 40% opacity, crossfaded with GSAP)
- Progress dots on right edge (desktop)
- 4 projects: Transcribber, Foundation Flow, DevMetrics, All Work
- Mobile: no pin, stacked with scroll reveals

### 4. Stat Corner Badges (desktop only)
- 4 fixed-position badges in bottom-right corner
- Stagger-fade in 1.5s after page load
- Persist through hero + projects scrolling
- Morph/dissolve as stats-founders section approaches (spread out, scale up, fade)
- Canvas + noise fully faded out before this section (ScrollTrigger completes during projects)

### 5. Stats + Founders (merged section)
- **Transparent background** (no `bg-bg`) — allows fixed canvas/noise flashlight effect to show through
- **Stats grid**: "By the Numbers" eyebrow, 4-column grid, animated counters (quartic easing, 2.5s), vertical dividers
- **Emerald glow divider** (hr-glow)
- **Founders grid**: "Meet the founders" heading, 3 cards with CSS initials avatars (emerald, amber, cyan)
- **Footer strip**: Logo + name, GitHub/LinkedIn social links, copyright

---

## Technical Approach

- **Tailwind CSS v4** via Play CDN with `@theme` directive for design tokens
- **Google Fonts**: Sora (200–700) via `<link>` with preconnect hints
- **GSAP 3** + **ScrollTrigger** via CDN for all scroll-driven animations
- **Lenis** via CDN for smooth scroll, connected to GSAP ticker
- **Jekyll data files** (`_data/*.yml`) for all content
- **Liquid includes** for each section
- **Vanilla JS** (`main.js`): Lenis init, GSAP ScrollTrigger registration, hero-to-nav animation, stat badges, project scroll switching, stats-founders animations, general reveal triggers, resize handler
- **Canvas animation** (`hero-bg.js`): Faceted gemstone crystalline mesh — per-triangle pseudo-normals drive light/dark contrast between adjacent facets (emeraldDeep for dark-facing, emeraldBright for highlights), gradient fills near mouse cursor, dual-pass edge catch-lights, and phase-gated vertex glints. Emerald-only palette (5 colors). Base opacity 0.008–0.032 for subtlety; peak specular 0.22. Static frame rendered for `prefers-reduced-motion`. Canvas element lives in `default.html` body (not inside hero) to avoid GSAP pin transform containment. Mouse tracking is document-level (not hero-only) so specular/glint effects respond inside the flashlight spotlight after scrolling past hero
- **Hero→Projects transition + flashlight**: Fixed canvas + noise layers use CSS `mask-image` (with `-webkit-mask-image` for Safari) driven by ScrollTrigger scrubbed to `#projects-scroll-wrapper` (`start: 'top bottom'`, `end: 'top top'`). `ambientAlpha = 1 - scrollProgress` controls uniform visibility. When fully scrolled and mouse is active, a `radial-gradient(circle 250px at mouseX mouseY)` spotlight reveals mesh at `max(ambientAlpha, scrollProgress * 0.5)` center alpha (~50% when fully faded). Mouse offscreen = uniform mask at ambient level. During hero (`ambientAlpha >= 0.999`), mask set to `'none'` for zero overhead. Canvas opacity stays at 1 always
- **`prefers-reduced-motion`**: All content visible immediately, no animations, no pinning, nav shown, counters at final values
- **No IntersectionObserver** (replaced by GSAP ScrollTrigger)
- **No hamburger menu** (traditional nav removed)
- **No scroll-snap** (replaced by Lenis smooth scroll + GSAP pins)

---

## Verification

1. Run `bundle exec jekyll serve --livereload` locally
2. Hero: Centered logo, "Emerald Rook" in emerald texture (Sora 200), "Rare by design", CTA, bouncing chevron
3. Crystalline canvas: subtle mesh behind hero, mouse-reactive specular; after scrolling past hero, mouse spotlight reveals mesh at ~50% opacity in 250px radius; mouse offscreen hides mesh; scrolling back up restores full visibility seamlessly
4. Hero-to-Nav: scroll down → elements animate out → nav fades in; scroll back reverses
5. Projects: section pins on desktop, scrolling cycles through 6 projects with snap
6. Stat Badges: appear bottom-right after 1.5s, morph as stats section approaches
7. Stats+Founders: counters animate, founder cards stagger in, footer visible
8. Test breakpoints: 375px, 768px, 1024px, 1440px
9. `prefers-reduced-motion`: all content visible, no animations, no pinning
10. Keyboard: Tab through all interactive elements
11. No console errors, 60fps scroll performance
12. All aria-labels on icon-only links
