import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },

  test: {
    exclude: [
      'node_modules',
      '.next',
      'out',
      '.vercel',
      'dist',
      '.turbo',
      'coverage',
      './src/app/**',
    ],

    dir: '/src',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          dir: 'src/core/',
        },
      },

      {
        extends: true,
        test: {
          testTimeout: 15000,
          name: 'int',
          dir: 'src/tests/integration',
          environment: './prisma/vitest-env-prisma/prisma-test-env.ts',
        },
      },
    ],
  },
});