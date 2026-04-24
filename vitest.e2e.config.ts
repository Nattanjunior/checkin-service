import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ['src/http/**/*.spec.ts'],
    environment: path.resolve(
      __dirname,
      './prisma/vitest-environment-prisma/index.js'
    )
  }
})