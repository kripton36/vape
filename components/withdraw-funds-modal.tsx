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
import { Textarea } from "@/components/ui/textarea"

interface WithdrawFundsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (amount: number, method: string, details: string) => void
  currentBalance: number
}

export function WithdrawFundsModal({ isOpen, onClose, onConfirm, currentBalance }: WithdrawFundsModalProps) {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("bank_transfer")
  const [details, setDetails] = useState("")

  const handleConfirm = () => {
    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > currentBalance) {
      alert("Please enter a valid amount within your current balance.")
      return
    }
    if (!details.trim()) {
      alert("Please provide withdrawal details.")
      return
    }
    onConfirm(numAmount, method, details)
    setAmount("")
    setMethod("bank_transfer")
    setDetails("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>Withdraw funds from your Zen Panda wallet.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="withdraw-amount" className="text-right">
              Amount
            </Label>
            <Input
              id="withdraw-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 25.00"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="withdraw-method" className="text-right">
              Method
            </Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select withdrawal method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cashapp">Cash App</SelectItem>
                <SelectItem value="crypto">Crypto (Bitcoin)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="withdraw-details" className="text-right">
              Details
            </Label>
            <Textarea
              id="withdraw-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="col-span-3"
              placeholder="Bank account number, Cash App tag, or Crypto wallet address"
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">Current Balance: ${currentBalance.toFixed(2)}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Withdrawal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
