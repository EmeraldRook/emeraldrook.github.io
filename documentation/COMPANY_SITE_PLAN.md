# Emerald Rook - Company Website Plan

## Context

Emerald Rook is a single-page company website deployed via GitHub Pages. Built with Jekyll, Tailwind CSS v4, and vanilla JavaScript, it showcases projects as the primary focus, company stats, founder profiles (secondary), and contact details.

**Design direction**: Light theme, indigo-violet primary + warm coral accent, modern & inviting startup feel (not corporate). Moderate motion (scroll animations, counter animations, hover effects). Typography: Space Grotesk (headings) / DM Sans (body). CSS initials avatars for founders.

---

## File Structure

```
D:\Development\PersonalWebsite\
  _config.yml                         Company variables (name, tagline, contact)
  index.html                          Single-page entry with include directives
  _layouts/
    default.html                      Full HTML shell, Tailwind v4 CDN, Google Fonts, theme
  _includes/
    nav.html                          Sticky nav with mobile hamburger menu
    hero.html                         Full-height hero with gradient text, tagline + dual CTAs
    projects.html                     7-card project grid with code icons (MAIN FOCUS)
    stats.html                        Animated stat counters on indigo background
    founders.html                     3 founder cards with CSS initials avatars
    contact.html                      Email CTA + GitHub/LinkedIn links
    footer.html                       Dark footer with logo mark + copyright
    icons/                            Inline SVG icon partials (Lucide)
  _data/
    navigation.yml                    Nav links
    projects.yml                      7 projects
    founders.yml                      3 founders (with initials field)
    stats.yml                         4 stat counters
  assets/
    js/main.js                        Scroll animations, counters, mobile menu, smooth scroll
```

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#6366F1` | Indigo accent, hover states, section labels |
| Primary Light | `#818CF8` | Decorative blobs, lighter accents |
| Primary Dark | `#4F46E5` | Stats section bg, active states |
| Primary Soft | `#EEF2FF` | Tag backgrounds, hover tints |
| Accent/CTA | `#F97316` | Coral CTA buttons, gradient text endpoint |
| Background | `#FAFAFA` | Main bg (warm off-white) |
| Background Alt | `#F1F0FB` | Founders section, subtle lavender tint |
| Background Hero | `#F5F3FF` | Hero section, light violet |
| Text | `#374151` | Body text (7.5:1 contrast on #FAFAFA) |
| Text Light | `#6B7280` | Secondary text (5.0:1 contrast) |
| Heading | `#111827` | Near-black headings |
| Footer BG | `#1E1B4B` | Deep indigo footer |
| Avatar 1 | `#6366F1` | KJ (indigo) |
| Avatar 2 | `#F97316` | YCW (coral) |
| Avatar 3 | `#06B6D4` | AH (cyan) |
| Font Heading | Space Grotesk | h1-h3, nav logo, stat numbers, avatars |
| Font Body | DM Sans | Body text, descriptions, labels |

---

## Section Order & Visual Weight

1. **Nav** - Fixed top, `z-50`, backdrop blur, logo mark + company name, shadow on scroll
2. **Hero** - `min-h-screen`, gradient blobs, badge pill, gradient text heading, dual CTAs (primary + secondary)
3. **Projects** (MAIN) - Largest padding, largest headings, full `max-w-7xl`, cards with code icons, hover lift effects + tech tags. Grid: 1col / 2col / 3col
4. **Stats** - Indigo background band, decorative circles, animated counters, 2col / 4col grid
5. **Founders** (SECONDARY) - CSS initials avatars (colored circles with dashed ring), smaller padding, narrower `max-w-5xl`
6. **Contact** - Email button + social icon links in bordered squares
7. **Footer** - Deep indigo, logo mark + company name left, copyright right

---

## Technical Approach

- **Tailwind CSS v4** via Play CDN (`@tailwindcss/browser@4`) with `@theme` directive for custom tokens
- **Google Fonts** via `<link>` with `preconnect` hints
- **Jekyll data files** (`_data/*.yml`) for all content
- **Liquid includes** for each section
- **Vanilla JS**: Intersection Observer for scroll animations, `requestAnimationFrame` for counter animation, classList toggles for mobile menu
- **`prefers-reduced-motion`** respected in both CSS and JS
- **CSS initials avatars** for founders (no images needed)

---

## Verification

1. Run `bundle exec jekyll serve --livereload` locally
2. Confirm all references say "Emerald Rook" (no "AGN Technology" remnants)
3. Verify founder avatars show styled initials (KJ, YCW, AH) in colored circles
4. Test all 4 breakpoints: 375px, 768px, 1024px, 1440px
5. Verify smooth scroll navigates to correct sections with nav offset
6. Verify counter animation triggers when stats section scrolls into view
7. Test mobile hamburger menu open/close and link navigation
8. Test keyboard navigation (Tab through all interactive elements)
9. Enable `prefers-reduced-motion: reduce` and verify no animations play
10. Verify all hover states have smooth transitions and `cursor-pointer`
11. Verify contact links point to emeraldrook placeholders
