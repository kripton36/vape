"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function OrderSuccessPage() {
  const orderDetails = {
    orderNumber: "PANDA-2024-123456",
    total: 93.97,
    items: [
      { name: "Panda's Choice", quantity: 2, price: 29.99, image: "/placeholder-defpf.png" },
      { name: "Bamboo Bliss", quantity: 1, price: 39.99, image: "/placeholder-flower1.png" },
    ],
    estimatedDelivery: "2-3 business days",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="relative inline-block mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <div className="absolute -top-2 -right-4 text-4xl animate-bounce">🐼</div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tighter text-gray-900">Your Zen Order is Confirmed!</h1>
        <p className="text-lg text-gray-600 mt-2 mb-8">
          Thank you! Your order <span className="font-semibold text-green-600">#{orderDetails.orderNumber}</span> is on
          its way.
        </p>

        <Card className="text-left mb-8 bg-white/80 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t border-green-200 pt-4 flex justify-between items-center font-bold text-lg">
              <span>Total</span>
              <span>${orderDetails.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="text-left bg-white/80 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Estimated Delivery</p>
              <p className="text-gray-600 mb-4">{orderDetails.estimatedDelivery}</p>
              <p className="text-xs text-gray-500">You'll receive a tracking number via email once your order ships.</p>
            </CardContent>
          </Card>
          <Card className="text-left bg-white/80 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We're preparing your order with love and zen. Get ready for a peaceful experience!
              </p>
              <Link href="/pro-store">
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full bg-transparent rounded-full border-green-300">
                  Go to My Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
