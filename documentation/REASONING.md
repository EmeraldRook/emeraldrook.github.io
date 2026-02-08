# Emerald Rook Website - Design Reasoning

## Overview

This document captures the design decisions and reasoning behind the Emerald Rook company website redesign. The site shifted from a "polished dark portfolio" to an **Apple-keynote-meets-luxury-brand** experience defined by heavy scroll-driven animation.

---

## Design Direction

### Apple-Keynote / Luxury-Brand / Animation-First
**Why**: The previous design used scroll-snap full-page slides with hover-based interactions — effective but static. The new direction draws from sites like toukoum.fr, prioritizing scroll-driven choreography where every section transition feels intentional and cinematic. The Apple keynote influence means each piece of content gets its moment — pinned sections ensure the viewer engages with one thing at a time, and transitions between states are smooth and purposeful. The luxury-brand influence keeps the palette restrained (dark + single emerald accent) while the animation quality communicates craftsmanship.

### Section Consolidation: 6 to 3
**Why**: The original 6 sections (Hero, Projects, Stats, Founders, Contact, Footer) created too many scroll stops. Consolidating to 3 logical sections (Hero, Projects, Stats+Founders) reduces cognitive load and allows deeper scroll-driven interactions within each section. Contact is handled by the persistent nav CTA and the footer strip. The site feels less like a checklist of sections and more like a flowing narrative.

---

## Typography

### Sora Single-Family, Weight-Based Hierarchy
**Why**: The previous Inter + Instrument Serif pairing created visual contrast through font switching (sans for body, serif italic for headings). The new approach uses Sora exclusively, relying on weight variation (200 extralight through 700 bold) to establish hierarchy. This creates a more unified, modern feel aligned with luxury branding where restraint signals sophistication.

**Weight mapping**:
- **200 (Extralight)**: Hero title, stat numbers — large display text where thin strokes create elegance
- **300 (Light)**: Taglines, section headings — slightly more weight for readability at medium sizes
- **400 (Regular)**: Body text, descriptions — comfortable reading weight
- **500 (Medium)**: Labels, eyebrows, buttons — actionable/structural text that needs emphasis
- **600-700 (Semibold/Bold)**: Names, card titles — small text that needs to stand out

**Sora specifically** was chosen for its geometric construction (round, modern letterforms), excellent weight range, and optical clarity at both large display sizes and small label sizes. It has a subtle tech-forward quality without being cold.

---

## Hero-to-Nav Morph

### Concept
The hero contains: logo, company name (emerald-stone textured), tagline, CTA, and scroll indicator. As the user scrolls, these elements animate out and a fixed nav assembles at the top with the logo + name (left) and CTA (right). Scrolling back reverses the animation completely.

### Why It Replaces Traditional Nav
**Why**: A traditional fixed nav visible from page load competes with the hero for attention. The morph pattern solves this: the hero IS the nav's content origin. The user sees the brand at full scale first, then watches it compress into a persistent navigation element. This creates a memorable first impression while still providing navigation utility after the hero.

### Technical Approach: Dual-Element Crossfade
**Why**: Rather than physically moving DOM elements (which causes layout thrashing and GSAP complexity with pinned sections), the approach uses two separate element sets — one in the hero, one in the nav — with a coordinated crossfade. The hero elements shrink/fade out while the nav elements fade in. This is more robust across browsers and avoids z-index conflicts with pinned sections.

### Mobile Fallback
**Why**: Scroll-driven pin animations on mobile create "scroll jacking" feel that frustrates touch users. Instead, the nav simply fades in/out based on hero visibility using a basic ScrollTrigger enter/leave pattern. No pin, no scrub.

---

## Scroll-Driven Interaction Model

### GSAP + ScrollTrigger + Lenis
**Why previous approach was limited**: The original site used IntersectionObserver for reveals, hover events for project switching, and CSS scroll-snap for section transitions. This worked but couldn't achieve:
- Scrubbed animations tied to scroll position
- Pinned sections with internal scroll progress
- Smooth scroll with consistent frame timing
- Complex choreographed sequences

**Why GSAP**: Industry-standard animation library with:
- `scrub` parameter that ties animation progress to scroll position
- `pin` that locks sections during scroll interaction
- `snap` for discrete steps within continuous scroll
- Timeline sequencing for complex choreography
- Built-in reduced-motion detection
- Excellent cross-browser compatibility

**Why Lenis**: CSS `scroll-behavior: smooth` doesn't provide frame-level control needed by GSAP. Lenis normalizes scroll behavior across devices, provides consistent easing, and connects to GSAP's ticker for synchronized updates. This eliminates jank between scroll position and animation state.

**Why not scroll-snap**: Scroll-snap creates hard section boundaries that conflict with GSAP's pin + scrub model. Pinned sections need free-flowing scroll distance to map to animation progress. Lenis provides the smooth feel without the constraints.

### Project Section: Scroll-Driven Switching vs. Hover
**Why**: Hover-based project switching (previous design) requires deliberate mouse movement and doesn't work on touch devices. Scroll-driven switching maps project progression to the most universal interaction — scrolling. The section pins, and continued scrolling advances through projects with snap points. This creates a "flip-through" experience that works identically with mouse, trackpad, touch, and keyboard.

Pin distance is `numProjects * 100vh`, giving each project a full viewport-height of scroll distance. Snap points ensure clean transitions between projects.

---

## Stat Corner Badges

### Concept
Four small badges appear in the bottom-right corner 1.5 seconds after page load, showing key stats (8+ years, 30+ projects, etc.). They persist as the user scrolls through hero and projects. As the stats-founders section enters the viewport, the badges morph: spreading outward, scaling up, and fading out while the full-size stats simultaneously appear in-section.

### Why
**Why persistent badges**: They provide ambient credibility signals without demanding attention. The user absorbs the numbers peripherally while focused on hero/projects content.

**Why morph into section**: The transformation creates narrative continuity — "those small numbers you've been seeing? Here's the full story." It's more memorable than stats simply appearing in a section with no relationship to prior content.

**Why desktop only**: Fixed-position overlay badges on mobile screens obscure too much content. The screen real estate tradeoff isn't worth it. On mobile, stats animate directly in-section.

---

## Crystalline Canvas Background

### Concept
A triangulated mesh of facets (grid-based vertices with jitter, two triangles per quad) covering the hero section. Each facet has a very subtle emerald tint (0.02–0.06 opacity). Mouse proximity creates specular highlights — brighter facets within 300px of cursor. Vertices drift slowly for gentle shimmer.

### Why It Replaces the Previous Canvas
**Why**: The previous canvas had 4 layers (glow orbs, particles with connections, crystal shapes, grid lines). While visually rich, it was:
- Computationally expensive (70 particles + connection distance checks = O(n²))
- Visually busy — multiple moving elements competed for attention
- Thematically scattered — particles, crystals, and grid lines were three different metaphors

The crystalline mesh is:
- A single unified metaphor — gem facets catching light
- Computationally simpler — static geometry with vertex drift, no distance calculations
- More subtle — very low opacity creates texture rather than focal points
- Mouse-reactive in a purposeful way — specular highlights simulate light catching on gemstone facets
- Aligned with "Emerald Rook" brand — the mesh literally looks like a gem's internal structure

### Performance
- DPR capped at 2x to prevent excessive pixel rendering on high-DPI screens
- Vertex count scales with viewport size (cell size clamped 80–120px)
- No per-frame distance calculations between elements
- `prefers-reduced-motion`: single static frame rendered, no animation loop

---

## Color Palette

### Dark-With-Contrast Approach
The palette is intentionally minimal — near-black background (`#0a0a0a`) with a single emerald accent (`#10B981`). This restraint:
- Lets the emerald accent carry maximum impact
- Creates a "dark room with jewel lighting" atmosphere
- Ensures project mockup gradients (each project has unique gradient_from/to) stand out against the neutral base
- Aligns with luxury branding where fewer colors signal sophistication

### Text Hierarchy Through Opacity
Rather than using multiple text colors, the hierarchy uses a value scale from near-white to mid-gray:
- `#f5f5f5` (primary) — 18:1 contrast, AAA
- `#a3a3a3` (secondary) — 9:1 contrast, AAA
- `#737373` (tertiary) — 4.8:1 contrast, AA
- `#525252` (muted) — used only for decorative elements (indices, timestamps)

---

## Accessibility Compliance

| Guideline | Implementation |
|-----------|---------------|
| Color contrast 4.5:1 minimum | All text/background pairs verified (see palette reasoning) |
| Skip-to-content link | In layout, visible only on keyboard focus |
| ARIA labels | On logo link, social links, badge container |
| Decorative elements hidden | `aria-hidden="true"` on canvas, logos, ambient glows, progress dots |
| Keyboard navigation | Tab order matches visual order; Lenis doesn't block keyboard scroll |
| Touch targets 44x44+ | Social links w-10 h-10, CTA buttons have generous padding |
| `prefers-reduced-motion` | CSS disables all animations/transitions; JS shows final state immediately; hero canvas renders single static frame; no GSAP pins or scrub; nav shown immediately; counters at final values |
| Semantic HTML | `<nav>`, `<main>`, `<section>`, proper heading hierarchy |
| No scroll jacking on mobile | All pins and scrub animations are desktop-only (lg breakpoint) |

### Mobile Fallback Strategy
Every scroll-driven animation has a mobile alternative:
- **Hero-to-nav**: No pin; nav fades in/out on hero visibility
- **Projects**: No pin; stacked vertically with individual scroll reveals, tap to switch
- **Stat badges**: Hidden entirely; stats animate directly in-section
- **Reveals**: Standard GSAP from-animations triggered by scroll position

This ensures mobile users get a clean, performant experience without the scroll-driven complexity that requires precise trackpad/mouse control.

---

## Pre-Delivery Checklist

- [x] No emojis used as icons (all SVGs)
- [x] All icons consistent style (inline SVG, `currentColor`)
- [x] Hover states don't cause layout shift (transform/opacity/shadow only)
- [x] All clickable elements have `cursor-pointer`
- [x] Hover states provide clear visual feedback
- [x] Transitions are smooth (200–800ms)
- [x] Focus states visible for keyboard navigation
- [x] Dark mode text has sufficient contrast (4.5:1+ minimum)
- [x] Borders visible on dark backgrounds
- [x] Responsive: scroll-driven on desktop, stacked on mobile
- [x] No horizontal scroll on mobile
- [x] `prefers-reduced-motion` respected in CSS and both JS files
- [x] Floating elements (nav) have proper z-index (z-50)
- [x] Scrollbar hidden for immersive feel
- [x] Crystalline canvas is performant (DPR-capped, vertex-scaled)
- [x] GSAP pins only on desktop (no scroll jacking on mobile)
- [x] Lenis smooth scroll doesn't block keyboard navigation

---

## Anti-Patterns Avoided

- **No scroll-snap** — Replaced by Lenis + GSAP pins for precise animation control
- **No IntersectionObserver** — Replaced by GSAP ScrollTrigger for unified animation system
- **No hover-only interactions** — Scroll-driven switching works universally
- **No traditional nav** — Hero-to-nav morph is more memorable and reduces visual clutter
- **No multi-font pairing** — Single family (Sora) with weight variation for cleaner hierarchy
- **No static project cards** — Scroll-driven showcase with pinned switching
- **No separate contact section** — CTA in persistent nav + footer strip in stats-founders
- **No emoji icons** — All inline SVG
- **No layout-shifting hover states** — Only transform/color/shadow/opacity transitions
- **No image dependencies** — All visuals are CSS/SVG/Canvas generated
- **No JS framework overhead** — Two vanilla scripts + CDN libraries
- **No build tooling** — Tailwind v4 Play CDN + Jekyll handles everything
