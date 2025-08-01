"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Minus, X, ShoppingBag, Truck, Shield, ArrowRight, Leaf, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default function CartPage() {
  const [floatingLeaves, setFloatingLeaves] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    const leaves = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }))
    setFloatingLeaves(leaves)
  }, [])

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Panda's Choice",
      price: 29.99,
      quantity: 2,
      image: "/placeholder-defpf.png",
      flavor: "Zen Blend",
      category: "vapes",
      badge: "Bestseller",
    },
    {
      id: 2,
      name: "Panda Munchies",
      price: 24.99,
      quantity: 1,
      image: "/placeholder-gummies.png",
      flavor: "Sweet Bamboo",
      category: "edibles",
      badge: "Fan Favorite",
    },
    {
      id: 3,
      name: "Bamboo Bliss",
      price: 39.99,
      quantity: 1,
      image: "/placeholder-flower1.png",
      strain: "Premium",
      category: "flowers",
      badge: "Premium",
    },
  ])

  const updateQuantity = (id: number, change: number) => {
    setCartItems((items) =>
      items
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 75 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Floating Leaves */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {floatingLeaves.map((leaf) => (
            <div
              key={leaf.id}
              className="absolute opacity-20"
              style={{
                left: `${leaf.x}%`,
                top: `${leaf.y}%`,
                animationDelay: `${leaf.delay}s`,
                animation: `float 8s ease-in-out infinite ${leaf.delay}s`,
              }}
            >
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center space-y-6">
          <div className="text-6xl mb-4">🐼</div>
          <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto" />
          <h2 className="text-4xl font-black text-gray-900">Your Zen Cart is Empty</h2>
          <p className="text-gray-600 text-lg">"A peaceful panda always keeps their garden full"</p>
          <Link href="/pro-store">
            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-full">
              <Leaf className="mr-2 h-5 w-5" />
              Explore the Garden
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-900 relative overflow-hidden">
      {/* Floating Leaves */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {floatingLeaves.map((leaf) => (
          <div
            key={leaf.id}
            className="absolute opacity-20"
            style={{
              left: `${leaf.x}%`,
              top: `${leaf.y}%`,
              animationDelay: `${leaf.delay}s`,
              animation: `float 8s ease-in-out infinite ${leaf.delay}s`,
            }}
          >
            <Leaf className="h-6 w-6 text-green-600" />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/pro-store"
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Garden</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🐼</div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                ZEN CART
              </h1>
            </div>
            <div className="text-sm text-gray-600 font-semibold">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} • Panda Approved
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="mb-6">
              <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 font-semibold">
                <Heart className="h-4 w-4 mr-2" />
                PANDA'S SELECTION
              </Badge>
            </div>

            {cartItems.map((item, index) => (
              <Card
                key={item.id}
                className="bg-white border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                      <Badge className="absolute -top-2 -right-2 text-xs bg-green-500 text-white">{item.badge}</Badge>
                      <div className="absolute bottom-1 right-1 text-sm">🐼</div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 capitalize font-semibold">
                        {item.category} • {item.flavor || item.strain}
                      </p>
                      <p className="text-2xl font-bold text-green-600">${item.price}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 bg-green-50 rounded-lg p-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-gray-600 hover:text-green-600 hover:bg-green-100"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-bold text-gray-900">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-gray-600 hover:text-green-600 hover:bg-green-100"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <Card className="sticky top-24 bg-white border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <div className="text-xl">🐼</div>
                <span>Zen Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Panda Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-bold" : ""}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    Add ${(75 - subtotal).toFixed(2)} more for free panda shipping
                  </p>
                )}
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="bg-green-200" />
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span className="text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/checkout">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-full">
                    Complete Zen Order
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Truck className="h-4 w-4 text-green-500" />
                    <span>Free shipping over $75</span>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Panda-protected checkout</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-lg border border-green-300">
                <div className="text-center">
                  <div className="text-2xl mb-2">🐼</div>
                  <p className="text-sm text-gray-700 italic">
                    "Every order brings you closer to zen. Thank you for choosing Green Panda!"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  )
}
