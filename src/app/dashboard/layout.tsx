import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/server/auth"

import { SiteFooter } from "@/components/site-footer"
import { UserNav } from "@/app/dashboard/components/user-nav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerAuthSession()
  if (!session) {
    redirect("/login")
  }
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="ml-auto flex items-center space-x-4">
            <UserNav session={session} />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
