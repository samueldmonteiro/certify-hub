import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
    // Identação com 2 espaços
      indent: ['error', 2],

      // Ponto e vírgula obrigatório
      semi: ['error', 'always'],

      // Apenas aspas simples
      quotes: ['error', 'single', { avoidEscape: true }],

      // Extras que evitam dor de cabeça
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],

      // 🔥 CONTROLE DO `any`
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },


  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    'coverage/**',
    'generated/**',
  ]),
]);

export default eslintConfig;
