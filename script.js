/* =============================================
   SaúdePlena — Landing Page Script
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Header scroll effect ---------- */
    const header = document.getElementById('header');
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile menu ---------- */
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('mainNav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* ---------- Smooth scroll for anchor links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = header.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ---------- Intersection Observer — animate on scroll ---------- */
    const animateEls = document.querySelectorAll('[data-animate]');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        animateEls.forEach(el => observer.observe(el));
    } else {
        // Fallback: just show everything
        animateEls.forEach(el => el.classList.add('visible'));
    }

    /* ---------- Counter animation ---------- */
    const counters = document.querySelectorAll('[data-count]');
    let counterStarted = false;

    const animateCounters = () => {
        if (counterStarted) return;
        counterStarted = true;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10);
            const duration = 2000;
            const start = performance.now();

            const update = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out quad
                const eased = 1 - (1 - progress) * (1 - progress);
                const current = Math.round(eased * target);
                counter.textContent = current.toLocaleString('pt-BR');

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };
            requestAnimationFrame(update);
        });
    };

    // Trigger counters when numbers section is visible
    const numerosSection = document.getElementById('numeros');
    if (numerosSection && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        counterObserver.observe(numerosSection);
    }

    /* ---------- FAQ Accordion ---------- */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-item__question');
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked (if it was closed)
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ---------- Form handling ---------- */
    const form = document.getElementById('quoteForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const tipoCliente = document.getElementById('tipoCliente').value;
        const tipoPlano = document.getElementById('tipoPlano').value;
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();

        // Basic validation
        if (!tipoCliente || !tipoPlano || !nome || !email || !telefone) {
            showFormMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Por favor, insira um e-mail válido.', 'error');
            return;
        }

        // Success feedback
        showFormMessage(`Olá ${nome}, agradecemos por preencher as informações solicitadas. Um de nossos representantes parceiros entrará em contato para apresentar a proposta ideal para você.`, 'success');
        form.reset();
    });

    function showFormMessage(text, type) {
        // Remove existing message
        const existing = form.querySelector('.form-message');
        if (existing) existing.remove();

        const msg = document.createElement('div');
        msg.className = `form-message form-message--${type}`;
        msg.textContent = text;
        msg.style.cssText = `
            padding: 14px 20px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 16px;
            text-align: center;
            animation: fadeInUp .4s ease;
            ${type === 'success'
                ? 'background: #e6f9ef; color: #008a47; border: 1px solid #b6e9cc;'
                : 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'
            }
        `;
        form.appendChild(msg);

        // Remove after a few seconds
        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transition = 'opacity .4s ease';
            setTimeout(() => msg.remove(), 400);
        }, 5000);
    }

    /* ---------- Phone mask ---------- */
    const phoneInput = document.getElementById('telefone');
    phoneInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);

        if (v.length > 6) {
            v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
        } else if (v.length > 2) {
            v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        } else if (v.length > 0) {
            v = `(${v}`;
        }
        e.target.value = v;
    });
});

/* Utility animation keyframe (injected via JS for the form message) */
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);
