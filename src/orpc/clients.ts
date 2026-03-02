import { createRouterClient } from "@orpc/server"
import type { RouterClient } from "@orpc/server"
import { createORPCClient } from "@orpc/client"
import {
  ClientRetryPlugin,
  type ClientRetryPluginContext,
  RetryAfterPlugin,
} from "@orpc/client/plugins"
import { RPCLink } from "@orpc/client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { createIsomorphicFn } from "@tanstack/react-start"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ORPCClientContext extends ClientRetryPluginContext {}

import router from "@/orpc/router"

const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(router, {
      /**
       * Provide initial context if needed.
       *
       * Because this client instance is shared across all requests,
       * only include context that's safe to reuse globally.
       * For per-request context, use middleware context or pass a function as the initial context.
       */
      context: async () => ({
        headers: getRequestHeaders(), // provide headers if initial context required
      }),
    }),
  )
  .client((): RouterClient<typeof router> => {
    const link = new RPCLink<ORPCClientContext>({
      url: () => {
        if (typeof window === "undefined") {
          throw new Error("RPCLink is not allowed on the server side.")
        }

        return `${window.location.origin}/api/rpc`
      },
      plugins: [
        new ClientRetryPlugin(),
        new RetryAfterPlugin({
          condition: (response) => {
            // Override condition to determine if a request should be retried
            return response.status === 429 || response.status === 503
          },
          maxAttempts: 5, // Maximum retry attempts
          timeout: 5 * 60 * 1000, // Maximum time to spend retrying (ms)
        }),
      ],
    })

    return createORPCClient(link)
  })

export const client: RouterClient<typeof router, ORPCClientContext> =
  getORPCClient()

export const orpc = createTanstackQueryUtils(client)
