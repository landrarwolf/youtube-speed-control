const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class EventTargetStub {
    constructor() {
        this.listeners = new Map();
    }

    addEventListener(type, listener) {
        this.listeners.set(type, [...(this.listeners.get(type) || []), listener]);
    }

    removeEventListener(type, listener) {
        this.listeners.set(type, (this.listeners.get(type) || []).filter(item => item !== listener));
    }

    dispatch(type, event = {}) {
        event.target ||= this;
        for (const listener of this.listeners.get(type) || []) {
            listener.call(this, event);
        }
    }
}

class ElementStub extends EventTargetStub {
    constructor(tagName = 'DIV') {
        super();
        this.tagName = tagName;
        this.style = {};
        this.attributes = {};
        this.children = [];
        this.isContentEditable = false;
        this.parentNode = null;
        this.parentElement = null;
    }

    appendChild(child) {
        child.parentNode = this;
        child.parentElement = this;
        this.children.push(child);
    }

    removeChild(child) {
        this.children = this.children.filter(item => item !== child);
        child.parentNode = null;
        child.parentElement = null;
    }

    remove() {
        this.parentNode?.removeChild(this);
    }

    closest() {
        return this.closestEditable ? this : null;
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }
}

function loadUserscript() {
    let now = 0;
    let nextTimerId = 1;
    const timers = new Map();
    const video = new ElementStub('VIDEO');
    Object.assign(video, { playbackRate: 1.25, currentTime: 10, duration: 12 });
    const document = new EventTargetStub();
    Object.assign(document, {
        body: new ElementStub('BODY'),
        fullscreenElement: null,
        hidden: false,
        createElement: tag => new ElementStub(tag.toUpperCase()),
        querySelector: selector => selector === 'video' ? video : null
    });
    const window = new EventTargetStub();
    const mediaQuery = new EventTargetStub();
    mediaQuery.matches = false;
    window.matchMedia = () => mediaQuery;

    class FakeDate extends Date {
        static now() {
            return now;
        }
    }

    const context = {
        window,
        document,
        Element: ElementStub,
        navigator: { language: 'en-US' },
        Date: FakeDate,
        Number,
        console,
        requestAnimationFrame: callback => callback(),
        setTimeout(callback, delay) {
            const id = nextTimerId++;
            timers.set(id, { callback, due: now + delay });
            return id;
        },
        clearTimeout(id) {
            timers.delete(id);
        }
    };

    vm.runInNewContext(
        fs.readFileSync(new URL('../youtube-speed-control.user.js', `file://${__filename}`), 'utf8'),
        context
    );

    return {
        document,
        window,
        video,
        advance(milliseconds) {
            now += milliseconds;
            for (const [id, timer] of [...timers]) {
                if (timer.due <= now) {
                    timers.delete(id);
                    timer.callback();
                }
            }
        }
    };
}

function arrowEvent(target, overrides = {}) {
    return {
        key: 'ArrowRight',
        target,
        repeat: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        prevented: false,
        stopped: false,
        preventDefault() { this.prevented = true; },
        stopImmediatePropagation() { this.stopped = true; },
        ...overrides
    };
}

{
    const app = loadUserscript();
    const input = new ElementStub('INPUT');
    const event = arrowEvent(input);
    app.document.dispatch('keydown', event);
    app.advance(250);
    assert.equal(event.prevented, false, 'text inputs must keep their arrow key');
    assert.equal(app.video.playbackRate, 1.25);
}

{
    const app = loadUserscript();
    const body = new ElementStub('DIV');
    const down = arrowEvent(body);
    app.document.dispatch('keydown', down);
    app.advance(100);
    const up = arrowEvent(body);
    app.document.dispatch('keyup', up);
    assert.equal(app.video.currentTime, 12, 'quick taps seek five seconds and clamp to duration');
    assert.ok(down.prevented && down.stopped && up.prevented && up.stopped);
}

{
    const app = loadUserscript();
    const body = new ElementStub('DIV');
    app.document.dispatch('keydown', arrowEvent(body));
    app.advance(200);
    assert.equal(app.video.playbackRate, 2.5);
    app.window.dispatch('blur');
    assert.equal(app.video.playbackRate, 1.25, 'window blur must restore the previous speed');
}

console.log('userscript behavior checks passed');
