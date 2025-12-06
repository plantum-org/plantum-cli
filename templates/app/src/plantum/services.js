const _services = new Map();

/**
 * Register a service singleton definition.
 * def must be an object with at least { name }
 */
function register(name, def) {
    if (!name || !def) {
        throw new Error('Service register(name, def) requires both.');
    }

    if (_services.has(name)) {
        return;
    }

    _services.set(name, createInstance(def));
}

/**
 * Resolve a service by name
 */
function get(name) {
    if (!_services.has(name)) {
        throw new Error(`Service not registered: ${name}`);
    }

    return _services.get(name);
}

/**
 * Creates a simple ctx for services
 */
function createInstance(def) {
    const ctx = {
        state: def.state ? def.state() : {},
        service:  def
    };

    def.onInit?.(ctx);

    return { ...def, ctx };
}

export const services = { register, get };
export default services;