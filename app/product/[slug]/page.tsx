"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AddToCartModal } from "@/components/add-to-cart-modal"
import { useStore } from "@/lib/store-context"
import { NavigationBar } from "@/components/navigation-bar"
import { Star, Heart, ShoppingCart, Leaf, Plus, Minus, ArrowLeft } from "lucide-react"

type Review = {
  id: number
  user: string
  rating: number
  date: string
  comment: string
  helpful: number
  verified: boolean
}

type ProductVariant = {
  id: number
  name: string
  price: number
  originalPrice?: number
  inStock: boolean
}

type Product = {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  category: string
  description: string
  thc?: string
  cbd?: string
  effects?: string[]
  flavors?: string[]
  inStock: boolean
  stockCount?: number
  rating: number
  reviewCount: number
  isNew?: boolean
  isFeatured?: boolean
}

// Mock product data - in real app, this would come from your database
const getProductBySlug = (slug: string): Product | null => {
  const products: { [key: string]: Product } = {
    "zen-master-og": {
      id: "1",
      name: "Zen Master OG",
      slug: "zen-master-og",
      price: 45.99,
      originalPrice: 55.99,
      category: "flower",
      description:
        "A perfectly balanced hybrid strain that brings inner peace and tranquility. Zen Master OG combines the best of both worlds with its calming indica effects and uplifting sativa qualities.",
      thc: "24%",
      cbd: "2%",
      effects: ["Relaxed", "Happy", "Creative", "Focused"],
      flavors: ["Earthy", "Pine", "Citrus", "Sweet"],
      inStock: true,
      stockCount: 15,
      rating: 4.8,
      reviewCount: 127,
      isNew: false,
      isFeatured: true,
    },
    "panda-dream": {
      id: "2",
      name: "Panda Dream",
      slug: "panda-dream",
      price: 42.0,
      originalPrice: 50.0,
      category: "Flower",
      description: "A dreamy indica-dominant strain perfect for evening relaxation and peaceful sleep.",
      thc: "20-23%",
      cbd: "0.5-1%",
      effects: ["Sleepy", "Relaxed", "Happy", "Euphoric"],
      flavors: ["Berry", "Sweet", "Floral", "Vanilla"],
      inStock: true,
      stockCount: 12,
      rating: 4.7,
      reviewCount: 89,
    },
  }

  return products[slug] || null
}

// Mock similar products
const getSimilarProducts = (category: string, currentProductId: string): Product[] => {
  return [
    {
      id: "2",
      name: "Panda Dream",
      slug: "panda-dream",
      price: 42.0,
      originalPrice: 50.0,
      image: "/placeholder-flower2.png",
      rating: 4.7,
      reviewCount: 89,
      category: "flower",
      inStock: true,
    },
    {
      id: "3",
      name: "Bamboo Bliss",
      slug: "bamboo-bliss",
      price: 48.0,
      originalPrice: 58.0,
      image: "/placeholder-flower3.png",
      rating: 4.9,
      reviewCount: 156,
      category: "flower",
      inStock: true,
    },
    {
      id: "4",
      name: "Tranquil Forest",
      slug: "tranquil-forest",
      price: 40.0,
      originalPrice: 48.0,
      image: "/placeholder-flower4.png",
      rating: 4.6,
      reviewCount: 73,
      category: "flower",
      inStock: true,
    },
  ].filter((p) => p.id !== currentProductId) as Product[]
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [showAddToCartModal, setShowAddToCartModal] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (params.slug) {
      setIsLoading(true)
      // Simulate loading delay
      setTimeout(() => {
        const productData = getProductBySlug(params.slug)
        if (productData) {
          setProduct(productData)
          setSimilarProducts(getSimilarProducts(productData.category, productData.id))
        }
        setIsLoading(false)
      }, 500)
    }
  }, [params.slug])

  const isWishlisted = product ? isInWishlist(product.id) : false

  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist(product)
    }
  }

  const handleAddToCart = useCallback(async () => {
    if (!product) return

    setAddingToCart(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: "Default",
      quantity: quantity,
    })

    setAddingToCart(false)
    setShowAddToCartModal(true)
  }, [product, quantity, addToCart])

  const handleQuantityChange = (change: number) => {
    if (!product || !product.stockCount) return
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-200 text-yellow-400"
              : "text-gray-300"
        }`}
      />
    ))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600 animate-pulse" />
              </div>
            </div>
            <p className="text-green-800 text-lg font-medium">Loading zen product...</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🐼</div>
            <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
            <p className="text-gray-600">The zen product you're looking for doesn't exist.</p>
            <Link href="/store">
              <Button className="bg-green-600 hover:bg-green-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Store
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            {/* Thumbnails could go here */}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              <Badge
                variant={product.inStock ? "default" : "destructive"}
                className={product.inStock ? "bg-green-100 text-green-800" : ""}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <div className="mt-6">
              <span className="text-3xl font-bold text-green-600">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="ml-2 text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="mt-6 text-gray-700 leading-relaxed">{product.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="font-semibold">
                Category: <span className="font-normal text-green-600">{product.category}</span>
              </div>
              <div className="font-semibold">
                THC: <span className="font-normal">{product.thc}</span>
              </div>
              <div className="font-semibold">
                CBD: <span className="font-normal">{product.cbd}</span>
              </div>
              <div className="font-semibold">
                Stock: <span className="font-normal">{product.stockCount} left</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Flavors</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.flavors?.map((flavor) => (
                  <Badge key={flavor} variant="secondary">
                    {flavor}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button variant="ghost" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 font-semibold">{quantity}</span>
                  <Button variant="ghost" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  size="lg"
                  className="flex-grow bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={isWishlisted ? "text-red-500 border-red-500" : ""}
                  onClick={handleToggleWishlist}
                >
                  <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                  Wishlist
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900">You Might Also Like</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarProducts.map((p) => (
              <Card key={p.id} className="overflow-hidden">
                <Link href={`/product/${p.slug}`}>
                  <div className="relative aspect-square">
                    <Image src={p.image || "/placeholder.svg"} alt={p.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{p.name}</h3>
                    <p className="text-green-600">${p.price.toFixed(2)}</p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Add to Cart Modal */}
      {showAddToCartModal && (
        <AddToCartModal
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            variant: "Default",
            quantity: quantity,
          }}
          onClose={() => setShowAddToCartModal(false)}
        />
      )}
    </div>
  )
}
