/*
 * @Author: Hughie
 * @Date: 2019-12-20 09:04:47
 * @LastEditTime: 2021-03-31 13:50:24
 * @LastEditors: Hughie
 * @Description:
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { tslint, deepmerge } = require('@ice/spec')

module.exports = deepmerge(tslint, {
  env: {
    jest: true,
  },
  parser: require.resolve('@typescript-eslint/parser'),
  extends: ['plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  rules: {
    semi: 'off',
    camelcase: 0,
    'linebreak-style': ['error', 'unix'],
    'class-methods-use-this': 'off',
    'no-nested-ternary': 'off',
    'global-require': 'off',
    'no-param-reassign': 'off',
    'no-useless-constructor': 'off',
    'default-case': 'off',
    'import/order': 'off',
    'comma-dangle': 'off',
    'no-dupe-class-members': 'off',
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    'max-classes-per-file': 'off',
    'react/jsx-filename-extension': 'off',
    'react/no-did-update-set-state': 'off',
    'react/sort-comp': [
      1,
      {
        order: ['static-variables', 'static-methods', 'instance-variables', 'lifecycle', 'everything-else', 'render'],
      },
    ],
    'react/state-in-constructor': [0],
    'react/static-property-placement': [0],
    'react/jsx-key': [2, { checkFragmentShorthand: true }],
    'react/no-unescaped-entities': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/label-has-associated-control': 0,
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-dupe-class-members': ['error'],
    '@typescript-eslint/no-unused-expressions': ['error'],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/ban-types': 0,
    'react/jsx-pascal-case': 0,
    '@typescript-eslint/no-non-null-asserted-optional-chain': 0,
    '@typescript-eslint/no-extra-semi': 0,
  },
  globals: {
    IS_DEBUG: 'readonly',
    RELEASE: 'readonly',
    ENV: 'readonly',
    IS_TEST: 'readonly',
    PROXY: 'readonly',
  },
})
