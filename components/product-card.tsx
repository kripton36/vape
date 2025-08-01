"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, ShoppingCart, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore, type Product } from "@/lib/store-context"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInWishlist, toggleWishlist } = useStore()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    setTimeout(() => {
      addToCart(product)
      setIsAdding(false)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 1500)
    }, 1000)
  }

  const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  const inWishlist = isInWishlist(product.id)

  return (
    <Card className="group relative w-full overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={`${product.name} - ${product.description}`}
            width={300}
            height={300}
            className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          {product.isNew && <Badge className="bg-yellow-400 text-yellow-900">New</Badge>}
          {product.originalPrice && (
            <Badge variant="destructive">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Badge>
          )}
          {!product.inStock && <Badge variant="secondary">Out of Stock</Badge>}
        </div>

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-pink-500"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart className={cn("h-5 w-5", inWishlist && "fill-pink-500 text-pink-500")} />
        </Button>

        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-green-600">{product.category}</p>
              <h3 className="mt-1 text-lg font-bold text-gray-900 truncate">{product.name}</h3>
            </div>
            <div className="flex items-center mt-1">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm font-medium text-gray-700">{product.rating}</span>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-600 h-10 overflow-hidden">{product.description}</p>

          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">${product.price.toFixed(2)}</p>
              {product.originalPrice && (
                <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
              )}
            </div>
            <Button
              size="lg"
              className={cn(
                "w-36 transition-all duration-300",
                isAdded ? "bg-green-600" : "bg-gray-900 hover:bg-gray-800",
                !product.inStock && "bg-gray-400 cursor-not-allowed",
              )}
              onClick={handleAddToCart}
              disabled={isAdding || isAdded || !product.inStock}
              aria-label={
                !product.inStock 
                  ? `${product.name} is out of stock`
                  : isAdded 
                  ? `${product.name} added to cart`
                  : `Add ${product.name} to cart for $${product.price.toFixed(2)}`
              }
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  <span className="sr-only">Adding to cart...</span>
                </>
              ) : isAdded ? (
                <>
                  <Check className="mr-2 h-5 w-5" aria-hidden="true" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" aria-hidden="true" /> 
                  {!product.inStock ? "Out of Stock" : "Add"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
