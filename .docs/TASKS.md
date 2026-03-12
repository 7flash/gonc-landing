# GitMaps (gonc-web) Tasks & Ideas

## 🔴 Priority: Fix
- [x] ~~**GitHub link destination**~~ — ✅ Verified. `https://github.com/7flash/git-on-canvas` is public and accessible.
- [x] ~~**Pitch deck broken styles**~~ — ✅ DONE. Added ~620 lines of CSS for pitch slides (scroll-snap, progress bar, feature grids, stat cards, agenda, bonus badge) and deep dive (concept blocks, analogy cards, insight callouts, nelson quotes, dimension chips, use-case grids).
- [x] ~~**Deep dive broken styles**~~ — ✅ DONE. Same CSS update covers concepts.html.
- [x] ~~**Pitch linked from nav**~~ — ✅ DONE. Removed pitch link from concepts.html nav. No links on index.html.

## 🟡 Priority: Improve
- [x] ~~**Landing page SEO**~~ — ✅ DONE. OG meta, Twitter Card, theme-color, SVG favicon on all 3 pages.
- [x] ~~**Mobile responsive**~~ — ✅ Has breakpoints at 900/768/600px. Added pitch/concepts responsive rules.
- [x] ~~**Page load performance**~~ — ✅ DONE. PNG→WebP conversion (2,139→134KB savings).
- [x] ~~**Cross-link the three pages**~~ — ✅ DONE.
- [x] ~~**Canvas demo code examples**~~ — ✅ DONE. Realistic production-like code in demo.
- [x] ~~**Connection highlighting on hover**~~ — ✅ DONE.
- [x] ~~**Pitch keyboard navigation**~~ — ✅ DONE. Arrow keys, Space, PgUp/PgDown.

## 🟢 Priority: Features
- [x] ~~**Live canvas embed**~~ — ✅ DONE. Interactive mini-canvas demo with draggable cards.
- [x] ~~**Deploy to production**~~ — ✅ DONE. Caddy + auto-TLS on 202.155.132.139.
- [ ] **ProductHunt launch post** — Prepare tagline, description, screenshots, and first comment for PH launch.
- [ ] **Video walkthrough** — Record 30-second screen capture of GitMaps in action.

## 📝 Architecture Notes
- **Stack**: Pure HTML/CSS/JS — no framework, no build step
- **Pages**: `index.html` (landing), `concepts.html` (deep dive), `pitch.html` (slide deck)
- **Styling**: `styles.css` (~2000 lines, shared across all pages)
- **JS**: `script.js` (scroll reveal + nav), `canvas-demo.js` (interactive canvas demo)
- **Dev server**: Simple HTTP or Melina.js
- **GitHub**: `https://github.com/7flash/git-on-canvas`
