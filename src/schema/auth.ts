import * as z from "zod"

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  phoneNumber: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
})

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
})

export type SignUpInput = z.infer<typeof SignUpSchema>

export type SignInInput = z.infer<typeof SignInSchema>
