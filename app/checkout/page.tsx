"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AddressAutocomplete } from "@/components/address-autocomplete"
import { ShoppingCart, CreditCard, Truck, Shield, Copy, Check, Bitcoin, DollarSign, Smartphone } from "lucide-react"

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
]

export default function CheckoutPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cashapp")
  const [cryptoType, setCryptoType] = useState("BTC")
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [copiedOrderNumber, setCopiedOrderNumber] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  })

  // Mock cart items
  const cartItems = [
    {
      id: 1,
      name: "Zen Master OG",
      variant: "1/8 oz (3.5g)",
      price: 45.0,
      quantity: 2,
      image: "/placeholder-flower1.png",
    },
    {
      id: 2,
      name: "Panda Dream Gummies",
      variant: "10mg x 20 pieces",
      price: 35.0,
      quantity: 1,
      image: "/placeholder-gummies.png",
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 75 ? 0 : 8.99
  const tax = subtotal * 0.08
  const discount = subtotal * (promoDiscount / 100)
  const total = subtotal + shipping + tax - discount

  // Generate order number on component mount
  useEffect(() => {
    const generateOrderNumber = () => {
      const year = new Date().getFullYear()
      const randomNum = Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")
      return `PANDA-${year}-${randomNum}`
    }
    setOrderNumber(generateOrderNumber())
  }, [])

  const handleAddressSelect = (address: any) => {
    setShippingInfo((prev) => ({
      ...prev,
      address: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    }))
  }

  const handlePromoCode = () => {
    const validCodes = {
      PANDA10: 10,
      ZEN5: 5,
      BAMBOO15: 15,
      ZENMASTER: 20,
    }

    if (validCodes[promoCode as keyof typeof validCodes]) {
      setPromoDiscount(validCodes[promoCode as keyof typeof validCodes])
    } else {
      alert("Invalid promo code")
    }
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber)
    setCopiedOrderNumber(true)
    setTimeout(() => setCopiedOrderNumber(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "address", "city", "state", "zipCode"]
    const missingFields = requiredFields.filter((field) => !shippingInfo[field as keyof typeof shippingInfo])

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`)
      return
    }

    // Process order
    alert("Order placed successfully! You will receive a confirmation email shortly.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">🐼 Zen Checkout</h1>
          <p className="text-green-700">Complete your order with peaceful vibes</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Shipping & Payment */}
          <div className="space-y-6">
            {/* Order Number Display */}
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <ShoppingCart className="h-5 w-5" />
                  Your Order Number
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
                  <div>
                    <p className="text-sm text-green-700 mb-1">Order Number:</p>
                    <p className="text-2xl font-bold text-green-900 font-mono">{orderNumber}</p>
                    <p className="text-sm text-green-600 mt-1">Use this number for your payment reference</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyOrderNumber}
                    className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                  >
                    {copiedOrderNumber ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-green-800 font-medium">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, firstName: e.target.value }))}
                      required
                      className="border-green-200 focus:border-green-400 focus:ring-green-400/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-green-800 font-medium">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, lastName: e.target.value }))}
                      required
                      className="border-green-200 focus:border-green-400 focus:ring-green-400/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-green-800 font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      className="border-green-200 focus:border-green-400 focus:ring-green-400/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-green-800 font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, phone: e.target.value }))}
                      className="border-green-200 focus:border-green-400 focus:ring-green-400/20"
                    />
                  </div>
                </div>

                <AddressAutocomplete
                  onAddressSelect={handleAddressSelect}
                  placeholder="Start typing your address..."
                  label="Street Address"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-green-800 font-medium">
                      City *
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, city: e.target.value }))}
                      required
                      className="border-green-200 focus:border-green-400 focus:ring-green-400/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-green-800 font-medium">
                      State *
                    </Label>
                    <Select
                      value={shippingInfo.state}
                      onValueChange={(value) => setShippingInfo((prev) => ({ ...prev, state: value }))}
                      required
                    >
                      <SelectTrigger className="border-green-200 focus:border-green-400">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {US_STATES.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-green-800 font-medium">
                      ZIP Code *
                    </Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="12345"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, zipCode: e.target.value }))}
                      required
                      className="border-green-200 focus:border-green-400 focus:ring-green-400/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cashapp")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === "cashapp"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-6 w-6 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-green-900">CashApp</p>
                        <p className="text-sm text-green-600">Quick & Easy</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("crypto")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === "crypto"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Bitcoin className="h-6 w-6 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-green-900">Cryptocurrency</p>
                        <p className="text-sm text-green-600">BTC, ETH, USDC</p>
                      </div>
                    </div>
                  </button>
                </div>

                {paymentMethod === "cashapp" && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">CashApp Payment Instructions:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-green-800">
                      <li>Open your CashApp</li>
                      <li>
                        Send <strong>${total.toFixed(2)}</strong> to <strong>$GreenPandaCannabis</strong>
                      </li>
                      <li>
                        Include your order number <strong>{orderNumber}</strong> in the note
                      </li>
                      <li>Complete your order below</li>
                    </ol>
                  </div>
                )}

                {paymentMethod === "crypto" && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-green-800 font-medium">Select Cryptocurrency:</Label>
                      <Select value={cryptoType} onValueChange={setCryptoType}>
                        <SelectTrigger className="border-green-200 focus:border-green-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                          <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2">Crypto Payment Instructions:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-green-800">
                        <li>
                          Send exactly <strong>${total.toFixed(2)} USD equivalent</strong> in {cryptoType}
                        </li>
                        <li>
                          Use order number <strong>{orderNumber}</strong> as transaction memo
                        </li>
                        <li>Wallet address will be provided after order confirmation</li>
                        <li>Payment must be received within 15 minutes</li>
                      </ol>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="border-green-200 shadow-lg sticky top-4">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-green-900">{item.name}</h4>
                        <p className="text-sm text-green-600">{item.variant}</p>
                        <p className="text-sm text-green-700">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-green-200" />

                {/* Promo Code */}
                <div className="space-y-2">
                  <Label className="text-green-800 font-medium">Promo Code</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="border-green-200 focus:border-green-400"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePromoCode}
                      className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      Apply
                    </Button>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {promoCode} - {promoDiscount}% OFF
                      </Badge>
                    </div>
                  )}
                </div>

                <Separator className="bg-green-200" />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-green-800">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-800">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-green-800">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="bg-green-200" />
                  <div className="flex justify-between text-lg font-bold text-green-900">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Features */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Secure & Discreet</span>
                  </div>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• SSL encrypted checkout</li>
                    <li>• Discreet packaging</li>
                    <li>• Age verification required</li>
                    <li>• 30-day satisfaction guarantee</li>
                  </ul>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Complete Order - ${total.toFixed(2)}
                </Button>

                <p className="text-xs text-green-600 text-center">
                  By placing this order, you confirm you are 21+ and agree to our terms of service.
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  )
}
