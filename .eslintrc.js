module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    react: {
      pragma: 'h',
      version: 'detect',
    },
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    "stylelint-config-standard",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'simple-import-sort',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'no-unused-vars': 'off',
    'react/no-unknown-property': [2, { ignore: ['class', 'className', 'for'] }],
    'react/require-default-props': 'off',
    'no-console': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'max-len': 'off',
    'valid-typeof': 'off',
    // 'no-unused-vars': 'off',
    'consistent-return': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'object-curly-newline': ['error', { consistent: true }],
    'jsx-a11y/click-events-have-key-events': 'off',

    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
};
