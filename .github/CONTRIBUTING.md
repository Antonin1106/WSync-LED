# WSync-LED Contributing Guide

Thank you for your interest in contributing to this project!

Contributions of all kinds are welcome, including bug fixes, new features, documentation improvements, and code quality enhancements.

---

## Table of Contents

- [WSync-LED Contributing Guide](#wsync-led-contributing-guide)
  - [Table of Contents](#table-of-contents)
  - [1. Before Contributing](#1-before-contributing)
  - [2. Branching Strategy](#2-branching-strategy)
  - [3. Reporting a Bug](#3-reporting-a-bug)
  - [4. Project Structure](#4-project-structure)
  - [5. Coding Guidelines](#5-coding-guidelines)
  - [6. Documentation](#6-documentation)
  - [7. Updating the Documentation](#7-updating-the-documentation)
  - [8. Updating Translation Files](#8-updating-translation-files)
  - [9. Testing Your Changes](#9-testing-your-changes)
  - [10. Submitting a Pull Request](#10-submitting-a-pull-request)

---

## 1. Before Contributing

Before opening an issue or submitting a Pull Request, please:

- Check whether your issue or idea has already been reported.
- Read the project's `README.md`.
- Keep your changes focused on a single feature or fix whenever possible.
- Follow the existing code style and project conventions.

---

## 2. Branching Strategy

On GitHub, we use the following branching strategy:
- The `main` branch contains the latest stable release.
- `v1, v2, ...` branch are used for ongoing development and may contain unstable code.
- Feature branches should be created from `v*` and named according to the feature or bug being addressed (e.g., `feature/new-feature`, `bugfix/fix-issue`).

---

## 3. Reporting a Bug

If you discover a bug, please open an issue including:

- The project version.
- Your operating system and browser (if applicable).
- Steps to reproduce the issue.
- Expected behavior.
- Actual behavior.
- Screenshots or logs when relevant.

---

## 4. Project Structure

```
.
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   ├── config/         # Application configuration
│   ├── lang/           # Languages files
│   ├── lib/            # Utilities and helpers
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── CHANGELOG.md
├── README.md
└── package.json
```

---

## 5. Coding Guidelines

Please follow these guidelines when contributing:

- Use TypeScript whenever possible.
- Respect the existing folder structure.
- Follow the project's ESLint configuration.
- Keep functions small and focused.
- Prefer descriptive names over abbreviations.
- Remove unused imports and dead code.
- Keep commits clear and meaningful.

---

## 6. Documentation

Public functions, hooks, utilities, and reusable components must be documented using **JSDoc**.

Example:

```ts
/**
 * Updates a numeric setting from an input value.
 *
 * @param key Setting to update.
 * @param value Numeric value entered by the user.
 */
function setNumber(key: keyof Settings, value: string) {
  onSettingsChange({
    ...settings,
    [key]: parseFloat(value),
  });
}
```

Comments should explain **why** something exists rather than simply repeating what the code already says.

---

## 7. Updating the Documentation

If your contribution changes the project's behavior:

- Update `README.md` if needed.
- Update `CHANGELOG.md`.
- Add or update JSDoc comments when appropriate.

---

## 8. Updating Translation Files

If your contribution introduces or modifies user-facing text:

- Always use the `t()` function for translatable strings.
- Update every supported language file in [`src/lang/`](src/lang/).
- Ensure that translation keys remain consistent across all language files.
- Remove unused translation keys whenever applicable.

---

## 9. Testing Your Changes

Before opening a Pull Request:

- Install dependencies:

```bash
npm install
```

- Run ESLint:

```bash
npm run lint
```

- Build the project:

```bash
npm run build
```

If tests exist, run them as well.

Your contribution should compile without errors or warnings.

---

## 10. Submitting a Pull Request

Before submitting your Pull Request, verify that:

- Your branch is up to date.
- The project builds successfully.
- Documentation has been updated when necessary.
- Your changes are focused on a single feature or bug fix.

When creating the Pull Request, include:

- A short description of the changes.
- The motivation behind the change.
- How the changes were tested.
- Any known limitations or breaking changes.

Thank you for helping improve the project !