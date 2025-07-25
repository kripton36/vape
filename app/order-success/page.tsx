"use client"

import { NavigationBar } from "@/components/navigation-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OrderSuccessPage() {
  const router = useRouter()

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8 pt-24 flex items-center justify-center">
        <Card className="w-full max-w-lg text-center p-8">
          <CardContent>
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900">Order Placed Successfully!</h1>
            <p className="mt-2 text-gray-600">Thank you for your purchase. Your zen is on its way!</p>
            <p className="text-gray-600 mt-1">
              You will receive an email confirmation shortly with your order details.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button onClick={() => router.push("/store")} className="bg-green-600 hover:bg-green-700 text-white">
                Continue Shopping
              </Button>
              <Button onClick={() => router.push("/dashboard")} variant="outline">
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
