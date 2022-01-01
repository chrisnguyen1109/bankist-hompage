const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const header = $('.header');
const nav = $('.nav');
const navLinks = $('.nav__links');

const btnShowModal = $$('.btn--show-modal');
const btnCloseModal = $('.btn--close-modal');
const btnScrollTo = $$('.btn--scroll-to');
const btnSliderLeft = $('.slider__btn--left');
const btnSliderRight = $('.slider__btn--right');

const modal = $('.modal');
const overlay = $('.overlay');

const allSecions = $$('.section');
const operationsTabContainer = $('.operations__tab-container');
const lazyImgs = $$('.lazy-img');

const allSlides = $$('.slide');
const dots = $('.dots');

const navHeight = nav.getBoundingClientRect().height;
const sliderLength = allSlides.length - 1;

let currentSlide = 0;

const goToSlide = slideNumber => {
    allSlides.forEach((slide, i) => {
        slide.style.transform = `translateX(${100 * (i - slideNumber)}%)`;
    });

    $('.dots__dot--active')?.classList.remove('dots__dot--active');
    $(`.dots__dot[data-slide='${slideNumber}']`).classList.add('dots__dot--active');
};

const nextSlide = () => {
    currentSlide === sliderLength ? (currentSlide = 0) : currentSlide++;
    goToSlide(currentSlide);
};

const prevSlide = () => {
    currentSlide === 0 ? (currentSlide = sliderLength) : currentSlide--;
    goToSlide(currentSlide);
};

const creatDots = () => {
    allSlides.forEach((_, i) => {
        dots.insertAdjacentHTML(
            'beforeend',
            `<button class="dots__dot" data-slide="${i}"></button>`
        );
    });

    $$('.dots__dot').forEach(dot => {
        dot.addEventListener('click', e => {
            goToSlide(e.target.dataset.slide);
        });
    });
};

const closeModal = () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

const scrollTo = e => {
    const id = e.target.dataset.scrollTo;
    id && $(`${id}`).scrollIntoView({ behavior: 'smooth' });
};

const handleHover = (opacity, e) => {
    if (e.target.classList.contains('nav__link')) {
        const logo = $('.nav__logo');

        $$('.nav__link').forEach(link => {
            if (link !== e.target) link.style.opacity = opacity;
        });

        logo.style.opacity = opacity;
    }
};

const init = () => {
    creatDots();
    goToSlide(currentSlide);
};

const stickyNav = entries => {
    const [entry] = entries;

    entry.isIntersecting ? nav.classList.remove('sticky') : nav.classList.add('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

const revealSection = (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

allSecions.forEach(section => {
    section.classList.add('section--hidden');
    sectionObserver.observe(section);
});

const loadImg = (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () => {
        entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
};

const lazyImgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
});

lazyImgs.forEach(img => lazyImgObserver.observe(img));

btnShowModal.forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    });
});

overlay.addEventListener('click', closeModal);

btnCloseModal.addEventListener('click', closeModal);

navLinks.addEventListener('click', e => {
    e.preventDefault();

    if (e.target.classList.contains('nav__link')) scrollTo(e);
});

btnScrollTo.forEach(btn => {
    btn.addEventListener('click', scrollTo);
});

operationsTabContainer.addEventListener('click', e => {
    const operationsTab = e.target.closest('.operations__tab');

    if (operationsTab) {
        $('.operations__tab--active').classList.remove('operations__tab--active');
        $('.operations__content--active').classList.remove('operations__content--active');

        operationsTab.classList.add('operations__tab--active');
        const dataTab = operationsTab.dataset.tab;
        $(`.operations__content--${dataTab}`).classList.add('operations__content--active');
    }
});

nav.addEventListener('mouseover', handleHover.bind(nav, 0.5));

nav.addEventListener('mouseout', handleHover.bind(nav, 1));

btnSliderRight.addEventListener('click', nextSlide);

btnSliderLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'Escape':
            !modal.classList.contains('hidden') && closeModal();
            break;
        case 'ArrowLeft':
            prevSlide();
            break;
        case 'ArrowRight':
            nextSlide();
            break;
    }
});

init();

// window.addEventListener('scroll', () => {
//     const section1Top = $('#section--1').getBoundingClientRect().top;

//     section1Top <= 0 ? nav.classList.add('sticky') : nav.classList.remove('sticky');
// });
