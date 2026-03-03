import { createFileRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
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
import { SignUpSchema } from "@/schema/auth"

export const Route = createFileRoute("/auth/sign-up")({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      callbackURL: "",
      phoneNumber: "",
    },
    validators: {
      onSubmit: SignUpSchema,
    },
    onSubmit: async ({ value }) => {
      toast("You submitted the following values:", {
        description: (
          <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      })
    },
  })

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your information below to create your account
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
                <form.Field name="name">
                  {(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          First Name:
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {!field.state.meta.isValid && (
                          <em>{field.state.meta.errors.join(",")}</em>
                        )}
                      </Field>
                    )
                  }}
                </form.Field>
                <form.Field name="email">
                  {(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          First Name:
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldDescription>
                          We&apos;ll use this to contact you. We will not share
                          your email with anyone else.
                        </FieldDescription>
                        {!field.state.meta.isValid && (
                          <em>{field.state.meta.errors.join(",")}</em>
                        )}
                      </Field>
                    )
                  }}
                </form.Field>
                <form.Field name="password">
                  {(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          First Name:
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          type="password"
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldDescription>
                          Must be at least 8 characters long.
                        </FieldDescription>
                        {!field.state.meta.isValid && (
                          <em>{field.state.meta.errors.join(",")}</em>
                        )}
                      </Field>
                    )
                  }}
                </form.Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input id="confirm-password" type="password" required />
                  <FieldDescription>
                    Please confirm your password.
                  </FieldDescription>
                </Field>

                <FieldGroup>
                  <Field>
                    <Button type="submit">Create Account</Button>
                    <Button variant="outline" type="button">
                      Sign up with Google
                    </Button>
                    <FieldDescription className="px-6 text-center">
                      Already have an account?{" "}
                      <Link to="/auth/sign-in">Sign in</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
