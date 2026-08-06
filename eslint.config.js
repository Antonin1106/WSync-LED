import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import jsdoc from 'eslint-plugin-jsdoc';

export default defineConfig([
    // Ignore generated build files.
    globalIgnores(['dist', 'docs']),
    jsdoc.configs['flat/recommended-typescript'],
    {
        settings: {
            react: {
                version: 'detect',
            },
        },

        plugins: {
            react,
            jsdoc,
        },

        // Apply this configuration to all JavaScript and TypeScript source files.
        files: ['**/*.{ts,tsx,js,jsx}'],

        // Start from the recommended rule sets provided by each plugin.
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],

        languageOptions: {
            // Expose browser globals such as window, document and navigator.
            globals: globals.browser,
        },

        rules: {
            /* ------------------------------------------------------------------
             * React Hooks
             * ---------------------------------------------------------------- */

            // Enforce the Rules of Hooks.
            'react-hooks/rules-of-hooks': 'error',

            // Warn when hook dependencies are missing.
            'react-hooks/exhaustive-deps': 'warn',

            /* ------------------------------------------------------------------
             * React
             * ---------------------------------------------------------------- */

            // React 17+ no longer requires importing React in JSX files.
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',

            // Require a key prop when rendering lists.
            'react/jsx-key': 'error',

            // Prevent invalid DOM properties.
            'react/no-unknown-property': 'error',

            // Prefer self-closing tags when possible.
            'react/self-closing-comp': 'warn',

            // Prevent using undefined components or variables in JSX.
            'react/jsx-no-undef': 'error',

            // TypeScript already provides prop validation.
            'react/prop-types': 'off',

            /* ------------------------------------------------------------------
             * TypeScript
             * ---------------------------------------------------------------- */

            // Discourage using `any`.
            '@typescript-eslint/no-explicit-any': 'warn',

            // Require `import type` when importing types.
            '@typescript-eslint/consistent-type-imports': 'error',

            // Warn about unused variables, except those prefixed with "_".
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' },
            ],

            // Discourage non-null assertions (`!`).
            '@typescript-eslint/no-non-null-assertion': 'warn',

            /* ------------------------------------------------------------------
             * Code quality
             * ---------------------------------------------------------------- */

            // Always terminate statements with semicolons.
            semi: ['error', 'always'],

            // Prefer strict equality operators.
            eqeqeq: ['warn', 'always'],

            // Require braces around control statements.
            // curly: ['error', 'all'],

            // Disallow `var`.
            'no-var': 'error',

            // Prefer `const` whenever possible.
            'prefer-const': 'error',

            // Disallow multiple consecutive spaces.
            'no-multi-spaces': 'error',

            // Disallow trailing whitespace.
            'no-trailing-spaces': 'error',

            // Detect unreachable code.
            'no-unreachable': 'error',

            // Prevent duplicate imports.
            'no-duplicate-imports': 'error',

            // Discourage console usage except for warnings and errors.
            'no-console': ['warn', { allow: ['warn', 'error'] }],

            /* ------------------------------------------------------------------
             * Readability
             * ---------------------------------------------------------------- */

            // Indentation is handled by the formatter.
            'indent': ['off', 4],

            // Allow tabs if the formatter inserts them.
            'no-tabs': 'off',

            // Enforce single quotes.
            'quotes': ['error', 'single'],

            // Require trailing commas in multiline structures.
            'comma-dangle': ['error', 'always-multiline'],

            /* ------------------------------------------------------------------
             * Security
             * ---------------------------------------------------------------- */

            // Prevent potentially dangerous dynamic code execution.
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',

            // Disallow the deprecated `with` statement.
            'no-with': 'error',

            /* ------------------------------------------------------------------
             * Variables
             * ---------------------------------------------------------------- */

            // Warn about unused variables, except those prefixed with "_".
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

            // Disable the prevent using undeclared variables.
            'no-undef': 'off',

            /* ------------------------------------------------------------------
            * JSDoc
            * ---------------------------------------------------------------- */

            'jsdoc/require-jsdoc': [
                'error',
                {
                    publicOnly: true,
                    require: {
                        FunctionDeclaration: true,
                        MethodDefinition: false,
                        ClassDeclaration: true,
                        ArrowFunctionExpression: false,
                        FunctionExpression: false,
                    },
                },
            ],

            'jsdoc/require-param': 'error',
            'jsdoc/require-returns': 'error',
            'jsdoc/check-tag-names': 'error',
            'jsdoc/check-alignment': 'off',
        },
    },
]);