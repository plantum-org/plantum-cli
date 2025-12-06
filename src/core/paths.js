import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function templatesRoot() {
    return path.resolve(__dirname, '..', '..', 'templates');
}

function templatesApp() {
    return path.join(templatesRoot(), 'app');
}

function templatesComponent() {
    return path.join(templatesRoot(), 'component');
}

function templatesService() {
    return path.join(templatesRoot(), 'service');
}

function templatesShared() {
    return path.join(templatesRoot(), 'shared');
}

function templateComponentImport() {
    return path.join(templatesShared(), 'component-import.js');
}

function templateComponentRegistration() {
    return path.join(templatesShared(), 'component-registration.txt');
}

export const Paths = {
    templatesRoot,
    templatesApp,
    templatesComponent,
    templatesService,
    templatesShared,
    templateComponentImport,
    templateComponentRegistration
};