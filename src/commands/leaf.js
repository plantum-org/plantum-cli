import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

import { Naming } from '../core/naming.js';
import { Paths } from '../core/paths.js';
import { TemplateEngine } from '../core/template-engine.js';

const IMPORT_MARKER = '// @plantum:component-imports';
const REGISTRATION_MARKER = '// @plantum:component-registrations';

export function registerLeafCommand(program) {
    program.command('leaf')
        .description('Generate a new Plantum component (leaf)')
        .argument('<name>', 'Name of the component')
        .option('-d, --dir <directory>', 'Target directory (default: ./<kebab-case-name>)')
        .action(async (rawName, options) => {
            try {
                const context = await createLeafContext(rawName, options);

                await validateLeafContext(context);
                await materializeLeafComponent(context);
                //TODO: await registerLeafComponentInAppJs(context);

                //TODO: printLeafSuccess(context);
            } catch (err) {
                const message = err instanceof Error
                    ? err.message : String(err);
            }
        });
}

async function createLeafContext(rawName, options) {
    const normalizedName = (rawName ?? '').trim();

    const rootDir = path.resolve(process.cwd(), options?.dir ?? '.');
    const kebabName = Naming.toKebabCase(normalizedName);
    const className = Naming.toPascalCase(normalizedName);

    const componentRoot = path.join(rootDir, 'src', 'components', kebabName);
    const templateDir = Paths.templatesComponent();
    const vars = TemplateEngine.createFeatureVars(normalizedName);

    const appJsPath = path.join(rootDir, 'src', 'app.js');
    const importTemplatePath = Paths.templateComponentImport();
    const registrationTemplatePath = Paths.templateComponentRegistration();

    return {
        rawName: normalizedName,
        kebabName,
        className,
        rootDir,
        componentRoot,
        templateDir,
        vars,
        appJsPath,
        importTemplatePath,
        registrationTemplatePath
    };
}

async function validateLeafContext(context) {
    ensureValidName(context.rawName);
    ensureDirectoryExists(context.rootDir);
    ensurePlantumConfigExists(context.rootDir);
    ensureTemplateDirectoryExists(context.templateDir);

    const isSafe = await isComponentDirectorySafe(context.componentRoot);

    if (!isSafe) {
        throw new Error(chalk.red(`Component directory '${context.componentRoot}' already exists and is not empty.`));
    }
}

function ensureValidName(name) {
    if (!name || name.length === 0) {
        throw new Error(chalk.red('Please provide a valid component name.'));
    }
}

function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        throw new Error(chalk.red(`Directory does not exist: ${dir}`));
    }
}

function ensurePlantumConfigExists(rootDir) {
    const configPath = path.join(rootDir, 'plantum.config.json');

    if (!fs.existsSync(configPath)) {
        throw new Error(chalk.red(`No sprout.config.json found in '${rootDir}'. This command must be run in a Plantum app root (or use --dir).`));
    }
}

function ensureTemplateDirectoryExists(templateDir) {
    if (!fs.existsSync(templateDir)) {
        throw new Error(chalk.red(`Template folder not found: ${templateDir}`));
    }
}

async function isComponentDirectorySafe(dir) {
    if (!fs.existsSync(dir)) {
        return true;
    }

    const entries = await fs.promises.readdir(dir);
    return entries.length === 0;
}

async function materializeLeafComponent(context) {
    await fs.promises.mkdir(context.componentRoot, { recursive: true });
    await TemplateEngine.materializeTemplate(context.templateDir, context.componentRoot, context.vars);

    console.log(chalk.green(`Plantum component '${context.kebabName}' created: ${context.componentRoot}`));
}

