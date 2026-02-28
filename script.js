// ─── Nav scroll effect ──────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── Scroll-reveal for sections ─────────────────────────
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px',
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Stagger animations within grid groups
            const parent = entry.target.closest('.dimensions-grid, .connections-explain');
            if (parent) {
                const selector = '.dimension-card, .conn-step';
                const siblings = Array.from(parent.querySelectorAll(selector));
                const idx = siblings.indexOf(entry.target);
                if (idx >= 0) {
                    entry.target.style.transitionDelay = `${idx * 0.08}s`;
                }
            }
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const revealSelectors = [
    '.section-header',
    '.nelson-quote',
    '.dimension-card',
    '.cta-card',
    '.connections-explain',
    '.conn-step',
    '.product-screenshot',
].join(', ');

document.querySelectorAll(revealSelectors).forEach(el => {
    revealObserver.observe(el);
});

// ─── Smooth anchor links ────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── Hero parallax subtle ───────────────────────────────
const heroGlow = document.querySelector('.hero-glow');
window.addEventListener('mousemove', (e) => {
    if (!heroGlow) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroGlow.style.transform = `translate(calc(-50% + ${x}px), ${y}px)`;
}, { passive: true });
