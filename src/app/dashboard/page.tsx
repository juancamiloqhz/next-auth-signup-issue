import { type Metadata } from "next"

export const metadata = {
  title: "Dashboard",
  description: "Dashboard of the app",
} satisfies Metadata

export default function DashboardPage() {
  return (
    <div className="flex-col flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight font-gradient">
            Dashboard
          </h2>
        </div>
      </div>
    </div>
  )
}
