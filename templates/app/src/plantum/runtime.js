import { components } from './components.js';

export function mountComponent(def, host, inputs = {}) {
    if (!def || !def.templateUrl) {
        throw new Error("Invalid component definition.");
    }

    const instance = {
        host,
        inputs,
        state: def.state ? def.state() : {},
        component: def,
        _isFirstRender: true,
        update() {
            return loadText(def, def.templateUrl)
                .then(html => {
                    host.innerHTML = interpolate(html, this.state);

                    applyStyle(def, def.styleUrl);
                    bindEvents(host, def, this);

                    if (this._isFirstRender) {
                        def.onRender?.(this);
                        this._isFirstRender = false;
                    } else {
                        def.onUpdate?.(this);
                    }

                    const schedule = typeof queueMicrotask === 'function'
                        ? queueMicrotask : fn => Promise.resolve().then(fn);

                    schedule(() => {
                        mountAllComponents();
                    });

                    return this;
                });
        }
    }

    def.onInit?.(instance);

    host.__plantumInstance = instance;

    return instance.update().then(() => {
        def.onMount?.(instance);
        return instance;
    });
}

function mountAllComponents() {
    const defs = components.getAll ? components.getAll() : [];

    const mounts = [];

    for (const def of defs) {
        const selector = (def.selector || '')
            .toLowerCase()
            .trim();

        if (!selector) {
            continue;
        }

        var hosts = document.querySelectorAll(selector);

        hosts.forEach(host => {
            if (host.__plantumInstance) {
                return;
            }

            mounts.push(mountComponent(def, host));
        });
    }

    return Promise.all(mounts);
}

function resolveUrl(def, relativePath) {
    if (!def.__url__) {
        return relativePath;
    }

    const base = new URL(def.__url__, window.location.origin);
    const resolved = new URL(relativePath, base);

    return resolved.pathname + resolved.search + resolved.hash;
}

function interpolate(html, state) {
    return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) =>
        state[key] ?? ""
    );
}

function bindEvents(host, def, ctx) {
    host.querySelectorAll("[data-click]").forEach(el => {
        const method = el.getAttribute("data-click");
        if (method && typeof def[method] === "function") {
            el.addEventListener("click", () => def[method](ctx));
        }
    });
}

function applyStyle(def, styleUrl) {
    if (!styleUrl) return;

    const href = resolveUrl(def, styleUrl);

    const selector = def.selector.toLowerCase();

    const existing = document.head.querySelector(selector
        ? `link[data-plantum-style-for="${selector}"]` : `link[href="${href}"]`);

    if (existing) {
        return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;

    if (selector) {
        link.setAttribute("plantum-style-for", selector);
    }

    document.head.appendChild(link);
}

function loadText(def, relativePath) {
    const url = resolveUrl(def, relativePath);

    return fetch(url).then(res => {
        if (!res.ok) {
            throw new Error(`Failed to load template: ${url}`);
        }
        return res.text();
    });
}

export const Plantum = {
    defineComponent(def) {
        components.register(def);
    },

    bootstrap(rootComponent, otherComponents = []) {
        if (rootComponent) {
            components.register(rootComponent);
        }

        if (Array.isArray(otherComponents)) {
            otherComponents.forEach(def => {
                if (def) {
                    components.register(def);
                }
            });
        }

        const start = () => {
            mountAllComponents();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', start, { once: true });
        } else {
            start();
        }
    },

    mountAll() {
        return mountAllComponents();
    }
};