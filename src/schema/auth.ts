import * as z from "zod"

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  callbackURL: z.string(),
  phoneNumber: z.string(),
})

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
  callbackURL: z.string(),
})

export type SignUpInput = z.infer<typeof SignUpSchema>

export type SignInInput = z.infer<typeof SignInSchema>
