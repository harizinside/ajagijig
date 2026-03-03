import { CompressionPlugin, RPCHandler } from "@orpc/server/fetch"
import { getFilenameFromContentDisposition } from "@orpc/standard-server"
import { CORSPlugin } from "@orpc/server/plugins"
import { createFileRoute } from "@tanstack/react-router"
import { RequestHeadersPlugin } from "@orpc/server/plugins"
import { onError } from "@orpc/server"
import router from "@/orpc/router"

const OVERRIDE_BODY_CONTEXT = Symbol("OVERRIDE_BODY_CONTEXT")

interface OverrideBodyContext {
  fetchRequest: Request
}

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
  adapterInterceptors: [
    (options) => {
      return options.next({
        ...options,
        context: {
          ...options.context,
          [OVERRIDE_BODY_CONTEXT as any]: {
            fetchRequest: options.request,
          },
        },
      })
    },
  ],
  rootInterceptors: [
    (options) => {
      const { fetchRequest } = (options.context as any)[
        OVERRIDE_BODY_CONTEXT
      ] as OverrideBodyContext

      return options.next({
        ...options,
        request: {
          ...options.request,
          async body() {
            const contentDisposition = fetchRequest.headers.get(
              "content-disposition",
            )
            const contentType = fetchRequest.headers.get("content-type")

            if (
              contentDisposition === null &&
              contentType?.startsWith("multipart/form-data")
            ) {
              // Custom handling for multipart/form-data
              // Example: use @mjackson/form-data-parser for streaming parsing
              return fetchRequest.formData()
            }

            // if has content-disposition always treat as file upload
            if (
              contentDisposition !== null ||
              (!contentType?.startsWith("application/json") &&
                !contentType?.startsWith("application/x-www-form-urlencoded"))
            ) {
              // Custom handling for file uploads
              // Example: streaming file into disk to reduce memory usage
              const fileName =
                getFilenameFromContentDisposition(contentDisposition ?? "") ??
                "blob"
              const blob = await fetchRequest.blob()
              return new File([blob], fileName, {
                type: blob.type,
              })
            }

            // fallback to default body parser
            return options.request.body()
          },
        },
      })
    },
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
