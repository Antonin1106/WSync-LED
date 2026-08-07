// scripts/check-header.mjs
// Scans all code files under the `src` directory and ensures they contain
// a standardized header with the file path and an optional description.

import fs from "node:fs";
import path from "node:path";
import error from "./helpers/error.mjs";
import success from "./helpers/success.mjs";
import modify from "./helpers/modify.mjs";

/**
 * List of file extensions to scan
 */
const EXTENSIONS = [".scss", ".ts", ".tsx"];

/**
 * Absolute path to the project's `src` directory.
 */
const SRC_DIR = path.join(process.cwd(), "src");

/**
 * Whether to insert a default description when one is missing.
 *
 * If `false`, only the file path header is enforced.
 */
const WITH_DESCRIPTION = true;


let hasError = false;
let fileCount = 0;
walk(SRC_DIR);


/**
 * Recursively traverses a directory and processes every SCSS file.
 * @param dir - Absolute directory path.
 */
function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            walk(fullPath);
            continue;
        }

        if (!EXTENSIONS.includes(path.extname(entry.name))) {
            continue;
        }

        fileCount++;
        processFile(fullPath);
    }
}

/**
 * Ensures a SCSS file starts with a standardized header.
 * The header contains:
 * - the file path relative to the project root;
 * - an optional description;
 * - a blank line separating the header from the file content.
 * @param filePath - Absolute path to the SCSS file.
 */
function processFile(filePath) {
    const original = fs.readFileSync(filePath, "utf8");

    const hasBom = original.startsWith("\uFEFF");
    const content = hasBom ? original.slice(1) : original;

    const relativePath = path
        .relative(process.cwd(), filePath)
        .replace(/\\/g, "/")
        .slice(4);

    const expectedPathComment = `// ${relativePath}`;

    const lines = content.split(/\r?\n/);

    // Remove leading blank lines.
    while (lines.length && lines[0].trim() === "") {
        lines.shift();
    }

    let changed = false;

    // Ensure the first line contains the expected file path.
    if (lines[0]?.startsWith("// ")) {
        if (lines[0] !== expectedPathComment) {
            lines[0] = expectedPathComment;
            changed = true;
            modify(`Correct the file path in header of ${relativePath}`)
        }
    } else {
        lines.unshift(expectedPathComment);
        modify(`Add the file path in header of ${relativePath}`)
        changed = true;
    }

    // Preserve an existing description or insert the default one if enabled.
    const secondLine = lines[1];
    let isError = false;

    if (!secondLine?.startsWith("// ") && WITH_DESCRIPTION) {
        isError = true;
        hasError = true;
    }

    // Ensure a blank line follows the header.
    const expectedBlankIndex = lines[1]?.startsWith("// ") ? 2 : 1;

    if (lines[expectedBlankIndex] !== "") {
        lines.splice(expectedBlankIndex, 0, "");
        changed = true;
        modify(`Add a blank line after header in ${relativePath}`)
    }

    if (isError)
        error(`Missing description for file ${relativePath}`);
    else if (!changed) {
        success(`${relativePath}`);
        return;
    }

    const output = (hasBom ? "\uFEFF" : "") + lines.join("\n");

    fs.writeFileSync(filePath, output, "utf8");
}

if (hasError) {
    console.error("\nHeader check failed.\n");
    process.exit(1);
}

console.log("\n");
success(`${fileCount} files read.`);
success(`${fileCount} files checked.`);
success("All headers are valid.\n");