# GitMaps (gonc-web) Tasks & Ideas

## 🔴 Priority: Fix
- [ ] **GitHub link destination** — Verify `https://github.com/7flash/git-on-canvas` is the correct public repo URL. If it's private, update or hide the link.

## 🟡 Priority: Improve
- [ ] **Landing page SEO** — Add Open Graph meta tags, Twitter card, and a proper favicon for link previews.
- [ ] **Mobile responsive** — Large gradient text and floating code cards may render poorly on narrow viewports. Test and fix breakpoints.
- [ ] **Page load performance** — hero-demo.webp is 1.5MB. Add lazy loading, consider generating multiple sizes for srcset.
- [ ] **Cross-link the three pages** — Currently index, concepts, and pitch are deliberately unlinked. Consider adding subtle navigation between them for internal use.

## 🟢 Priority: Features
- [ ] **Live canvas embed** — Add an interactive mini-canvas demo on the landing page to prove the "infinite canvas" concept in-browser.
- [ ] **Video walkthrough** — Record a 30-second screen capture of the actual GitMaps app in action and embed as hero background.
- [ ] **Deploy to production** — Set up hosting (Vercel/Netlify/Caddy) for the static site. Currently only accessible on localhost:3456.

## 📝 Architecture Notes
- **Stack**: Pure HTML/CSS/JS — no framework, no build step
- **Pages**: `index.html` (landing), `concepts.html` (investor detail), `pitch.html` (live presentation slides)
- **Styling**: `styles.css` (44KB, shared across all pages)
- **JS**: `script.js` (3KB, smooth scroll + intersection observer animations)
- **Images**: `hero-demo.webp`, `hero.png`, `img-canvas.png`, `img-connections.png`, `img-detail.png`, `img-diff.png`
- **Dev server**: Served via Melina.js or simple HTTP server on port 3456
- **GitHub**: `https://github.com/7flash/git-on-canvas`
