import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LiveChat } from "@/components/live-chat"
import { StoreProvider } from "@/lib/store-context"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Green Panda - Premium Cannabis Products",
  description:
    "Discover zen with our premium cannabis collection. Organic, lab-tested products for your peaceful journey.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <StoreProvider>
            {children}
            <LiveChat />
            <Toaster />
          </StoreProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
