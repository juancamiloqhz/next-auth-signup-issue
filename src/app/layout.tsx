import "@/styles/globals.css"

import { type Metadata } from "next"
import { cookies } from "next/headers"
import { TRPCReactProvider } from "@/trpc/react"
import { GeistSans } from "geist/font"
import { Toaster } from "sonner"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: siteConfig.name,
  description: `${siteConfig.name} Description`,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
} satisfies Metadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider cookies={cookies().toString()}>
            {children}
          </TRPCReactProvider>
          <Toaster closeButton richColors />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
