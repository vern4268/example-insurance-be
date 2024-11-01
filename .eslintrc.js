module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': [
            'error',
            {
                'variables': false,
                'functions': false
            }
        ],
        'import/no-anonymous-default-export': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_',
                'caughtErrorsIgnorePattern': '^_'
            }
        ],
        'class-methods-use-this': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        'max-len': 'off',
        'arrow-parens': 'off',
        'implicit-arrow-linebreak': 'off',
        'linebreak-style': 0,
        'no-empty': 'error',
        'no-cond-assign': 'error',
        'no-underscore-dangle': 'error',
        'no-param-reassign': [
            'error',
            {
                'props': false
            }
        ],
    },
};
