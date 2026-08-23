import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    // The CLI resolves the templates directory relative to the source file;
    // never touch a real home directory during tests.
    env: {},
  },
})
