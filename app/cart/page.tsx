"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store-context"
import { Plus, Minus, ShoppingCart, X } from "lucide-react"
import { NavigationBar } from "@/components/navigation-bar"

export default function CartPage() {
  const { cart, cartTotal, cartCount, updateCartQuantity, removeFromCart } = useStore()

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center mb-8">
          <ShoppingCart className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Your Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐼</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/store">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="flex items-center p-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden mr-4">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-3">{item.quantity}</span>
                      <Button variant="ghost" size="sm" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="font-semibold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                      <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-4">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
