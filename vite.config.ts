import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import tsconfigPaths from "vite-tsconfig-paths"

import { tanstackStart } from "@tanstack/react-start/plugin/vite"

import mdx from "@mdx-js/rollup"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import webfontDownload from "vite-plugin-webfont-dl"
import { compression } from "vite-plugin-compression2"

const config = defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    webfontDownload(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
      include: /\.(jsx|js|mdx|md|tsx|ts)$/,
    }),
    {
      enforce: "pre",
      ...mdx({
        /* jsxImportSource: …, otherOptions… */
      }),
    },
    compression({
      algorithms: ["gzip", "brotliCompress"],
    }),
  ],
})

export default config
