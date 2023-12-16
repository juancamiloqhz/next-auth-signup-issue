import { type Metadata } from "next"
import Link from "next/link"
import { redirect, RedirectType } from "next/navigation"
import { getServerAuthSession } from "@/server/auth"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import AuthForm from "@/components/auth-form"
import { Icons } from "@/components/icons"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
} satisfies Metadata

export default async function RegisterPage() {
  const session = await getServerAuthSession()
  if (session) {
    redirect("/dashboard", RedirectType.replace)
  }
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Back to home
      </Link>
      <div className="hidden h-full bg-muted lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[470px]">
          <div className="mb-4 flex flex-col space-y-5">
            <Icons.logo className="h-10 w-10" />
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account in {siteConfig.name}
              </h1>
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="link">
                  Login
                </Link>
                .
              </p>
            </div>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
