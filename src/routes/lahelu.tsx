import { createFileRoute, ErrorComponent } from "@tanstack/react-router"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useForm } from "@tanstack/react-form"
import { orpc } from "@/orpc/clients"
import { isDefinedError } from "@orpc/client"

export const Route = createFileRoute("/lahelu")({
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending, isError, data, error } = useQuery(
    orpc.listTodos.queryOptions({
      input: {},
      context: { cache: true },
      retry: true,
    }),
  )

  const mutation = useMutation(
    orpc.addTodo.mutationOptions({
      retry: true,
      onError: (error) => {
        if (isDefinedError(error)) {
          // Handle type-safe error here
        }
      },
      onSuccess: (data) => {
        // Handle successful mutation here
        console.log(data)
      },
    }),
  )

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    onSubmit: async ({ value }) => {
      mutation.mutate({ name: value.firstName })
      console.log(value)
    },
  })

  if (isPending) return <div>Loading...</div>
  if (isError) return <ErrorComponent error={error} />

  return (
    <div>
      Hello "/lahelu" tampan!
      <ul>
        {data.map((fruit) => (
          <li key={fruit.id}>{fruit.name}</li>
        ))}
      </ul>
      <br />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <div>
          <form.Field name="firstName">
            {(field) => {
              return (
                <>
                  <label htmlFor={field.name}>First Name:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {!field.state.meta.isValid && (
                    <em>{field.state.meta.errors.join(",")}</em>
                  )}
                </>
              )
            }}
          </form.Field>
        </div>
        <div>
          <form.Field name="lastName">
            {(field) => (
              <>
                <label htmlFor={field.name}>Last Name:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {!field.state.meta.isValid && (
                  <em>{field.state.meta.errors.join(",")}</em>
                )}
              </>
            )}
          </form.Field>
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <>
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Submit"}
              </button>
              &nbsp;
              <button
                type="reset"
                onClick={(e) => {
                  e.preventDefault()
                  form.reset()
                }}
              >
                Reset
              </button>
            </>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}
