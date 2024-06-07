Array.prototype.last = function() {
    return this[this.length - 1];
}


// * class of mouse cursor
const config = {
    currentLanguage: 'en',
}
class Cursor {
    constructor() {
        this.target = { x: 0.5, y: 0.5 }; // * coordinates of old cursor
        this.cursor = { x: 0.5, y: 0.5 }; // * coordinates of new cursor
        this.speed = 1; // * speed of new cursor
        this.cursorElement = document.getElementById('cursor');
        this.scroll = window.scrollY;
        this.init();
    }
    init() {
        // window.addEventListener("mousemove",(e) => this.onMouseMove(e));
        window.addEventListener("pointermove",(e) => this.onMouseMove(e));

        document.querySelectorAll('a').forEach((e) => {
            e.addEventListener('mouseenter', (e) => this.onLinkHover(e))
            e.addEventListener('mouseout', (e) => this.onLinkOut(e))
        });

        document.querySelectorAll('p, h1, h2, h3, h4, h5, span, strong').forEach((e) => {
            e.addEventListener('mouseenter', (e) => this.onTextHover(e))
            e.addEventListener('mouseout', (e) => this.onTextOut(e))
        })

        this.raf = requestAnimationFrame(() => this.render());
    }

    onMouseMove(e) {
        this.target.x = e.clientX / window.innerWidth  - ((this.cursorElement.offsetWidth / 2) / window.innerWidth);
        this.target.y = e.clientY / window.innerHeight - ((this.cursorElement.offsetHeight / 2) / window.innerHeight);
        if (!this.raf) this.raf = requestAnimationFrame(() => this.render());
    }
    onLinkHover(e) {
        this.cursorElement.style.display = 'none';
        e.target.classList.add('link-hover');
    }

    onLinkOut(e) {
        this.cursorElement.style.display = '';
        e.target.classList.remove('link-hover');
        e.target.classList.add('link-hover-out');
        setTimeout(() => {
            e.target.classList.remove('link-hover-out');
        }, 400)
    }

    onTextHover(e) {

    }

    onTextOut(e) {

    }

    render() {
        const lerp = (a, b, n) => (1 - n) * a + n * b;
        this.cursor.x = lerp(this.cursor.x, this.target.x, this.speed);
        this.cursor.y = lerp(this.cursor.y, this.target.y, this.speed);
        document.documentElement.style.setProperty("--cursor-x", this.cursor.x * window.innerWidth + 'px');
        document.documentElement.style.setProperty("--cursor-y", this.cursor.y * window.innerHeight + 'px');
        const delta = Math.sqrt(
            Math.pow(this.target.x - this.cursor.x, 2) +
            Math.pow(this.target.y - this.cursor.y, 2)
        );
        if (delta < 0.001) {
            cancelAnimationFrame(this.raf);
            this.raf = null;
            return;
        }

        this.raf = requestAnimationFrame(() => this.render());
    }
}

const cursor = new Cursor();

const textConfig = [
    {
        en: 'make you a website'
    },
    {
        en: 'do a work'
    },
    {
        en: 'animate tesdt tyoy'
    },
    {
        en: 'testing value'
    },
    {
        en: 'lorem ipsum 123'
    },
]

class TextInputHandler {
    constructor(values, inputContainer, isRemove = true, speed = 0.6, height = 40) {
        this.values = values;
        this.speed = speed;
        this.inputContainer = inputContainer;
        this.defaultText = this.inputContainer.innerHTML;
        this.isRemove = isRemove;
        this.height = height;

        this.init();
    }

    init() {
        this.insertText();
        this.createTextCursor();
    }

    destroy() {
        cancelAnimationFrame(this.raf);
        this.raf = null;
        clearTimeout(this.timeout);
        this.timeout = null;
    }

    createTextCursor() {
        this.inputContainer.classList.add('text-cursor', 'text-cursor-active');
        this.inputContainer.style.setProperty("--height-cursor", this.height + 'px');
    }
    getRandomValue() {
        return this.values[Math.floor(Math.random() * this.values.length)];
    }

    getRandomSpeed() {
        return Math.floor(100 + Math.random() * (400 + 1 - 100));
    }

    insertText(textArray) {
        this.inputContainer.classList.remove('text-cursor-active');
        if (!textArray) {
            textArray = (' ' + this.getRandomValue()[config.currentLanguage]).split('')
        }
        if (textArray.length > 0) {
            this.inputContainer.innerHTML += textArray.shift();
            this.timeout = setTimeout(() => {
                this.raf = requestAnimationFrame(() => this.insertText(textArray))
            }, this.getRandomSpeed() * this.speed)
        } else {
            this.inputContainer.classList.add('text-cursor-active');
            if (this.isRemove) {
                setTimeout(() => {
                    this.removeText();
                }, 2500)
            }
            cancelAnimationFrame(this.raf);
        }
    }

    removeText() {
        this.inputContainer.classList.remove('text-cursor-active');
        if (this.inputContainer.innerHTML === this.defaultText) {
            this.inputContainer.classList.add('text-cursor-active');
            setTimeout(() => {
                this.insertText();
            }, 1500)
            cancelAnimationFrame(this.raf);
        } else {
            this.inputContainer.innerHTML = this.inputContainer.innerHTML.slice(0, -1)
            setTimeout(() => {
                this.raf = requestAnimationFrame(() => this.removeText())
            }, this.getRandomSpeed() * this.speed)
        }
    }
}

const main = new TextInputHandler(textConfig, document.querySelector('#main-section h1'))


const skillElements = document.querySelectorAll('.skill');

if (skillElements) {
    skillElements.forEach((e) => {
        e.style.setProperty('--fill-percent', `${e.dataset['percent']}%`)
    })
}

const cvElem = document.querySelector('#cv-main');

cvElem.addEventListener('click', () => {
    cvElem.classList.toggle('active');
    cvElem.style.setProperty('--element-width', `${e.offsetWidth}px`)

})

// const handleScroll = () => {
//     window.scrollTo(0, 0);  // required when scroll bar is drgged
// }
//
// window.addEventListener('scroll', handleScroll, { passive: false });
//
// let isAnimationScroll = false;
// let handleEvent = function(e) {
//     e.preventDefault();      // disables scrolling by mouse wheel and touch move
//     if (e.deltaY && !isAnimationScroll) {
//         const currentSection = document.querySelector('.current-section');
//         if (!currentSection) return;
//         if (e.deltaY >= 0) {
//             if (!currentSection.nextSibling || currentSection.nextElementSibling.tagName !== 'SECTION') return;
//             currentSection.classList.add('section-top-hide');
//
//             const nextEl =  currentSection.nextElementSibling;
//
//             nextEl.classList.add('current-section', 'section-bottom');
//             isAnimationScroll = true;
//             setTimeout(() => {
//                 isAnimationScroll = false;
//                 currentSection.classList.remove('section-top-hide', 'current-section');
//                 nextEl.classList.remove('section-bottom');
//             }, 1400);
//
//         } else {
//             if (!currentSection.previousElementSibling || currentSection.previousElementSibling.tagName !== 'SECTION') return;
//             currentSection.classList.add('section-bottom-hide');
//
//             const prevEl = currentSection.previousElementSibling;
//
//             prevEl.classList.add('current-section', 'section-top');
//             isAnimationScroll = true;
//             setTimeout(() => {
//                 isAnimationScroll = false;
//                 currentSection.classList.remove('section-bottom-hide', 'current-section');
//                 prevEl.classList.remove('section-top');
//             }, 1400);
//         }
//     }
// };
//
// /*
//  Disable Scroll and do screen scroll
//  */
//
// window.addEventListener('scroll', handleEvent, { passive: false });
// window.addEventListener('mousewheel', handleEvent, { passive: false });
// window.addEventListener('touchmove', handleEvent, { passive: false });

class ScrollController {
    constructor(element) {
        this.element = element;
        this.isAnimationScroll = false;
        this.currentSection = document.querySelector('.current-section');
        this.nextEl = document.querySelector('.current-section').nextElementSibling;
        this.prevEl = document.querySelector('.current-section').previousElementSibling;
        this.status = 'active';
        this.activationCounter = 0;
        this.init();
    }

    init() {
        this.element.addEventListener('scroll', this.blockSidebarScroll, { passive: false });
        this.element.addEventListener('scroll', (e) => this.scrollHandler(e), { passive: false });
        this.element.addEventListener('mousewheel', (e) => this.scrollHandler(e), { passive: false });
        this.element.addEventListener('touchmove', (e) => this.scrollHandler(e), { passive: false });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Control') this.pauseScroll();
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'Control') this.resumeScroll();
        })


    }

    blockSidebarScroll() {
        if (this.status !== 'active') return;
        this.element.scrollTo(0, 0);  // required when scroll bar is drgged
    }

    scrollHandler(e) {
        if (this.status !== 'active') return;
        e.preventDefault();
        if (!e.deltaY || this.isAnimationScroll) return;
        if (e.deltaY >= 0) {
            if (!this.nextEl || this.nextEl.tagName !== 'SECTION') return;
            this.scrollClassesHandler('next', 'section-top-hide', 'section-bottom');
        } else {
            if (!this.prevEl || this.prevEl.tagName !== 'SECTION') return;
            this.scrollClassesHandler('prev', 'section-bottom-hide', 'section-top');
        }
    }

    updateCurrentSection() {
        this.currentSection = document.querySelector('.current-section');
        this.nextEl = this.currentSection.nextElementSibling;
        this.prevEl = this.currentSection.previousElementSibling;

        if (this.currentSection.classList.contains('scroll-pause')) {
            this.pauseScroll();
        } else if (this.status === 'pause') {
            this.resumeScroll();
        }
    }

    scrollClassesHandler(type, classHide, classDisplay) {
        this.currentSection.classList.add(classHide);
        this.currentSection.classList.remove('current-section');
        const current = type === 'next' ? this.nextEl : this.prevEl;
        current.classList.add('current-section', classDisplay);

        this.isAnimationScroll = true;
        this.updateCurrentSection();

        setTimeout(() => {
            const current = type === 'next' ? this.prevEl : this.nextEl;
            current.classList.remove(classHide);
            this.currentSection.classList.remove(classDisplay);
            this.isAnimationScroll = false;
        }, 1400);
    }

    scrollNext() {
        if (!this.nextEl || this.nextEl.tagName !== 'SECTION') return;
        this.scrollClassesHandler('next', 'section-top-hide', 'section-bottom');
    }

    scrollPrev() {
        if (!this.prevEl || this.prevEl.tagName !== 'SECTION') return;
        this.scrollClassesHandler('prev', 'section-bottom-hide', 'section-top');
    }

    pauseScroll() {
        this.status = 'pause';
    }

    resumeScroll(isPausedActivation = false, e = null) {
        if (isPausedActivation) {
            if (e && e.deltaY < 4) {
                this.activationCounter += 0.1;
            } else {
                this.activationCounter += 1;
            }
            if (this.activationCounter > 4) {
                this.status = 'active';
                this.activationCounter = 0;
            }
        } else {
            this.status = 'active';
        }
    }
}

const scrollController = new ScrollController(window);




class ProjectScroll {
    constructor(scrollEl, element) {
        this.scrollEl = scrollEl;
        this.el = element;
        this.init();
        this.scroll = 0;
    }

    init() {
        this.scrollEl.addEventListener('mousewheel', (e) => this.controller(e));
    }

    controller(e) {
        if (scrollController.isAnimationScroll) return;
        this.el.style.setProperty('--duration', `${e.deltaY / 5}ms`);
        if (this.scroll + e.deltaY >= 0) {
            if (this.scroll + e.deltaY <= this.el.offsetHeight - 370) {
                this.scroll += e.deltaY;
                this.el.style.setProperty('--mt', `-${this.scroll}px`);
            } else {
                scroll = this.el.offsetHeight - 370;
                this.el.style.setProperty('--mt', `-${this.scroll}px`);
            }
        } else {
            this.scroll = 0;
            this.el.style.setProperty('--mt', `-${this.scroll}px`);
        }
    }
    updateEl(newEl) {
        this.el.classList.remove('active-content');
        newEl.classList.add('active-content');
        this.el = newEl;
        this.el.style.setProperty('--mt', `0`);
        this.scroll = 0;
    }
}

const mainProject = new ProjectScroll(document.querySelector('#work-section'), document.querySelector('.project .content'));
//
// const workSection = document.querySelector('#work-section');
// let scroll = 0;
// const content = document.querySelector('.project .content');
// workSection.addEventListener('mousewheel', (e) => {
//     if (scrollController.currentSection.id === 'work-section') {
//         scrollController.pauseScroll();
//     } else {
//         scrollController.resumeScroll(true, e)
//     }
//     if (e.deltaY < 4) {
//         content.style.setProperty('--duration', `.03s`);
//     }
//     if (scroll + e.deltaY >= 0) {
//         if (scroll + e.deltaY <= content.offsetHeight - 370) {
//             scroll = scroll + e.deltaY;
//             content.style.setProperty('--mt', `-${scroll}px`);
//         } else {
//             scrollController.resumeScroll(true, e);
//             scroll = content.offsetHeight - 370;
//             content.style.setProperty('--mt', `-${scroll}px`);
//         }
//     } else {
//         scrollController.resumeScroll(true, e);
//         scroll = 0;
//         content.style.setProperty('--mt', `-${scroll}px`);
//     }
// })

// window.addEventListener('resize', () => {
//     scroll = 0;
//     content.style.setProperty('--mt', `-${scroll}px`);
// })

// document.querySelectorAll('.up').forEach((e) => {
//     e.addEventListener('click', () => scrollController.scrollPrev());
// })
//
// document.querySelectorAll('.down').forEach((e) => {
//     e.addEventListener('click', () => scrollController.scrollNext());
// })
// document.querySelectorAll('.projects-picker > a').forEach((e) => {
//     e.addEventListener('click', (el) => {
//         document.querySelector('.projects-picker > a.active').classList.remove('active');
//         const target = el.target;
//         target.classList.add('active');
//         document.querySelectorAll('.project-info > .active').forEach(e => e.classList.remove('active'))
//         document.querySelectorAll(`.project-info > *[data-id="${target.dataset['id']}"]`).forEach(e => e.classList.add('active'));
//         mainProject.updateEl(document.querySelector(`.content[data-id="${target.dataset['id']}"]`));
//     })
// })

const projectsSlider = new Swiper('.project-picker', {
    loop: true,
    slidesPerView: 1,
    centeredSlides: true,
    initialSlide: 1,
    effect: "creative",
    creativeEffect: {
        prev: {
            shadow: true,
            translate: [0, 0, -800],
            rotate: [180, 0, 0],
        },
        next: {
            shadow: true,
            translate: [0, 0, -800],
            rotate: [-180, 0, 0],
        },
    },

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
})

const descriptions = [
    {
        en: ' 0Lorem ipsum dolor sit amet. Et molestiae repellat sit eius nobis eum velit rerum. Sed rerum tempora qui recusandae iure aut autem illo ab fugit saepe et voluptatem voluptatibus non excepturi quisquam. Et atque dolor aut consequatur maiores aut omnis fugiat aut autem blanditiis eos rerum consequuntur.\n' +
            '\n' +
            '                Qui amet sint At culpa numquam At libero aspernatur qui similique quae quo explicabo aliquam et porro corporis vel quaerat enim. Ab aperiam consequatur cum architecto dignissimos ea corporis facilis id quos sapiente ut fuga molestias est voluptas veniam. Qui maiores voluptate ea accusamus numquam vel voluptate labore nam quia molestias a voluptas minus est minima omnis et rerum quasi!\n' +
            '\n' +
            '                Eos voluptatem enim qui necessitatibus distinctio ut Quis veritatis est itaque ve'
    },
    {
        en: ' 10Lorem ipsum dolor sit amet. Et molestiae repellat sit eius nobis eum velit rerum. Sed rerum tempora qui recusandae iure aut autem illo ab fugit saepe et voluptatem voluptatibus non excepturi quisquam. Et atque dolor aut consequatur maiores aut omnis fugiat aut autem blanditiis eos rerum consequuntur.\n' +
            '\n' +
            '                Qui amet sint At culpa numquam At libero aspernatur qui similique quae quo explicabo aliquam et porro corporis vel quaerat enim. Ab aperiam consequatur cum architecto dignissimos ea corporis facilis id quos sapiente ut fuga molestias est voluptas veniam. Qui maiores voluptate ea accusamus numquam vel voluptate labore nam quia molestias a voluptas minus est minima omnis et rerum quasi!\n' +
            '\n' +
            '                Eos voluptatem enim qui necessitatibus distinctio ut Quis veritatis est itaque ve'
    },
    {
        en: ' 20Lorem ipsum dolor sit amet. Et molestiae repellat sit eius nobis eum velit rerum. Sed rerum tempora qui recusandae iure aut autem illo ab fugit saepe et voluptatem voluptatibus non excepturi quisquam. Et atque dolor aut consequatur maiores aut omnis fugiat aut autem blanditiis eos rerum consequuntur.\n' +
            '\n' +
            '                Qui amet sint At culpa numquam At libero aspernatur qui similique quae quo explicabo aliquam et porro corporis vel quaerat enim. Ab aperiam consequatur cum architecto dignissimos ea corporis facilis id quos sapiente ut fuga molestias est voluptas veniam. Qui maiores voluptate ea accusamus numquam vel voluptate labore nam quia molestias a voluptas minus est minima omnis et rerum quasi!\n' +
            '\n' +
            '                Eos voluptatem enim qui necessitatibus distinctio ut Quis veritatis est itaque ve'
    },
    {
        en: ' 30Lorem ipsum dolor sit amet. Et molestiae repellat sit eius nobis eum velit rerum. Sed rerum tempora qui recusandae iure aut autem illo ab fugit saepe et voluptatem voluptatibus non excepturi quisquam. Et atque dolor aut consequatur maiores aut omnis fugiat aut autem blanditiis eos rerum consequuntur.\n' +
            '\n' +
            '                Qui amet sint At culpa numquam At libero aspernatur qui similique quae quo explicabo aliquam et porro corporis vel quaerat enim. Ab aperiam consequatur cum architecto dignissimos ea corporis facilis id quos sapiente ut fuga molestias est voluptas veniam. Qui maiores voluptate ea accusamus numquam vel voluptate labore nam quia molestias a voluptas minus est minima omnis et rerum quasi!\n' +
            '\n' +
            '                Eos voluptatem enim qui necessitatibus distinctio ut Quis veritatis est itaque ve'
    },
    {
        en: ' 40Lorem ipsum dolor sit amet. Et molestiae repellat sit eius nobis eum velit rerum. Sed rerum tempora qui recusandae iure aut autem illo ab fugit saepe et voluptatem voluptatibus non excepturi quisquam. Et atque dolor aut consequatur maiores aut omnis fugiat aut autem blanditiis eos rerum consequuntur.\n' +
            '\n' +
            '                Qui amet sint At culpa numquam At libero aspernatur qui similique quae quo explicabo aliquam et porro corporis vel quaerat enim. Ab aperiam consequatur cum architecto dignissimos ea corporis facilis id quos sapiente ut fuga molestias est voluptas veniam. Qui maiores voluptate ea accusamus numquam vel voluptate labore nam quia molestias a voluptas minus est minima omnis et rerum quasi!\n' +
            '\n' +
            '                Eos voluptatem enim qui necessitatibus distinctio ut Quis veritatis est itaque ve'
    },
    {
        en: ' 50Lorem ipsum dolor sit amet. Et molestiae repellat sit eius nobis eum velit rerum. Sed rerum tempora qui recusandae iure aut autem illo ab fugit saepe et voluptatem voluptatibus non excepturi quisquam. Et atque dolor aut consequatur maiores aut omnis fugiat aut autem blanditiis eos rerum consequuntur.\n' +
            '\n' +
            '                Qui amet sint At culpa numquam At libero aspernatur qui similique quae quo explicabo aliquam et porro corporis vel quaerat enim. Ab aperiam consequatur cum architecto dignissimos ea corporis facilis id quos sapiente ut fuga molestias est voluptas veniam. Qui maiores voluptate ea accusamus numquam vel voluptate labore nam quia molestias a voluptas minus est minima omnis et rerum quasi!\n' +
            '\n' +
            '                Eos voluptatem enim qui necessitatibus distinctio ut Quis veritatis est itaque ve'
    }
]

let descriptionCursor = null;

projectsSlider.on('slideChange', (e) => {
    const index = e.realIndex;

    document.querySelector('.project-info.current').classList.remove('current');

    if (descriptionCursor) descriptionCursor.destroy();

    const newEl = document.querySelector(`.project-info[data-project="${index}"]`);
    const newElDescriptionEl = newEl.querySelector('.project-description');

    newElDescriptionEl.innerHTML = '';


    descriptionCursor = new TextInputHandler([{
        en: descriptions[index][config.currentLanguage],
    }], newElDescriptionEl, false, 0.1, 20)

    newEl.classList.add('current');

})

