import { os as base } from "@orpc/server"
import type { RequestHeadersPluginContext } from "@orpc/server/plugins"
import { redis } from "@/lib/redis"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ORPCContext extends RequestHeadersPluginContext {}
interface ORPCMetadata {
  cache?: boolean | { ttl?: number }
}

const CACHE_TTL = 60 // detik

export const os = base
  .$context<ORPCContext>()
  .$meta<ORPCMetadata>({}) // require define initial context
  .use(async ({ procedure, next, path }, input, output) => {
    const cacheMeta = procedure["~orpc"].meta.cache
    if (!cacheMeta) {
      return await next()
    }

    const ttl =
      typeof cacheMeta === "object" ? (cacheMeta.ttl ?? CACHE_TTL) : CACHE_TTL
    const cacheKey = "orpc:" + path.join("/") + ":" + JSON.stringify(input)

    // Cek cache dulu
    const cached = await redis.get(cacheKey)
    if (cached) {
      return output(JSON.parse(cached))
    }

    // Kalau miss, jalankan procedure
    const result = await next()
    await redis.set(cacheKey, JSON.stringify(result.output), "EX", ttl)

    return result
  })
