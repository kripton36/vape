"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NavigationBar } from "@/components/navigation-bar"
import { useStore } from "@/lib/store-context"
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react"

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateCartQuantity, clearCart } = useStore()

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty, panda!</p>
            <Link href="/store">
              <Button className="bg-green-600 hover:bg-green-700">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <Card key={item.id} className="flex items-center p-4 bg-white/80 border-green-200 shadow-lg">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                    {item.variant && <p className="text-sm text-gray-600">Variant: {item.variant}</p>}
                    <p className="text-xl font-bold text-green-600 mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <MinusCircle className="h-5 w-5 text-gray-600" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateCartQuantity(item.id, Number.parseInt(e.target.value))}
                      className="w-16 text-center"
                      min="1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                      <PlusCircle className="h-5 w-5 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full bg-transparent border-red-300 text-red-600 hover:bg-red-50"
              >
                Clear Cart
              </Button>
            </div>

            <Card className="lg:col-span-1 bg-white/80 border-green-200 shadow-lg h-fit sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>Subtotal:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-medium">
                  <span>Shipping:</span>
                  <span>$5.00</span> {/* Placeholder for shipping */}
                </div>
                <div className="flex justify-between text-2xl font-bold text-green-700 border-t pt-4 mt-4">
                  <span>Total:</span>
                  <span>${(cartTotal + 5).toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/checkout" className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">Proceed to Checkout</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
