"use client"

import type React from "react"
import { NavigationBar } from "@/components/navigation-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store-context"
import { CreditCard, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore()
  const router = useRouter()

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would process payment here
    clearCart()
    router.push("/order-success")
  }

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <NavigationBar />
        <main className="container mx-auto px-4 py-8 pt-24 text-center">
          <h1 className="text-2xl font-bold">Your cart is empty.</h1>
          <p className="text-gray-600 mt-2">Add items to your cart to proceed to checkout.</p>
          <Button onClick={() => router.push("/store")} className="mt-4">
            Go to Store
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        <form onSubmit={handleCheckout} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Zen St" required />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Pandaville" required />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="CA" required />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="90210" required />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="USA" required />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2" /> Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="•••• •••• •••• 1234" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="truncate pr-2">
                      {item.name} (x{item.quantity})
                    </span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Lock className="mr-2 h-4 w-4" />
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </div>
  )
}
