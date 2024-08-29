module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-shadow': 'error',
    eqeqeq: 'error',
    'import/no-default-export': 'error',
    'no-html-link-for-pages': 'off',
    'no-nested-ternary': 'error',
    'react/boolean-prop-naming': 'error',
    'react/function-component-definition': [
      'error',
      { namedComponents: 'function-declaration' },
    ],
    'react/jsx-newline': ['error', { prevent: true, allowMultilines: true }],
    'react/jsx-boolean-value': ['error', 'always'],
    curly: 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
  },
  overrides: [
    {
      files: [
        'src/app/**/page.tsx',
        'src/app/**/layout.tsx',
        'src/app/**/loading.tsx',
        'src/app/**/default.tsx',
        'codegen*.ts',
        'next.config.mjs',
        '*.d.ts',
        'src/server/**/*.ts',
      ],
      rules: {
        'import/no-default-export': 'off',
        'react-hooks/exhaustive-deps': 'error',
      },
    },
  ],
  ignorePatterns: ['.next/**/*', 'node_modules/**/*'],
};
