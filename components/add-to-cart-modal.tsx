"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type AddToCartModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  product: {
    name: string
    image: string
    price: number
  } | null
}

export function AddToCartModal({ isOpen, onOpenChange, product }: AddToCartModalProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="text-2xl">🐼</div>
            Added to your bamboo basket!
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4 py-4">
          <div className="w-24 h-24 bg-green-100 rounded-lg flex items-center justify-center">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={80}
              height={80}
              objectFit="contain"
            />
          </div>
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-500">${product.price.toFixed(2)}</p>
          </div>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
            Keep Shopping
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full">
            Go to Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
