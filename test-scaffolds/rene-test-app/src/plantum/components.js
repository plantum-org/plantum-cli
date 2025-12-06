const _components = new Map();

function nonrmalizeSelector(selector) {
    return String(selector || '')
        .toLowerCase()
        .trim();
}

/**
 * Register a component definition
 * def must be an object with at least { selector, templateUrl }
 */
function register(def) {
    if (!def?.selector) {
        throw new Error('Component must have a selector.');
    }

    const normalized = nonrmalizeSelector(def.selector);

    def.selector = normalized;

    if (_components.has(normalized)) {
        return;
    }

    _components.set(normalized, def);
}

/**
 * Resolve a component definitino by selector
 */
function get(selector) {
    const normalized = nonrmalizeSelector(selector);

    if (!_components.has(normalized)) {
        throw new Error(`Component not registered: ${normalized}`);
    }

    return _components.get(normalized);
}

function getAll() {
    return Array.from(_components.values());
}

export const components = { register, get, getAll };
export default components;