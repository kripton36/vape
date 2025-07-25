"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useStore, type Product } from "@/lib/store-context"
import { Minus, Plus, ShoppingCart, Star, Leaf, Check } from "lucide-react"

interface AddToCartModalProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddToCartModal({ product, open, onOpenChange }: AddToCartModalProps) {
  const { addToCart } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    addToCart(product, quantity)
    setIsAdding(false)
    setIsAdded(true)

    // Auto close after success
    setTimeout(() => {
      setIsAdded(false)
      onOpenChange(false)
      setQuantity(1)
    }, 1500)
  }

  const incrementQuantity = () => {
    if (quantity < product.stockCount) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const totalPrice = (product.price * quantity).toFixed(2)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">Add to Cart</DialogTitle>
          <DialogDescription className="text-left">
            Choose your quantity and add this zen product to your cart.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex gap-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-green-50">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-gray-900 leading-tight">{product.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Leaf className="w-3 h-3 mr-1" />
                  {product.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {product.thc && <span className="text-gray-600">THC: {product.thc}</span>}
                {product.cbd && <span className="text-gray-600">CBD: {product.cbd}</span>}
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 p-0 bg-transparent"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex-1 text-center">
                <span className="text-lg font-semibold">{quantity}</span>
                <div className="text-xs text-gray-500">{product.stockCount} available</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={incrementQuantity}
                disabled={quantity >= product.stockCount}
                className="w-10 h-10 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Effects Preview */}
          {product.effects && product.effects.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Effects</label>
              <div className="flex flex-wrap gap-1">
                {product.effects.slice(0, 4).map((effect, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-green-50 text-green-700">
                    {effect}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="bg-green-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Unit Price:</span>
              <span className="font-medium">${product.price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Quantity:</span>
              <span className="font-medium">{quantity}</span>
            </div>
            <div className="border-t border-green-200 pt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-green-600">${totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded || !product.inStock}
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Adding to Cart...
              </>
            ) : isAdded ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart - ${totalPrice}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
