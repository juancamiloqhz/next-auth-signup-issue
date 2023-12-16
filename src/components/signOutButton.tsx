"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"

export default function SignOutButton() {
  const [loading, setLoading] = useState(false)
  return (
    <Button
      onClick={() => {
        setLoading(true)
        signOut()
          .catch(() => console.error)
          .finally(() => setLoading(false))
      }}
      size="lg"
    >
      {loading ? "Logging out..." : "Sign out"}
    </Button>
  )
}
