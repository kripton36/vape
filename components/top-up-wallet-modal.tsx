"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface TopUpWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (amount: number, method: string) => void
}

export function TopUpWalletModal({ isOpen, onClose, onConfirm }: TopUpWalletModalProps) {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("credit_card")
  const [qrCodeVisible, setQrCodeVisible] = useState(false)

  const handleConfirm = () => {
    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid amount.")
      return
    }
    if (method === "crypto") {
      setQrCodeVisible(true)
    } else {
      onConfirm(numAmount, method)
      setAmount("")
      setMethod("credit_card")
      setQrCodeVisible(false)
    }
  }

  const handleCryptoPaymentComplete = () => {
    const numAmount = Number.parseFloat(amount)
    onConfirm(numAmount, method)
    setAmount("")
    setMethod("credit_card")
    setQrCodeVisible(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
          <DialogDescription>Top up your Zen Panda wallet balance.</DialogDescription>
        </DialogHeader>
        {!qrCodeVisible ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 50.00"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="method" className="text-right">
                Method
              </Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="cashapp">Cash App</SelectItem>
                  <SelectItem value="crypto">Crypto (Bitcoin)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {method === "credit_card" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cardNumber" className="text-right">
                    Card #
                  </Label>
                  <Input id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiry" className="text-right">
                    Expiry
                  </Label>
                  <Input id="expiry" placeholder="MM/YY" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cvv" className="text-right">
                    CVV
                  </Label>
                  <Input id="cvv" placeholder="123" className="col-span-3" />
                </div>
              </>
            )}
            {method === "cashapp" && (
              <div className="text-center col-span-4">
                <p className="text-sm text-gray-600 mb-2">Send funds to our Cash App: **$ZenPandaVapes**</p>
                <p className="text-xs text-gray-500">Please include your order ID in the memo for faster processing.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 py-4 text-center">
            <p className="text-lg font-semibold">Scan to Pay with Bitcoin</p>
            <Image
              src="/bitcoin-qr-code.png"
              alt="Bitcoin QR Code"
              width={200}
              height={200}
              className="mx-auto rounded-lg"
            />
            <p className="text-sm text-gray-600">
              Send **{Number.parseFloat(amount).toFixed(8)} BTC** to the address below:
            </p>
            <Input value="bc1qxy2k3j4l5m6n7p8q9r0s1t2u3v4w5x6y7z8a9b" readOnly className="text-center text-xs" />
            <Button onClick={handleCryptoPaymentComplete}>I have sent the payment</Button>
          </div>
        )}
        <DialogFooter>
          {!qrCodeVisible && (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Confirm Top Up</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
