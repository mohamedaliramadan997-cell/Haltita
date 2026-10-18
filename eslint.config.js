// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', 'coverage/*'],
  },
  {
    rules: {
      // rules.md §6: use lib/logger.ts, never raw console calls.
      'no-console': 'error',
    },
  },
  {
    // design.md: every colour and font size comes from src/theme (T-010).
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['src/theme/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
          message: 'Use a colour token from src/theme instead of a hex value.',
        },
        {
          selector:
            'Property[key.name=/^(fontSize|lineHeight|letterSpacing)$/][value.type="Literal"]',
          message: 'Use a typography token from src/theme instead of a raw font size.',
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // rules.md §10: no `any`, no @ts-ignore without an explanatory comment.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-ignore': 'allow-with-description', 'ts-expect-error': 'allow-with-description' },
      ],
    },
  },
]);
