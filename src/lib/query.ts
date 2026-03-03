import { StandardRPCJsonSerializer } from "@orpc/client/standard"
import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query"

const serializer = new StandardRPCJsonSerializer({
  customJsonSerializers: [],
})

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn(queryKey) {
          const [json, meta] = serializer.serialize(queryKey)
          return JSON.stringify({ json, meta })
        },
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        serializeData(data) {
          const [json, meta] = serializer.serialize(data)
          return { json, meta }
        },
      },
      hydrate: {
        deserializeData(data) {
          return serializer.deserialize(data.json, data.meta)
        },
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
  // TanStack Start pakai `import.meta.env.SSR` bukan `isServer` dari react-query
  if (import.meta.env.SSR) {
    return makeQueryClient()
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).__TANSTACK_QUERY_CLIENT__ = browserQueryClient
    }
  }

  return browserQueryClient
}
