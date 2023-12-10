
// * class of mouse cursor
const config = {
    currentLanguage: 'en',
}
class Cursor {
    constructor() {
        this.target = { x: 0.5, y: 0.5 }; // * coordinates of old cursor
        this.cursor = { x: 0.5, y: 0.5 }; // * coordinates of new cursor
        this.speed = 0.07; // * speed of new cursor
        this.cursorElement = document.getElementById('cursor');
        this.init();
    }
    init() {
        window.addEventListener("mousemove",(e) => this.onMouseMove(e));
        document.querySelectorAll('a').forEach((e) => {
            e.addEventListener('mouseenter', (e) => this.onLinkHover(e))
            e.addEventListener('mouseout', (e) => this.onLinkOut(e))
        });
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
    constructor(values, inputContainer) {
        this.values = values;
        this.speed = 0.6;
        this.inputContainer = inputContainer;
        this.defaultText = this.inputContainer.innerHTML;
        this.init();
    }

    init() {
        this.insertText();
        this.createTextCursor();
    }

    createTextCursor() {
        this.inputContainer.classList.add('text-cursor', 'text-cursor-active')
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
            textArray = (' '+ this.getRandomValue()[config.currentLanguage]).split('')
        }
        if (textArray.length > 0) {
            this.inputContainer.innerHTML += textArray.shift();
            setTimeout(() => {
                this.raf = requestAnimationFrame(() => this.insertText(textArray))
            }, this.getRandomSpeed() * this.speed)
        } else {
            this.inputContainer.classList.add('text-cursor-active');
            setTimeout(() => {
                this.removeText();
            }, 2500)
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
