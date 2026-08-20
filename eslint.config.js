import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

/**
 * The `no-restricted-*` blocks below are a hard security gate, not style advice:
 * this site's CSP carries no 'unsafe-inline' and no 'unsafe-eval', so any of
 * these APIs reaching production would either break the page or open the exact
 * XSS hole the CSP exists to close. CI fails on violation. See SECURITY.md.
 */
/**
 * Date libraries, banned outright.
 *
 * The whole correctness claim of this site is that every offset and every
 * daylight-saving rule is read from the IANA database through `Intl` at build
 * time, so it can never drift from tzdata. A date library brings its own copy of
 * that data, bundled at whatever version it shipped with, and the moment one is
 * imported the claim stops being true — silently, because the wrong answer still
 * looks like an answer. `src/lib/time/` is the only source of a time fact here.
 */
const BANNED_PACKAGES = [
  'moment',
  'moment-timezone',
  'date-fns',
  'date-fns-tz',
  'dayjs',
  'luxon',
  'js-joda',
  '@js-joda/core',
  'spacetime',
  'timezone-support',
  'date-and-time',
].map((name) => ({
  name,
  message: `Banned: no date libraries. Offsets and DST rules come from IANA through Intl — see src/lib/time/ and CLAUDE.md.`,
}));

const BANNED_GLOBALS = [
  {
    name: 'eval',
    message: 'Banned: the CSP forbids unsafe-eval. Rewrite without dynamic evaluation.',
  },
];

const BANNED_PROPERTIES = [
  {
    property: 'innerHTML',
    message: 'Banned: assign textContent, or build nodes with createElement.',
  },
  {
    property: 'outerHTML',
    message: 'Banned: assign textContent, or build nodes with createElement.',
  },
  {
    property: 'insertAdjacentHTML',
    message: 'Banned: use insertAdjacentElement with a built node.',
  },
  { property: 'execScript', message: 'Banned: dynamic script execution is forbidden by the CSP.' },
];

const BANNED_SYNTAX = [
  {
    selector: "NewExpression[callee.name='Function']",
    message: 'Banned: new Function() is dynamic evaluation and the CSP forbids unsafe-eval.',
  },
  {
    selector: 'CallExpression[callee.name=/^(setTimeout|setInterval)$/] > Literal:first-child',
    message: 'Banned: string-bodied setTimeout/setInterval is eval in disguise. Pass a function.',
  },
  {
    selector: "MemberExpression[property.name='innerHTML']",
    message: 'Banned: assign textContent, or build nodes with createElement.',
  },
  {
    selector: "MemberExpression[property.name='outerHTML']",
    message: 'Banned: assign textContent, or build nodes with createElement.',
  },
];

export default defineConfig([
  globalIgnores([
    'dist/**',
    // Astro's generated types land at the project root and, when a tool is run
    // with a content directory as its cwd, inside that directory too. Both are
    // generated and gitignored, so neither is ours to lint.
    '**/.astro/**',
    '**/node_modules/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    '.lighthouseci/**',
  ]),
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-restricted-globals': ['error', ...BANNED_GLOBALS],
      'no-restricted-imports': ['error', { paths: BANNED_PACKAGES }],
      'no-restricted-properties': ['error', ...BANNED_PROPERTIES],
      'no-restricted-syntax': ['error', ...BANNED_SYNTAX],
      'no-implied-eval': 'error',
      'no-script-url': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },
  {
    files: ['scripts/**/*.mjs', 'astro.config.ts', '*.config.ts', '*.config.js'],
    languageOptions: { globals: globals.node },
    rules: { 'no-console': 'off' },
  },
  {
    files: ['**/*.test.ts', 'tests/**/*.ts'],
    rules: { '@typescript-eslint/no-non-null-assertion': 'off' },
  },
]);
