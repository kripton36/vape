"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Heart, ShoppingCart, Eye } from "lucide-react"

interface ProductCardProps {
  product: {
    id: number
    name: string
    slug: string
    price: number
    originalPrice?: number
    image: string
    rating: number
    reviewCount: number
    category: string
    badge?: string
    inStock: boolean
  }
  onQuickView?: (product: any) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-200 text-yellow-400"
              : "text-gray-300"
        }`}
      />
    ))
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAddingToCart(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsAddingToCart(false)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product)
  }

  return (
    <Card
      className={`group relative overflow-hidden border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
        isHovered ? "scale-[1.02]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <Link href={`/product/${product.slug}`} className="block">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.badge && (
                <Badge className="bg-green-600 text-white shadow-lg animate-pulse">{product.badge}</Badge>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge className="bg-red-500 text-white shadow-lg">Sale</Badge>
              )}
              {!product.inStock && <Badge className="bg-gray-500 text-white shadow-lg">Out of Stock</Badge>}
            </div>

            {/* Floating Action Buttons */}
            <div
              className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              }`}
            >
              <Button
                size="sm"
                variant={isWishlisted ? "default" : "outline"}
                className={`rounded-full p-2 shadow-lg backdrop-blur-sm ${
                  isWishlisted ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white/90 hover:bg-white text-gray-700"
                }`}
                onClick={handleWishlist}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="rounded-full p-2 shadow-lg bg-white/90 hover:bg-white text-gray-700 backdrop-blur-sm"
                onClick={handleQuickView}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Hover Overlay */}
            <div
              className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Quick Add to Cart Button */}
            <div
              className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className={`w-full bg-green-600 hover:bg-green-700 text-white shadow-lg backdrop-blur-sm transition-all duration-200 ${
                  isAddingToCart ? "scale-95" : "scale-100"
                }`}
              >
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Quick Add</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Panda Icon */}
            <div className="absolute bottom-2 right-2 text-lg opacity-60">🐼</div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
              <span className="text-xs text-gray-600">
                {product.rating} ({product.reviewCount})
              </span>
            </div>

            {/* Product Name */}
            <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-green-700 transition-colors">
              {product.name}
            </h3>

            {/* Category */}
            <p className="text-sm text-gray-600 capitalize font-medium">{product.category}</p>

            {/* Pricing */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-green-700">${product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge variant="destructive" className="text-xs bg-red-100 text-red-800">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
              <span className={`text-xs font-medium ${product.inStock ? "text-green-700" : "text-red-700"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </Link>
      </CardContent>

      {/* Animated Border Effect */}
      <div
        className={`absolute inset-0 rounded-lg border-2 border-green-400 transition-opacity duration-300 pointer-events-none ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Zen Energy Effect */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg blur opacity-20 transition-opacity duration-300 ${
          isHovered ? "opacity-30" : "opacity-0"
        }`}
      />
    </Card>
  )
}
