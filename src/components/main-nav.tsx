"use client"

import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function MainNav() {
  return (
    <div className="flex w-full items-center justify-between gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 justify-self-end">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "px-4"
          )}
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className={cn(buttonVariants({ size: "sm" }), "px-4")}
        >
          <>
            Start
            <Icons.chevronRight className="ml-2 h-4 w-4" />
          </>
        </Link>
      </nav>
    </div>
  )
}
