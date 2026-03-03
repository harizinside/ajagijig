import { os } from "@/orpc"
import { auth } from "@/lib/auth"
import { SignUpSchema, SignInSchema } from "@/schema/auth"

export const signUp = os
  .input(SignUpSchema)
  .handler(async ({ input, context }) => {
    const data = await auth.api.signUpEmail({
      body: {
        name: input.name,
        email: input.email,
        password: input.password,
        image: "/images/default.webp",
        callbackURL: input.callbackURL,
        phoneNumber: input.phoneNumber,
      },
      headers: context.reqHeaders,
    })

    return data
  })

export const signIn = os
  .input(SignInSchema)
  .handler(async ({ input, context }) => {
    const data = await auth.api.signInEmail({
      body: {
        email: input.email,
        password: input.password,
        callbackURL: input.callbackURL,
      },
      headers: context.reqHeaders,
    })
  })
