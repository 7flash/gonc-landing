// ─── Nav scroll effect ──────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 60);
    lastScroll = scrollY;
}, { passive: true });

// ─── Scroll-reveal for sections ─────────────────────────
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger animations within a group
            const parent = entry.target.closest('.features-grid, .stack-grid, .steps');
            if (parent) {
                const siblings = Array.from(parent.querySelectorAll('.feature-card, .stack-item, .step'));
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${idx * 0.08}s`;
            }
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section-header, .feature-card, .step, .stack-item, .cta-card').forEach(el => {
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
