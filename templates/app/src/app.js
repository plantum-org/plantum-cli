// --- Plantum Core Imports ---
import { Plantum } from './plantum/runtime.js';
import { services } from './plantum/services.js';

// --- Application Root ---
import AppComponent from './components/app/app.comp.js';

/**
 * WARNING: Do not remove the component-imports marker.
 */
// @plantum:component-imports

// --- Pre-registered application services ---
import HttpService from './services/http.service.js';

/**
 * WARNING: Do not remove the service-imports marker.
 */
// @plantum:service-imports

// --- Application Bootstrap ---
export function bootstrap() {

    // --- Component registrations ---
    /**
     * WARNING: Do not remove the component-registrations marker.
     */
    const customComponents = [
        // @plantum:component-registrations
    ];

    // --- Application bootstrapping ---
    Plantum.bootstrap(AppComponent, customComponents);

    // --- Service registrations ---
    services.register(HttpService.name, HttpService);

    /**
     * WARNING: Do not remove the service-registrations marker.
     */
    // @plantum:service-registrations
}
