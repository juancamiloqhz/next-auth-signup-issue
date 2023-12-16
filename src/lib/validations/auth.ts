import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
})

export const signupSchema = z.object({
  name: z.string().min(3, { message: "Invalid name" }),
  email: z.string().email({ message: "Invalid email" }),
  username: z
    .string()
    .refine(
      (username) =>
        /^[^\s]*$/.test(username) && /^[a-zA-Z0-9_-]+$/.test(username),
      {
        message:
          "Username can't contain spaces or special characters (except underscore and dash)",
      }
    ),
})
