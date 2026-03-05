import { createFileRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { isDefinedError } from "@orpc/client"
import { SignUpSchema } from "@/schema/auth"
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
import { PasswordInput } from "@/components/PasswordInput"

import { toast } from "sonner"

export const Route = createFileRoute("/auth/sign-up")({
  component: RouteComponent,
})

function RouteComponent() {
  const mutation = useMutation(
    orpc.auth.signUp.mutationOptions({
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
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: SignUpSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate({
        name: value.name,
        email: value.email,
        password: value.password,
        phoneNumber: value.phoneNumber,
        confirmPassword: value.confirmPassword,
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
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Your name:</FieldLabel>
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
                  )}
                </form.Field>

                <form.Field name="phoneNumber">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Phone Number:
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
                  )}
                </form.Field>

                <form.Field name="email">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Email:</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
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
                  )}
                </form.Field>

                {/* PASSWORD FIELD */}
                <form.Field name="password">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Password:</FieldLabel>
                      <PasswordInput field={field} />
                      <FieldDescription>
                        Must be at least 8 characters long.
                      </FieldDescription>
                      {!field.state.meta.isValid && (
                        <em>{field.state.meta.errors.join(",")}</em>
                      )}
                    </Field>
                  )}
                </form.Field>

                {/* CONFIRM PASSWORD FIELD */}
                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChangeListenTo: ["password"],
                    onChange: ({ value, fieldApi }) => {
                      if (value !== fieldApi.form.getFieldValue("password")) {
                        return "Passwords do not match"
                      }
                      return undefined
                    },
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Confirm Password
                      </FieldLabel>
                      <PasswordInput field={field} />
                      <FieldDescription className="text-red-600">
                        {!field.state.meta.isValid && (
                          <em>{field.state.meta.errors.join(",")}</em>
                        )}
                      </FieldDescription>
                    </Field>
                  )}
                </form.Field>

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
