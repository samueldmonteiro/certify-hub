import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },

  test: {
    dir: '/',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          dir: 'src/core/application/',
        },
      },

      {
        extends: true,
        test: {
          name: 'e2e',
          dir: 'tests/e2e',
          environment: './prisma/vitest-env-prisma/prisma-test-env.ts',
        },
      },
    ],
  },
});