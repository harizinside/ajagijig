import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { createFileRoute } from "@tanstack/react-router"
import { Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { isDefinedError } from "@orpc/client"
import { orpc } from "@/orpc/clients"
import { Button } from "@/components/ui/button"
import { SignInSchema } from "@/schema/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export const Route = createFileRoute("/auth/sign-in")({
  component: RouteComponent,
})

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const mutation = useMutation(
    orpc.auth.signIn.mutationOptions({
      retry: true,
      onMutate: () => {
        setIsLoading(true)
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error("Sign up failed", {
            description: JSON.stringify(error),
          })
          console.error(error)
        }
      },
      onSuccess: (data) => {
        navigate({ to: "/dashboard" })
        console.info(data)
      },
      onSettled() {
        setIsLoading(false)
      },
    }),
  )

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: SignInSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate({
        email: value.email,
        password: value.password,
      })
    },
  })

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  form.handleSubmit()
                }}
              >
                <FieldGroup>
                  <form.Field name="email">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          placeholder="m@example.com"
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {!field.state.meta.isValid && (
                          <em>{field.state.meta.errors.join(",")}</em>
                        )}
                      </Field>
                    )}
                  </form.Field>
                  <form.Field name="password">
                    {(field) => (
                      <Field>
                        <div className="flex items-center">
                          <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                          <Link
                            to="/auth/forgot-password"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Input
                            id={field.name}
                            name={field.name}
                            type={showPassword ? "text" : "password"}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            required
                            className="pr-10"
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {!field.state.meta.isValid && (
                          <em>{field.state.meta.errors.join(",")}</em>
                        )}
                      </Field>
                    )}
                  </form.Field>
                  <Field>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isLoading}
                    >
                      Login with Google
                    </Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account?{" "}
                      <Link to="/auth/sign-up">Sign up</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
