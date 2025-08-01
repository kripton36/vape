import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LiveChat } from "@/components/live-chat"
import { StoreProvider } from "@/lib/store-context"
import { Toaster } from "@/components/ui/toaster"
import ErrorBoundary from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Green Panda - Premium Cannabis Products",
  description:
    "Discover zen with our premium cannabis collection. Organic, lab-tested products for your peaceful journey.",
  generator: "v0.dev",
  keywords: "cannabis, weed, marijuana, dispensary, CBD, THC, edibles, flower, concentrates",
  authors: [{ name: "Green Panda Team" }],
  openGraph: {
    title: "Green Panda - Premium Cannabis Products",
    description: "Discover zen with our premium cannabis collection. Organic, lab-tested products for your peaceful journey.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Green Panda - Premium Cannabis Products",
    description: "Discover zen with our premium cannabis collection. Organic, lab-tested products for your peaceful journey.",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  }
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
