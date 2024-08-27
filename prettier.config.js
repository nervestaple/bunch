/* eslint-disable */

/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: 'lf',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  importOrder: [
    '^react',
    '',
    '^@?\\w',
    '',
    '^~/.*(?<!(\\.svg|\\.svg\\?svgr|\\.png|\\.jpg|\\.jpeg|\\.gif|\\.webp))$',
    '',
    '^(?=.*\\./)(?:(?!\\.css|\\.svg|\\.svg\\?svgr|\\.png|\\.jpg|\\.jpeg|\\.gif|\\.webp).)*$',
    '',
    '^.*(\\.svg|\\.svg\\?svgr|\\.png|\\.jpg|\\.jpeg|\\.gif|\\.webp)',
    '',
    '^(\\./|\\.\\./).*(\\.css)',
  ],
  importOrderTypeScriptVersion: '5.4.5',
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
};
