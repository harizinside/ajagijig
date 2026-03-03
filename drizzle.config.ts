import "dotenv/config"
import { defineConfig } from "drizzle-kit"

/** @type {import('drizzle-kit').defineConfig} */
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
})
