import { CompressionPlugin, RPCHandler } from "@orpc/server/fetch"
import { CORSPlugin } from "@orpc/server/plugins"
import { createFileRoute } from "@tanstack/react-router"
import { RequestHeadersPlugin } from "@orpc/server/plugins"
import { onError } from "@orpc/server"
import router from "@/orpc/router"

const handler = new RPCHandler(router, {
  plugins: [
    new CompressionPlugin(),
    new CORSPlugin({
      origin: (origin) => origin,
      allowMethods: [
        "GET",
        "HEAD",
        "PUT",
        "POST",
        "DELETE",
        "PATCH",
        "OPTIONS",
      ],
    }),
    new RequestHeadersPlugin(),
  ],
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      ANY: async ({ request }: { request: Request }) => {
        const { matched, response } = await handler.handle(request, {
          prefix: "/api/rpc",
          context: request.headers, // Provide initial context if needed
        })

        if (matched) {
          return response
        }

        return response ?? new Response("Not Found", { status: 404 })
      },
    },
  },
})
