// scripts/check-translations.mjs
// Ensure that translations are correctly implemented

import fs from "fs";
import path from "path";
import error from "./helpers/error.mjs";
import success from "./helpers/success.mjs";

const SRC_DIR = "src";
const LANG_DIR = "src/lang";

const usedKeys = new Set();

/**
 * Recursively walks a directory.
 * @param dir - The directory to walk.
 */
function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            walk(fullPath);
            continue;
        }

        if (!/\.(ts|tsx)$/.test(entry.name))
            continue;

        const content = fs.readFileSync(fullPath, "utf8");

        const regex = /\bt\s*\(\s*['"`]([^'"`]+)['"`]/g;

        let match;
        while ((match = regex.exec(content)) !== null) {
            usedKeys.add(match[1]);
        }
    }
}

/**
 * Flattens nested JSON objects into dot notation.
 * @param obj - The object to flatten.
 * @param [prefix] - The prefix for the keys.
 * @returns - The flattened object.
 */
function flatten(obj, prefix = "") {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (
            value &&
            typeof value === "object" &&
            !Array.isArray(value)
        ) {
            Object.assign(result, flatten(value, newKey));
        } else {
            result[newKey] = value;
        }
    }

    return result;
}

walk(SRC_DIR);

const languageFiles = fs
    .readdirSync(LANG_DIR)
    .filter(file => file.endsWith(".json"));

if (languageFiles.length === 0) {
    error("No language files found.");
    process.exit(1);
}

const languages = {};
const allLanguageKeys = {};

for (const file of languageFiles) {
    const json = JSON.parse(
        fs.readFileSync(path.join(LANG_DIR, file), "utf8")
    );

    const flat = flatten(json);

    languages[file] = flat;
    allLanguageKeys[file] = new Set(Object.keys(flat));
}

let hasError = false;

console.log("Checking translation usage...\n");

for (const key of usedKeys) {
    for (const [file, keys] of Object.entries(allLanguageKeys)) {
        const pluralSuffixes = [
            "",
            "_one",
            "_other",
            "_zero",
            "_two",
            "_few",
            "_many",
        ];

        const exists = pluralSuffixes.some(suffix =>
            keys.has(`${key}${suffix}`)
        );

        if (!exists) {
            error(`Missing key "${key}" in ${file}`);
            hasError = true;
        }
    }
}

const referenceFile = languageFiles[0];
const referenceKeys = allLanguageKeys[referenceFile];

for (const file of languageFiles.slice(1)) {
    const keys = allLanguageKeys[file];

    for (const key of referenceKeys) {
        if (!keys.has(key)) {
            error(`${file} is missing "${key}"`);
            hasError = true;
        }
    }

    for (const key of keys) {
        if (!referenceKeys.has(key)) {
            error(`${file} contains extra key "${key}"`);
            hasError = true;
        }
    }
}

if (hasError) {
    console.error("\nTranslation check failed.");
    process.exit(1);
}

success(`${usedKeys.size} translation keys used.`);
success(`${languageFiles.length} language files checked.`);
success("All translations are valid.");