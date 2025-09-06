/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/build/**',
      '**/.next/**',
      '**/out/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        'build/**',
        'node_modules/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.setup.*',
        '**/test/**',
        '**/tests/**',
        '**/__tests__/**',
        '**/*.test.*',
        '**/*.spec.*',
      ],
      thresholds: {
        global: {
          branches: 98,
          functions: 98,
          lines: 98,
          statements: 98
        },
        // Domain layer requires 100% coverage (Clean Architecture core)
        '**/domain/**': {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100
        },
        // UI and Infrastructure layers require 95% coverage
        '**/ui/**': {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95
        },
        '**/infrastructure/**': {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95
        }
      }
    }
  }
})