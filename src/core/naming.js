const splitRegex = /[\s_\-\.\/\\]+/;
const nonAlphaNumRegex = /[^a-z0-9]+/g;

function normalizeBase(str) {
    if (!str) return '';

    // remove diacritics
    const normalized = str.normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '');

    return normalized;
}

function splitWords(str) {
    const normalizedLowerCase = normalizeBase(str)
        .toLowerCase();

        return normalizedLowerCase.split(splitRegex)
            .map(w => w.replace(nonAlphaNumRegex, ''))
            .filter(Boolean);
}

function toKebabCase(str) {
    const words = splitWords(str);

    return words.join('-');
}

function toPascalCase(str) {
    const words = splitWords(str);

    return words
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join('');
}

function toCamelCase(str) {
    const words = splitWords(str);

    if (words.length === 0) return '';

    const [first, ...rest] = words;
    const head = first;
    const tail = rest.map(w => w.charAt(0).toUpperCase() + w.slice(1));

    return [head, ...tail].join('');
}

export const Naming = {
    toKebabCase,
    toPascalCase,
    toCamelCase
};