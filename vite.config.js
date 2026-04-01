import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/app-scontrini/',
  server: {
    port: 5173,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,ts}'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**'],
      thresholds: {
        statements: 74,
        branches: 94,
        functions: 82,
        lines: 74,
      },
    },
  },
})