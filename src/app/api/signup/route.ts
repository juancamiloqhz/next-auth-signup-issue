import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { UserRole, users } from "@/server/db/schema"
import { getCsrfToken } from "next-auth/react"
import { z } from "zod"

import { env } from "@/env"

type SignUpRole = Exclude<UserRole, UserRole.Admin>

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  username: z
    .string()
    .refine(
      (username) =>
        /^[^\s]*$/.test(username) && /^[a-zA-Z0-9_-]+$/.test(username),
      {
        message:
          "Username cannot contain spaces or special characters (except underscore, hyphen)",
      }
    ),
  role: z.nativeEnum(UserRole).refine((role) => role !== UserRole.Admin, {
    message: "Role should not be admin",
  }),
  callbackUrl: z.string(),
})

export async function POST(req: Request) {
  try {
    const { name, email, username, role, callbackUrl } = (await req.json()) as {
      name: string
      email: string
      username: string
      role: SignUpRole
      callbackUrl: string
    }

    // Validate data
    const result = await signupSchema.safeParseAsync({
      name,
      email,
      username,
      role,
      callbackUrl,
    })

    if (!result.success) {
      return new Response("Invalid data.", { status: 400 })
    }

    // Check if email is already in use
    const existingUser = await db.query.users.findFirst({
      where: (queryUser, { eq }) => eq(queryUser.email, email.toLowerCase()),
    })

    if (existingUser) {
      return NextResponse.json(
        {
          error: "This email is already in use.",
          status: 409,
          ok: false,
          url: null,
        },
        { status: 409 }
      )
    }

    // Check if username is already in use
    const existingUsername = await db.query.users.findFirst({
      where: (queryUser, { eq }) => eq(queryUser.username, username),
    })

    if (existingUsername) {
      return NextResponse.json(
        {
          error: "This username is already in use.",
          status: 409,
          ok: false,
          url: null,
        },
        { status: 409 }
      )
    }

    // Create user
    await db.insert(users).values({
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      role,
    })

    // Call signin API route from next-auth
    const res = await fetch(
      `${env.NEXT_PUBLIC_APP_URL}/api/auth/signin/email`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        // @ts-expect-error - Is how they have it in next-auth signin method
        body: new URLSearchParams({
          email,
          csrfToken: await getCsrfToken(),
          redirect: false,
          callbackUrl,
          json: true,
        }),
      }
    )

    console.log("res: ", res.ok, res.status, res.statusText)

    const data = (await res.json()) as { url: string }

    const error = new URL(data.url).searchParams.get("error")

    return NextResponse.json(
      {
        error,
        status: res.status,
        ok: res.ok,
        url: error ? null : data.url,
      },
      { status: 201 }
    )
  } catch (error) {
    console.log("Error: ", error)
    return new Response("Error", { status: 500 })
  }
}
