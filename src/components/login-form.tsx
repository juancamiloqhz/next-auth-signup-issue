"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type * as z from "zod"

import { cn } from "@/lib/utils"
import { loginSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement> & {
  mode: "login" | "register"
}

type FormData = z.infer<typeof loginSchema>

export default function LoginForm({
  className,
  mode,
  ...props
}: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      const signInResult = await signIn("email", {
        email: data.email.toLowerCase(),
        redirect: false,
        callbackUrl: searchParams?.get("from") ?? "/dashboard",
      })

      if (!signInResult?.ok) {
        return toast.error("An error occurred.", {
          description: "Your sign in request failed. Please try again.",
        })
      }

      if (signInResult.url?.endsWith("/register")) {
        return toast.error("Don't have an account?", {
          description: "Sign up to be able to login.",
        })
      }

      return toast.success("Check your email.", {
        description: "We've sent you an email with a link to sign in.",
      })
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong.", {
        description: "Your sign in request failed. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
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
