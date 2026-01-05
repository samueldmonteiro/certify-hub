import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },

  test: {
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
          name: 'int',
          dir: 'src/tests/integration',
          environment: './prisma/vitest-env-prisma/prisma-test-env.ts',
        },
      },
    ],
  },
});