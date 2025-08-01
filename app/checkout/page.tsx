"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { NavigationBar } from "@/components/navigation-bar"
import { useStore } from "@/lib/store-context"
import { useRouter } from "next/navigation"
import { createOrder } from "@/lib/order-service" // Assuming this service exists
import { toast } from "@/components/ui/use-toast"

export default function CheckoutPage() {
  const { cart, cartTotal, user, clearCart } = useStore()
  const router = useRouter()

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
  })
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [qrCodeVisible, setQrCodeVisible] = useState(false)

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.id]: e.target.value })
  }

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value)
    setQrCodeVisible(false) // Reset QR code visibility when changing method
  }

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Not Logged In",
        description: "Please log in to complete your order.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    // Basic validation for shipping info
    const requiredFields = ["fullName", "address", "city", "state", "zip"]
    for (const field of requiredFields) {
      if (!(shippingInfo as any)[field]) {
        toast({
          title: "Missing Shipping Information",
          description: `Please fill in your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.`,
          variant: "destructive",
        })
        return
      }
    }

    if (paymentMethod === "crypto") {
      setQrCodeVisible(true)
      return // Wait for user to confirm crypto payment
    }

    setIsProcessing(true)
    try {
      const orderData = {
        userId: user.id,
        items: cart,
        total: cartTotal + 5, // Assuming $5 shipping
        shippingAddress: shippingInfo,
        paymentMethod: paymentMethod,
      }

      const order = await createOrder(orderData) // Mock API call
      console.log("Order placed:", order)

      toast({
        title: "Order Placed!",
        description: `Your order #${order.id} has been successfully placed.`,
        variant: "default",
      })
      clearCart()
      router.push("/order-success")
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCryptoPaymentComplete = async () => {
    if (!user) return // Should not happen if checks above are in place

    setIsProcessing(true)
    try {
      const orderData = {
        userId: user.id,
        items: cart,
        total: cartTotal + 5, // Assuming $5 shipping
        shippingAddress: shippingInfo,
        paymentMethod: "crypto",
      }

      const order = await createOrder(orderData) // Mock API call
      console.log("Crypto order placed:", order)

      toast({
        title: "Order Placed!",
        description: `Your order #${order.id} has been successfully placed. Please complete the crypto payment.`,
        variant: "default",
      })
      clearCart()
      router.push("/order-success")
    } catch (error) {
      console.error("Error placing crypto order:", error)
      toast({
        title: "Order Failed",
        description: "There was an error placing your crypto order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const totalAmount = cartTotal + 5 // Assuming $5 shipping

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <Card className="lg:col-span-2 bg-white/80 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>Enter your delivery details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={shippingInfo.fullName} onChange={handleShippingChange} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email || ""} disabled />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={shippingInfo.address} onChange={handleShippingChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={shippingInfo.city} onChange={handleShippingChange} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={shippingInfo.state} onChange={handleShippingChange} />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" value={shippingInfo.zip} onChange={handleShippingChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={shippingInfo.country}
                  onValueChange={(value) => setShippingInfo({ ...shippingInfo, country: value })}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="CAN">Canada</SelectItem>
                    <SelectItem value="MEX">Mexico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea id="notes" placeholder="e.g., Leave at front door" />
              </div>
            </CardContent>
          </Card>

          {/* Payment Details & Order Summary */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-white/80 border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Choose your preferred payment method.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={paymentMethod} onValueChange={handlePaymentMethodChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="credit_card">Credit Card</TabsTrigger>
                    <TabsTrigger value="cashapp">Cash App</TabsTrigger>
                    <TabsTrigger value="crypto">Crypto</TabsTrigger>
                  </TabsList>
                  <TabsContent value="credit_card" className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="cashapp" className="mt-4 space-y-4 text-center">
                    <p className="text-lg font-semibold">Send funds to:</p>
                    <p className="text-2xl font-bold text-green-600">$ZenPandaVapes</p>
                    <p className="text-sm text-gray-600">
                      Please include your order ID in the memo for faster processing.
                    </p>
                  </TabsContent>
                  <TabsContent value="crypto" className="mt-4 space-y-4 text-center">
                    {!qrCodeVisible ? (
                      <>
                        <p className="text-lg font-semibold">Pay with Bitcoin</p>
                        <p className="text-sm text-gray-600">Click "Place Order" to generate QR code and address.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-semibold">Scan to Pay with Bitcoin</p>
                        <Image
                          src="/bitcoin-qr-code.png"
                          alt="Bitcoin QR Code"
                          width={200}
                          height={200}
                          className="mx-auto rounded-lg"
                        />
                        <p className="text-sm text-gray-600">
                          Send **{(totalAmount / 50000).toFixed(8)} BTC** (approx) to the address below:
                        </p>
                        <Input
                          value="bc1qxy2k3j4l5m6n7p8q9r0s1t2u3v4w5x6y7z8a9b"
                          readOnly
                          className="text-center text-xs"
                        />
                        <Button onClick={handleCryptoPaymentComplete} disabled={isProcessing}>
                          {isProcessing ? "Processing..." : "I have sent the payment"}
                        </Button>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-white/80 border-green-200 shadow-lg h-fit sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-700">
                    <span>
                      {item.name} {item.variant ? `(${item.variant})` : ""} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-lg font-medium border-t pt-4">
                  <span>Subtotal:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-medium">
                  <span>Shipping:</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-green-700 border-t pt-4 mt-4">
                  <span>Total:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handlePlaceOrder}
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                  disabled={isProcessing}
                >
                  {isProcessing && paymentMethod !== "crypto" ? "Placing Order..." : "Place Order"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
