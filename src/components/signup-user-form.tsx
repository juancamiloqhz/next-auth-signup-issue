"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import type * as z from "zod"

import { cn } from "@/lib/utils"
import { signupSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ErrorMessage from "@/components/error-message"
import { Icons } from "@/components/icons"
import SuccessMessage from "@/components/success-message"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement> & {
  mode: "login" | "register"
}

type FormData = z.infer<typeof signupSchema>

export default function SignUpUserForm({
  className,
  mode,
  ...props
}: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const [formErrorMessage, setFormErrorMessage] = React.useState<string | null>(
    null
  )
  const [formSuccessMessage, setFormSuccessMessage] = React.useState<{
    title: string | null
    message: string | null
  }>({ title: null, message: null })

  const searchParams = useSearchParams()

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    setFormErrorMessage(null)
    setFormSuccessMessage({ title: null, message: null })

    try {
      const signInResult = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email.toLowerCase(),
          name: data.name,
          role: "user",
          username: data.username,
          callbackUrl: searchParams?.get("from") ?? "/dashboard",
        }),
      })

      const json = (await signInResult.json()) as {
        ok: boolean
        error: string | null
        url: string
        status: number
      }

      if (!json.ok && json.error) {
        return setFormErrorMessage(json.error)
      }

      setFormSuccessMessage({
        title: "¡Account created!",
        message: "We sent you a login link. Be sure to check your spam too.",
      })
    } catch (error: unknown) {
      console.error("error: ", error)
      if (error instanceof Error) {
        setFormErrorMessage(
          "There was an error signing in. Please try again later."
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <ErrorMessage error={formErrorMessage} />
      <SuccessMessage
        title={formSuccessMessage.title}
        message={formSuccessMessage.message}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-muted-foreground">
              Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              type="text"
              // autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-muted-foreground">
              Username
            </Label>
            <Input
              id="username"
              placeholder="johndoe"
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register("username")}
            />
            {errors?.username && (
              <p className="px-1 text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              placeholder="panic@thedis.co"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {mode === "login" ? "Continue" : "Create account"}{" "}
            {isLoading ? (
              <Icons.spinner className="ml-2 h-5 w-5 animate-spin" />
            ) : (
              <Icons.arrowRight className="ml-2 h-5 w-5" />
            )}
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGoogleLoading(true)
          void signIn("google", { callbackUrl: "/dashboard" })
        }}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </button>
    </div>
  )
}
