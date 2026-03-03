import { betterAuth } from "better-auth"
import { phoneNumber, admin } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { redisStorage } from "@better-auth/redis-storage"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"

import { db } from "@/lib/db"
import * as schema from "@/db/schema"
import { redis } from "@/lib/redis"

export const auth = betterAuth({
  appName: "Nganuh",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [tanstackStartCookies(), phoneNumber(), admin()],
  advanced: {
    database: {
      generateId: false, // "serial" for auto-incrementing numeric IDs
    },
  },
  secondaryStorage: redisStorage({
    client: redis,
    keyPrefix: "better-auth:", // optional, defaults to "better-auth:"
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  logger: {
    disabled: false,
    disableColors: false,
    level: "debug",
    log: (level, message, ...args) => {
      // Custom logging implementation
      console.log(`[${level}] ${message}`, ...args)
    },
  },
  databaseHooks: {},
  experimental: { joins: true },
})

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    return session
  },
)
export const ensureSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) {
      throw new Error("Unauthorized")
    }
    return session
  },
)
