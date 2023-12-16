import { type Metadata } from "next"
import Link from "next/link"
import { redirect, RedirectType } from "next/navigation"
import { getServerAuthSession } from "@/server/auth"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import LoginForm from "@/components/login-form"

export const metadata = {
  title: "Iniciar sesión",
  description: "Inicia sesión en tu cuenta",
} satisfies Metadata

export default async function LoginPage() {
  const session = await getServerAuthSession()
  if (session) {
    redirect("/dashboard", RedirectType.replace)
  }
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back to home
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="mb-4 flex flex-col space-y-5">
          <Icons.logo className="h-10 w-10" />
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight">
              Login to {siteConfig.name}
            </h1>
            <p className="text-muted-foreground">
              Still dont have an account?{" "}
              <Link href="/register" className="link">
                Create one
              </Link>
              .
            </p>
          </div>
        </div>
        <LoginForm mode="login" />
      </div>
    </div>
  )
}
