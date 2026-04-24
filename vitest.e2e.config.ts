import path from "node:path";
import { defineConfig } from "vitest/config";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['src/http/**/*.spec.ts'],
    environment: path.resolve(
      __dirname,
      './prisma/vitest-environment-prisma/index.js'
    )
  }
})