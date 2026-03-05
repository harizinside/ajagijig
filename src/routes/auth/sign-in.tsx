import { createFileRoute } from "@tanstack/react-router"
import { Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { isDefinedError } from "@orpc/client"
import { orpc } from "@/orpc/clients"
import { Button } from "@/components/ui/button"
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
  const navigate = useNavigate()

  const mutation = useMutation(
    orpc.auth.signIn.mutationOptions({
      retry: true,
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error("Sign up failed", {
            description: JSON.stringify(error),
          })
          console.error(error)
        }
      },
      onSuccess: (data) => {
        toast.success("Account created!", { id: "sign-up-success" }) // ← pakai id agar tidak duplikat
        navigate({ to: "/auth/sign-in" })
        console.info(data)
      },
    }),
  )

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      // onSubmit: SignUpSchema,
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
              <form>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        to="/auth/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input id="password" type="password" required />
                  </Field>
                  <Field>
                    <Button type="submit">Login</Button>
                    <Button variant="outline" type="button">
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
