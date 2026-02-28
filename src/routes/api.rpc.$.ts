import { RPCHandler } from "@orpc/server/fetch"
import { CORSPlugin } from "@orpc/server/plugins"
import { createFileRoute } from "@tanstack/react-router"
import { onError } from "@orpc/server"
import router from "@/orpc/router"

const handler = new RPCHandler(router, {
  plugins: [new CORSPlugin()],
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
          context: {}, // Provide initial context if needed
        })

        if (matched) {
          return response
        }

        return response ?? new Response("Not Found", { status: 404 })
      },
    },
  },
})
