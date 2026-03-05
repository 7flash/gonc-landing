# GitMaps (gonc-web) Tasks & Ideas

## 🔴 Priority: Fix
- [x] ~~**GitHub link destination**~~ — ✅ Verified. `https://github.com/7flash/git-on-canvas` is public and accessible. README shows "🪐 Git on Canvas" with features, keyboard shortcuts, and license.

## 🟡 Priority: Improve
- [x] ~~**Landing page SEO**~~ — ✅ DONE. Added OG meta, Twitter Card, theme-color, SVG favicon to all 3 pages (index, pitch, concepts).
- [x] ~~**Mobile responsive**~~ — ✅ Already has breakpoints at 768px (grid→1col, hide floating cards, collapse nav) and 480px (stack CTAs, single-col features). No action needed.
- [x] ~~**Page load performance**~~ — ✅ DONE. Converted all PNG screenshots to optimized WebP: img-canvas (914→30KB, 97%), img-connections (376→14KB, 96%), img-detail (629→58KB, 91%), img-diff (220→32KB, 85%). Total static image savings: **2,139→134KB**. Added `decoding="async"` + `width`/`height` attributes for CLS prevention across all 3 HTML pages. hero-demo.webp (1.5MB animated WebP, 77 frames) kept as-is since it's an animation — already has `loading="eager"` + `fetchpriority="high"`.
- [x] ~~**Cross-link the three pages**~~ — ✅ DONE. Added Deep Dive + Pitch to landing nav, Home + Pitch to concepts nav, Home + Deep Dive to pitch footer.
- [x] ~~**Canvas demo code examples**~~ — ✅ DONE. Replaced placeholder import/class stubs with realistic production-like code: server.ts (Hono API + middleware + auth guard), auth.ts (JWT verification middleware), database.ts (ORM table setup + structured logging), schema.ts (Zod validation schemas), logger.ts (structured logging). Added 5th connection line (database→logger). The demo now instantly communicates "this is a real codebase on a canvas."
- [x] ~~**Connection highlighting on hover**~~ — ✅ DONE. Hovering a file card in the live demo highlights its connections (solid glowing lines, bigger dots) while dimming unrelated cards (35% opacity, desaturated) and their connections (12% opacity). Uses `getConnectedIds()` helper + three CSS states (`cd-card--highlighted`, `cd-card--connected`, `cd-card--dimmed`) with smooth 0.25s transitions. Drag clears all highlights. SVG gets a brighter `connGlowBright` filter for active connections.
- [x] ~~**Pitch keyboard navigation**~~ — ✅ DONE. Arrow keys, Space, PgUp/PgDown, Home/End for slide-by-slide navigation. IntersectionObserver tracks current slide. Glassmorphic `1/11` counter badge in bottom-right. CSS scroll-snap for snappy transitions.

## 🟢 Priority: Features
- [x] ~~**Live canvas embed**~~ — ✅ DONE. Interactive mini-canvas demo on the landing page with 5 draggable file cards (app.ts, router.ts, canvas.ts, minimap.ts, types.ts), syntax-highlighted code, animated SVG connection lines between imports, live minimap with viewport indicator, grid background, pan/zoom via mouse/touch, pinch-zoom support, minimap click-to-navigate, staggered entrance animations, and responsive sizing (480/360/280px). Replaces the static img-canvas.png screenshot. `canvas-demo.js` (self-contained IIFE, ~350 lines).
- [ ] **Video walkthrough** — Record a 30-second screen capture of the actual GitMaps app in action and embed as hero background.
- [ ] **Deploy to production** — Set up hosting (Vercel/Netlify/Caddy) for the static site. Currently only accessible on localhost:3456.

## 📝 Architecture Notes
- **Stack**: Pure HTML/CSS/JS — no framework, no build step
- **Pages**: `index.html` (landing), `concepts.html` (investor detail), `pitch.html` (live presentation slides)
- **Styling**: `styles.css` (46KB, shared across all pages)
- **JS**: `script.js` (5KB, smooth scroll + pitch deck keyboard nav + intersection observer animations), `canvas-demo.js` (13KB, interactive canvas demo)
- **Images**: `hero-demo.webp`, `hero.png`, `img-canvas.png` (kept but no longer used on landing), `img-connections.png`, `img-detail.png`, `img-diff.png`
- **Dev server**: Served via Melina.js or simple HTTP server on port 3456
- **GitHub**: `https://github.com/7flash/git-on-canvas`

