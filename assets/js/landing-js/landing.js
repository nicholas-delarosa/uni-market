// Todo lo que le da vida a la landing vive acá: el cambio de tema,
// el menú de móvil, el header que gana sombra al hacer scroll, la
// animación de entrada de las secciones y el carrusel de universidades.

const THEME_STORAGE_KEY = 'unimarket-theme';

function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    // El atributo data-theme ya se puso en el <head> antes de pintar
    // la página (para evitar el parpadeo), acá solo lo leemos.
    const applyState = (theme) => {
        toggle.setAttribute('aria-pressed', String(theme === 'dark'));
        toggle.setAttribute(
            'aria-label',
            theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
        );
    };

    applyState(document.documentElement.getAttribute('data-theme') || 'light');

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(THEME_STORAGE_KEY, next);
        applyState(next);
    });
}

function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Si el usuario hace clic en un link del menú móvil, lo cerramos
    // para no dejarlo abierto tapando el contenido de la sección.
    links.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            links.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function initHeaderShadow() {
    const header = document.querySelector('header');
    if (!header) return;

    const onScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // Si el navegador no soporta IntersectionObserver simplemente
    // mostramos todo de una vez, sin animación.
    if (!('IntersectionObserver' in window)) {
        items.forEach((item) => item.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
}

function initUniversitiesMarquee() {
    const marquee = document.getElementById('logoMarquee');
    const track = document.getElementById('logoTrack');
    if (!marquee || !track) return;

    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let autoScroll = true;
    let resumeTimeout = null;
    const speed = 0.25; // píxeles por frame

    // Duplicamos el contenido del track una vez más para que el
    // scroll automático pueda hacer loop sin que se note el corte.
    track.innerHTML += track.innerHTML;
    const halfWidth = () => track.scrollWidth / 2;

    function tick() {
        if (autoScroll && !isDown) {
            marquee.scrollLeft += speed;
            if (marquee.scrollLeft >= halfWidth()) {
                marquee.scrollLeft -= halfWidth();
            }
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    function startDrag(pageX) {
        isDown = true;
        autoScroll = false;
        marquee.classList.add('dragging');
        startX = pageX;
        startScroll = marquee.scrollLeft;
        clearTimeout(resumeTimeout);
    }

    function duringDrag(pageX) {
        if (!isDown) return;
        const delta = pageX - startX;
        marquee.scrollLeft = startScroll - delta;
    }

    function endDrag() {
        if (!isDown) return;
        isDown = false;
        marquee.classList.remove('dragging');
        resumeTimeout = setTimeout(() => {
            autoScroll = true;
        }, 1200);
    }

    marquee.addEventListener('mousedown', (event) => startDrag(event.pageX));
    window.addEventListener('mousemove', (event) => duringDrag(event.pageX));
    window.addEventListener('mouseup', endDrag);

    marquee.addEventListener('touchstart', (event) => startDrag(event.touches[0].pageX), {
        passive: true,
    });
    marquee.addEventListener('touchmove', (event) => duringDrag(event.touches[0].pageX), {
        passive: true,
    });
    marquee.addEventListener('touchend', endDrag);

    marquee.addEventListener('mouseenter', () => {
        autoScroll = false;
        clearTimeout(resumeTimeout);
    });
    marquee.addEventListener('mouseleave', () => {
        if (!isDown) autoScroll = true;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileNav();
    initHeaderShadow();
    initScrollReveal();
    initUniversitiesMarquee();
});