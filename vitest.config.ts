import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },

  test: {
    env: {
      NODE_ENV: 'test',
    },
    exclude: [
      'node_modules',
      './src/actions/**',
      '.next',
      'out',
      '.vercel',
      'dist',
      '.turbo',
      'coverage',
      './src/app/**',
    ],

    globals: true,
    environment: 'node',

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/core/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.it-spec.ts', 'src/generated/**'],
    },

    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.spec.ts'],
        },
      },

      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['tests/**/*.e2e-spec.ts'],
          setupFiles: ['./tests/setup.ts'],
          testTimeout: 30_000,
          hookTimeout: 60_000,
        },
      },

      {
        extends: true,
        test: {
          name: 'int',
          include: ['tests/**/*.int-spec.ts'],
          setupFiles: ['./tests/setup.ts'],
          testTimeout: 30_000,
          hookTimeout: 60_000,
        },
      },
    ],
  },
});