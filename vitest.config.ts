import { defineConfig, mergeConfig } from "vitest/config"
import viteConfig from "./vite.config"

/** @type {import('vitest/config').defineConfig} */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      includeSource: ["src/**/*.{js,ts}"],
    },
    define: {
      "import.meta.vitest": "undefined",
    },
  }),
)
