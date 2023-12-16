"use client"

import React from "react"
import { UserRole } from "@/server/db/schema"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import SignUpCompanyForm from "@/components/signup-company-form"
import SignUpUserForm from "@/components/signup-user-form"

export default function AuthForm() {
  const [mode, setMode] = React.useState<Omit<UserRole, "admin"> | null>(null)
  return (
    <>
      {mode === null && (
        <>
          <Button
            type="button"
            variant="secondary"
            className="flex gap-5 justify-start items-center h-24 whitespace-normal text-left"
            onClick={() => setMode("user")}
          >
            <Icons.user className="h-10 w-10 min-h-[40px] min-w-[40px]" />
            <div className="flex flex-col justify-center items-start">
              <span className="font-semibold text-base">
                Create a user account
              </span>
            </div>
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex gap-5 justify-start items-center h-24 whitespace-normal text-left"
            onClick={() => setMode("company")}
          >
            <Icons.company className="h-10 w-10 min-h-[40px] min-w-[40px]" />
            <div className="flex flex-col justify-center items-start">
              <span className="font-semibold text-base">
                Create a company account
              </span>
            </div>
          </Button>
        </>
      )}
      {mode === UserRole.Company && <SignUpCompanyForm mode="register" />}
      {mode === UserRole.User && <SignUpUserForm mode="register" />}
    </>
  )
}
