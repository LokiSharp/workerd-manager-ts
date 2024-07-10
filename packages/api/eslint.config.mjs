import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    {
        ignores: ['dist/**'],
    },
    eslintConfigPrettier,
    ...tseslint.configs.recommended,
];