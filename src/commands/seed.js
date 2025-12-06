import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

import { Naming  } from '../core/naming.js';
import { Paths } from '../core/paths.js';
import { TemplateEngine } from '../core/template-engine.js';

export function registerSeedCommand(program) {
    program.command('seed')
        .description('Create a new Plantum app')
        .argument('<name>', 'Name of the app')
        .option('-d, --dir <directory>', 'Target directory (default: ./<kebab-case-name>)')
        .action(async (rawName, options) => {
            try {
                const context = createSeedContext(rawName, options);

                await validateSeedContext(context);
                await materializePlantumApp(context);

                printNextSteps(context);
            } catch (err) {
                const message = err instanceof Error
                    ? err.message : String(err);

                console.error(message);

                process.exitCode = 1;
            }
        });
}

function createSeedContext(rawName, options) {
    const normalizedName = (rawName ?? '').trim();
    const kebabName = Naming.toKebabCase(normalizedName);
    
    const baseDir = path.resolve(process.cwd(), options?.dir ?? kebabName);
    const templateDir = Paths.templatesApp();
    const vars = TemplateEngine.createAppVars(normalizedName);

    return {
        rawName: normalizedName,
        kebabName,
        baseDir,
        appRoot: baseDir,
        templateDir,
        vars
    };
}

async function validateSeedContext(context) {
    ensureValidName(context.rawName);
    ensureTemplateDirectoryExists(context.templateDir);

    const isSafe = await isDestinationDirectoryIsSafe(context.appRoot);

    if (!isSafe) {
        throw new Error(chalk.red(`Target directory '${context.appRoot}' already exists and is not empty.`));
    }
}

function ensureValidName(name) {
    if (!name || name.length === 0) {
        throw new Error(chalk.red('Please provide a valid app name.'));
    }
}

function ensureTemplateDirectoryExists(templateDir) {
    if (!fs.existsSync(templateDir)) {
        throw new Error(chalk.red(`Template folder not found: ${templateDir}`));
    }
}

async function isDestinationDirectoryIsSafe(dir) {
    if (!fs.existsSync(dir)) {
        return true;
    }

    const entries = await fs.promises.readdir(dir);

    return entries.length === 0;
}

async function materializePlantumApp(context) {
    await fs.promises.mkdir(context.appRoot, { recursive: true });
    await TemplateEngine.materializeTemplate(context.templateDir, context.appRoot, context.vars);
    
    console.log(chalk.green(`Plantum app created: ${context.appRoot}`));
}

function printNextSteps(context) {
    console.log();
    console.log('Next steps:');

    const rel = path.relative(process.cwd(), context.appRoot) || '.';

    console.log(chalk.cyan(`cd ${rel}`));
    console.log(chalk.cyan('plantum grow'));
    console.log();
}