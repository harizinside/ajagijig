import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/api/healthcheck")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(
          JSON.stringify({
            status: true,
            message: "System running start",
            data: {
              uptime: process.uptime(),
              memoryUsage: process.memoryUsage(),
            },
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
      },
    },
  },
})
