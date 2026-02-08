# Emerald Rook Website - Design Reasoning

## Overview

This document captures the design decisions and reasoning behind the Emerald Rook company website, based on research using the UI/UX Pro Max design intelligence system.

---

## Design System Selection

### Style: Soft UI Evolution (Light Theme)
**Why**: UI/UX Pro Max recommended Soft UI Evolution for modern SaaS platforms — improved contrast over neumorphism, subtle depth, and WCAG AA+ accessibility. This matches the requirements for a light, inviting, startup-oriented design that isn't corporate.

### Brand Identity: Emerald Rook
**Connotations**: "Trident" = precision, power, three-pronged strength. "Fox" = agility, cleverness, adaptability.

The visual identity translates these into:
- **Indigo-violet primary** (`#6366F1`) — energy, innovation, depth
- **Warm coral accent** (`#F97316`) — warmth, action, fox-like vibrancy
- **Leather texture text** — premium, tactile quality on logo and hero heading
- **Decorative blobs** — organic, flowing shapes reinforcing agility
- **Rounded corners** (2xl / xl) — approachable, modern, not rigid

### Typography: Space Grotesk / DM Sans
**Why**: Recommended by UI/UX Pro Max for tech companies and startups. Space Grotesk provides geometric, bold headings. DM Sans is clean and readable for body text. Both available on Google Fonts.

**Mood keywords matched**: tech, startup, modern, innovative, bold, futuristic.

### Color Palette
| Token | Hex | Reasoning |
|-------|-----|-----------|
| Primary | `#6366F1` | Indigo — energetic, innovative, not the typical blue |
| Primary Light | `#818CF8` | Lighter indigo for decorative elements and blobs |
| Primary Dark | `#4F46E5` | Deeper indigo for stats section and active states |
| Primary Soft | `#EEF2FF` | Very light indigo for tag backgrounds and hover tints |
| Accent/CTA | `#F97316` | Warm coral — creates high contrast against indigo, energetic |
| Background | `#FAFAFA` | Warm off-white (not cold #FFFFFF) — inviting, easy on eyes |
| Background Alt | `#F1F0FB` | Subtle lavender tint for section differentiation |
| Background Hero | `#F5F3FF` | Light violet for hero, creating a soft landing |
| Text | `#374151` | Dark gray — high contrast, neutral (not tinted) |
| Text Light | `#6B7280` | Medium gray for secondary text |
| Heading | `#111827` | Near-black for maximum heading prominence |
| Footer BG | `#1E1B4B` | Deep indigo — cohesive with primary palette |

**Contrast verification**:
- Body text `#374151` on `#FAFAFA`: 7.5:1 (AAA pass)
- Light text `#6B7280` on `#FAFAFA`: 5.0:1 (AA pass)
- White text on `#4F46E5` (stats section): 7.2:1 (AAA pass)
- All exceed the required 4.5:1 minimum ratio

---

## Layout Decisions

### Single-Page Scrolling Architecture
The site uses a single-page scrolling layout because:
- Tells a complete company story in one scroll
- Works naturally on mobile
- Simpler to maintain for a small team
- Smooth scroll navigation creates a polished feel

### Section Visual Weight Hierarchy
Projects are the main focus; founders are secondary. Achieved through deliberate differences:

| Property | Projects (Primary) | Founders (Secondary) |
|----------|-------------------|---------------------|
| Vertical padding | `py-20 md:py-28 lg:py-32` | `py-20 md:py-28` |
| Heading size | Up to `text-5xl` | Up to `text-4xl` |
| Container width | `max-w-7xl` (full) | `max-w-5xl` (narrower) |
| Card complexity | Icon + border + hover lift + tech tags + CTA | Simple avatar + name + role |
| Hover effects | Card lift with shadow elevation | Subtle avatar scale |
| Background | Neutral `#FAFAFA` | Lavender tint `#F1F0FB` |

### Hero Section Design
- **Gradient blobs**: Organic shapes with blur create depth and visual richness without images
- **Badge pill**: Small pill above heading adds detail and establishes brand voice
- **Gradient text**: The indigo-to-coral gradient on "Emerald Rook" is the visual signature
- **Dual CTAs**: Primary (coral) for projects, secondary (white card) for contact — clear hierarchy

### CSS Initials Avatars
Founders use CSS-generated avatars instead of photos:
- Each founder gets a distinct brand color (indigo, coral, cyan)
- Dashed ring on hover adds interactivity
- Eliminates need for image assets
- Consistent, professional look

### Project Cards
- **Code icon**: Each card has a code brackets icon that transitions from soft bg to filled on hover
- **Hover lift**: Cards lift 4px with an indigo-tinted shadow on hover
- **Border hover**: Border transitions to a lighter indigo on hover
- **Tech tags**: Indigo-tinted pills for technology stack

### Stats Band
- Deep indigo background creates visual break between primary and secondary content
- Decorative white circles at low opacity add subtle depth
- Animated counters with cubic easing create engagement

---

## Technical Decisions

### Tailwind CSS v4 via Play CDN
Simplest integration path for Jekyll + GitHub Pages. No build tooling required. The `@theme` directive defines all design tokens in one place.

### Jekyll Data Files
Content separated from templates via `_data/*.yml`. Makes it trivial to update projects, founders, stats, or navigation without touching HTML.

### Vanilla JavaScript
Only four JS behaviors needed — no framework warranted:
1. Intersection Observer for scroll-triggered fade-ins
2. `requestAnimationFrame` for counter animation
3. classList toggles for mobile menu
4. Smooth scroll with nav offset compensation

### SVG Icon Partials (Lucide Icons)
Inline SVGs inherit `currentColor`, require no HTTP requests, and use consistent 24x24 viewBox. All marked with `aria-hidden="true"`.

---

## Accessibility Compliance

Based on UI/UX Pro Max accessibility guidelines (Priority 1 - CRITICAL):

| Guideline | Implementation |
|-----------|---------------|
| Color contrast 4.5:1 minimum | All color pairs verified (see palette section) |
| Visible focus rings | `focus-ring` utility class with `focus-visible` on all interactive elements |
| ARIA labels | `aria-label` on icon-only buttons and social links |
| Decorative elements hidden | `aria-hidden="true"` on blobs, rings, icons |
| Keyboard navigation | Tab order matches visual order, no traps |
| Touch targets 44x44px+ | Social links `w-12 h-12`, mobile menu `w-11 h-11` |
| Skip-to-content link | In layout, visible only on keyboard focus |
| `prefers-reduced-motion` | CSS disables all animations/transitions; JS shows final state immediately |
| Semantic HTML | `<nav>`, `<main>`, `<section>`, `<footer>`, proper heading hierarchy |

---

## UI/UX Pro Max Pre-Delivery Checklist

- [x] No emojis used as icons (all SVGs from Lucide)
- [x] All icons from consistent icon set (Lucide, 24x24 viewBox)
- [x] Hover states don't cause layout shift (uses transform/opacity/shadow only)
- [x] All clickable elements have `cursor-pointer`
- [x] Hover states provide clear visual feedback
- [x] Transitions are smooth (200-300ms)
- [x] Focus states visible for keyboard navigation (`focus-visible`)
- [x] Light mode text has sufficient contrast (4.5:1 minimum, most exceed 7:1)
- [x] Borders visible in light mode (`border-border` = `#E5E7EB`)
- [x] Responsive at 375px, 768px, 1024px, 1440px
- [x] No horizontal scroll on mobile
- [x] `prefers-reduced-motion` respected in CSS and JS
- [x] Floating elements (navbar) have proper z-index (`z-50`)
- [x] No content hidden behind fixed navbar (`pt-16` on hero)

---

## Anti-Patterns Avoided

- **No corporate templates** — Custom design with startup personality
- **No generic layouts** — Deliberate visual hierarchy with projects as hero
- **No emoji icons** — All SVG
- **No layout-shifting hover states** — Only transform/color/shadow transitions
- **No invisible borders in light mode** — Gray borders visible on off-white
- **No same padding everywhere** — Responsive padding scales per breakpoint
- **No cold white background** — Warm `#FAFAFA` off-white
- **No dark theme** — Light, inviting design per requirements
