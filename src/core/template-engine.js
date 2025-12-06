import fs from 'fs';
import path from 'path';
import { Naming } from './naming.js';

const curlyTokenRegex = /\{\{\s*(?<key>[\w-]+)\s*\}\}/g;
const underTokenRegex = /__(?<key>[\w-]+)__/g;

function replaceTokensInString(text, vars) {
    if (!vars) return text;

    let result = text;

    result = result.replace(curlyTokenRegex, (match, key) => {
        const value = vars[key];

        return value ?? match;
    });

    result = result.replace(underTokenRegex, (match, key) => {
        const value = vars[key];

        return value ?? match;
    });

    return result;
}

async function copyDirectoryRecursive(sourceDir, targetDir, vars) {
    const entries = await fs.promises.readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
        const rawName = entry.name;
        const targetName = replaceTokensInString(rawName, vars);

        const sourcePath = path.join(sourceDir, rawName);
        const destPath = path.join(targetDir, targetName);

        if (entry.isDirectory()) {
            await fs.promises.mkdir(destPath, { recursive: true });
            await copyDirectoryRecursive(sourcePath, destPath, vars);
        } else {
            const content = await fs.promises.readFile(sourcePath, 'utf8');
            const replaced = replaceTokensInString(content, vars);
            
            await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
            await fs.promises.writeFile(destPath, replaced, 'utf8');
        }
    }
}

async function materializeTemplate(templateRootDir, destinationDir, variables) {
    if (!fs.existsSync(templateRootDir)) {
        throw new Error(`Template folder not found: ${templateRootDir}`);
    }

    await fs.promises.mkdir(destinationDir, { recursive: true });
    await copyDirectoryRecursive(templateRootDir, destinationDir, variables);
}

function createAppVars(rawName) {
    const kebab = Naming.toKebabCase(rawName);
    const pascal = Naming.toPascalCase(rawName);
    const camel = Naming.toCamelCase(rawName);

    return {
        name: kebab,
        appName: kebab,
        className: pascal,
        camelName: camel,
        selector: kebab
    };
}

function createFeatureVars(rawName) {
    const kebab = Naming.toKebabCase(rawName);
    const pascal = Naming.toPascalCase(rawName);
    const camel = Naming.toCamelCase(rawName);

    return {
        name: kebab,
        className: pascal,
        camelName: camel,
        selector: kebab
    };
}

export const TemplateEngine = {
    materializeTemplate,
    createAppVars,
    createFeatureVars
};