import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools"
import { QueryClientProvider } from "@tanstack/react-query"

import { getQueryClient } from "@/libs/query"
import Header from "@/components/Header"
import appCss from "@/styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TanStack Start Starter" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <div>
      <h1>404 - Page Not Found</h1>
      <a href="/">Go Home</a>
    </div>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* QueryClientProvider harus wrap semua children */}
        <QueryClientProvider client={queryClient}>
          <Header />
          {children}
          <TanStackDevtools
            config={{ position: "bottom-right" }}
            plugins={[
              {
                name: "Tanstack Query",
                render: <ReactQueryDevtools />,
              },
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              formDevtoolsPlugin(),
            ]}
          />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
