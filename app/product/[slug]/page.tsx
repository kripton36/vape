"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AddToCartModal } from "@/components/add-to-cart-modal"
import { NavigationBar } from "@/components/navigation-bar"
import { ProductCard } from "@/components/product-card"
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  Award,
  Leaf,
  Plus,
  Minus,
  MessageCircle,
  ThumbsUp,
  ArrowLeft,
  Zap,
  Clock,
  CheckCircle,
} from "lucide-react"

// Mock product data - in real app, this would come from your database
const getProductBySlug = (slug: string) => {
  const products = {
    "zen-master-og": {
      id: 1,
      name: "Zen Master OG",
      slug: "zen-master-og",
      price: 45.0,
      originalPrice: 55.0,
      category: "Flower",
      categorySlug: "flower",
      description:
        "A perfectly balanced hybrid strain that brings inner peace and tranquility. Zen Master OG combines the best of both worlds with its calming indica effects and uplifting sativa qualities.",
      longDescription:
        "Zen Master OG is our signature strain, carefully cultivated to embody the essence of balance and harmony. This premium hybrid offers a unique terpene profile that delivers both mental clarity and physical relaxation. Perfect for meditation, creative pursuits, or simply unwinding after a long day.",
      image: "/placeholder-flower1.png",
      images: [
        "/placeholder-flower1.png",
        "/placeholder-flower2.png",
        "/placeholder-flower3.png",
        "/placeholder-flower4.png",
      ],
      rating: 4.8,
      reviewCount: 127,
      inStock: true,
      stockQuantity: 15,
      thc: "22-25%",
      cbd: "1-2%",
      effects: ["Relaxed", "Happy", "Creative", "Focused"],
      flavors: ["Earthy", "Pine", "Citrus", "Sweet"],
      variants: [
        { id: 1, name: "1/8 oz (3.5g)", price: 45.0, originalPrice: 55.0, inStock: true },
        { id: 2, name: "1/4 oz (7g)", price: 85.0, originalPrice: 100.0, inStock: true },
        { id: 3, name: "1/2 oz (14g)", price: 160.0, originalPrice: 190.0, inStock: true },
        { id: 4, name: "1 oz (28g)", price: 300.0, originalPrice: 360.0, inStock: false },
      ],
      features: ["Lab tested for purity", "Organic cultivation", "Hand-trimmed", "Nitrogen sealed for freshness"],
      reviews: [
        {
          id: 1,
          user: "PandaLover420",
          rating: 5,
          date: "2024-01-15",
          comment: "Absolutely amazing! The perfect balance of relaxation and creativity. Will definitely order again.",
          helpful: 23,
          verified: true,
        },
        {
          id: 2,
          user: "ZenSeeker",
          rating: 5,
          date: "2024-01-10",
          comment: "This strain lives up to its name. Perfect for meditation and finding inner peace.",
          helpful: 18,
          verified: true,
        },
        {
          id: 3,
          user: "GreenThumb",
          rating: 4,
          date: "2024-01-05",
          comment: "Great quality and fast shipping. The effects are exactly as described.",
          helpful: 12,
          verified: true,
        },
      ],
    },
    "panda-dream": {
      id: 2,
      name: "Panda Dream",
      slug: "panda-dream",
      price: 42.0,
      originalPrice: 50.0,
      category: "Flower",
      categorySlug: "flower",
      description: "A dreamy indica-dominant strain perfect for evening relaxation and peaceful sleep.",
      longDescription:
        "Panda Dream is crafted for those seeking ultimate relaxation. This indica-dominant hybrid delivers a gentle, euphoric high that gradually transitions into deep physical relaxation.",
      image: "/placeholder-flower2.png",
      images: ["/placeholder-flower2.png", "/placeholder-flower1.png", "/placeholder-flower3.png"],
      rating: 4.7,
      reviewCount: 89,
      inStock: true,
      stockQuantity: 12,
      thc: "20-23%",
      cbd: "0.5-1%",
      effects: ["Sleepy", "Relaxed", "Happy", "Euphoric"],
      flavors: ["Berry", "Sweet", "Floral", "Vanilla"],
      variants: [
        { id: 1, name: "1/8 oz (3.5g)", price: 42.0, originalPrice: 50.0, inStock: true },
        { id: 2, name: "1/4 oz (7g)", price: 80.0, originalPrice: 95.0, inStock: true },
      ],
      features: ["Perfect for sleep", "Organic cultivation", "Hand-trimmed", "Premium quality"],
      reviews: [
        {
          id: 1,
          user: "SleepyPanda",
          rating: 5,
          date: "2024-01-12",
          comment: "Best strain for sleep! Helps me unwind after stressful days.",
          helpful: 15,
          verified: true,
        },
      ],
    },
  }

  return products[slug as keyof typeof products] || null
}

// Mock similar products
const getSimilarProducts = (categorySlug: string, currentProductId: number) => {
  return [
    {
      id: 2,
      name: "Panda Dream",
      slug: "panda-dream",
      price: 42.0,
      originalPrice: 50.0,
      image: "/placeholder-flower2.png",
      rating: 4.7,
      reviewCount: 89,
      category: "Flower",
      inStock: true,
    },
    {
      id: 3,
      name: "Bamboo Bliss",
      slug: "bamboo-bliss",
      price: 48.0,
      originalPrice: 58.0,
      image: "/placeholder-flower3.png",
      rating: 4.9,
      reviewCount: 156,
      category: "Flower",
      inStock: true,
    },
    {
      id: 4,
      name: "Tranquil Forest",
      slug: "tranquil-forest",
      price: 40.0,
      originalPrice: 48.0,
      image: "/placeholder-flower4.png",
      rating: 4.6,
      reviewCount: 73,
      category: "Flower",
      inStock: true,
    },
  ].filter((p) => p.id !== currentProductId)
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAddToCart, setShowAddToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (params.slug) {
      setIsLoading(true)
      // Simulate loading delay
      setTimeout(() => {
        const productData = getProductBySlug(params.slug as string)
        if (productData) {
          setProduct(productData)
          setSelectedVariant(productData.variants[0])
          setSimilarProducts(getSimilarProducts(productData.categorySlug, productData.id))
        }
        setIsLoading(false)
      }, 500)
    }
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <NavigationBar />
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
        <NavigationBar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🐼</div>
            <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
            <p className="text-gray-600">The zen product you're looking for doesn't exist.</p>
            <Link href="/pro-store">
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

  const handleAddToCart = async () => {
    setAddingToCart(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setAddingToCart(false)
    setShowAddToCart(true)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stockQuantity) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <NavigationBar />

      {/* Breadcrumb */}
      <div className="pt-20 pb-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-green-700">
            <Link href="/" className="hover:text-green-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/pro-store" className="hover:text-green-900 transition-colors">
              Store
            </Link>
            <span>/</span>
            <Link
              href={`/pro-store?category=${product.categorySlug}`}
              className="hover:text-green-900 transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-green-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  size="sm"
                  variant={isWishlisted ? "default" : "outline"}
                  className={`rounded-full p-2 shadow-lg backdrop-blur-sm transition-all duration-200 ${
                    isWishlisted
                      ? "bg-red-500 hover:bg-red-600 text-white scale-110"
                      : "bg-white/90 hover:bg-white text-gray-700 hover:scale-110"
                  }`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full p-2 shadow-lg bg-white/90 hover:bg-white text-gray-700 backdrop-blur-sm hover:scale-110 transition-all duration-200"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Zen Energy Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? "border-green-500 ring-2 ring-green-200 scale-105"
                      : "border-gray-200 hover:border-green-300 hover:scale-105"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 animate-pulse">
                  {product.category}
                </Badge>
                {product.originalPrice > product.price && (
                  <Badge variant="destructive" className="bg-red-100 text-red-800 animate-bounce">
                    Sale
                  </Badge>
                )}
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <Zap className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>

              <h1 className="text-4xl font-black text-green-900 leading-tight">{product.name}</h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600 ml-1 font-medium">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Award className="h-4 w-4" />
                  <span className="font-medium">Premium Quality</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
            </div>

            {/* Pricing */}
            <div className="space-y-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-green-900">${selectedVariant?.price.toFixed(2)}</span>
                {selectedVariant?.originalPrice > selectedVariant?.price && (
                  <span className="text-2xl text-gray-500 line-through">
                    ${selectedVariant?.originalPrice.toFixed(2)}
                  </span>
                )}
                {selectedVariant?.originalPrice > selectedVariant?.price && (
                  <Badge className="bg-red-500 text-white animate-pulse">
                    {Math.round(
                      ((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100,
                    )}
                    % OFF
                  </Badge>
                )}
              </div>

              {/* Variant Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-green-800 flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  Size:
                </label>
                <Select
                  value={selectedVariant?.id.toString()}
                  onValueChange={(value) => {
                    const variant = product.variants.find((v: any) => v.id.toString() === value)
                    setSelectedVariant(variant)
                  }}
                >
                  <SelectTrigger className="w-full border-green-200 focus:border-green-400 bg-white/90 backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant: any) => (
                      <SelectItem key={variant.id} value={variant.id.toString()} disabled={!variant.inStock}>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{variant.name}</span>
                          <span className="ml-4 font-bold text-green-600">
                            ${variant.price.toFixed(2)}
                            {!variant.inStock && <span className="text-red-500 ml-2">(Out of Stock)</span>}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-green-800 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Quantity:
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-green-50 rounded-full p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="rounded-full p-2 hover:bg-green-100"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-bold w-16 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stockQuantity}
                      className="rounded-full p-2 hover:bg-green-100"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">{product.stockQuantity} available</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.inStock || addingToCart}
                className={`w-full py-4 text-lg font-bold transition-all duration-200 ${
                  addingToCart
                    ? "bg-green-400 scale-95"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105"
                } text-white shadow-lg`}
              >
                {addingToCart ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding to Cart...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </div>
                )}
              </Button>

              {/* Product Features */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Truck className="h-4 w-4" />
                  <span className="font-medium">Free shipping over $75</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Lab tested</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Leaf className="h-4 w-4" />
                  <span className="font-medium">Organic grown</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Award className="h-4 w-4" />
                  <span className="font-medium">Premium quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-12 border-green-200 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-lg font-medium"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="effects"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-lg font-medium"
                >
                  Effects
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-lg font-medium"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-lg font-medium"
                >
                  Shipping
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
                      <Leaf className="h-6 w-6" />
                      Product Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{product.longDescription}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <h4 className="font-bold text-green-800 mb-4 text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Cannabinoid Profile
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">THC:</span>
                          <Badge className="bg-green-600 text-white">{product.thc}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">CBD:</span>
                          <Badge className="bg-blue-600 text-white">{product.cbd}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <h4 className="font-bold text-green-800 mb-4 text-lg flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Features
                      </h4>
                      <ul className="space-y-2">
                        {product.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="effects" className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
                      <Zap className="h-6 w-6" />
                      Effects
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.effects.map((effect: string, index: number) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-medium hover:scale-105 transition-transform duration-200"
                        >
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
                      <Leaf className="h-6 w-6" />
                      Flavor Profile
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.flavors.map((flavor: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-green-300 text-green-700 px-4 py-2 text-sm font-medium hover:bg-green-50 hover:scale-105 transition-all duration-200"
                        >
                          {flavor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-8">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-green-900 flex items-center gap-2">
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      Customer Reviews
                    </h3>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      {renderStars(product.rating)}
                      <span className="font-bold text-lg">{product.rating}</span>
                      <span className="text-gray-600">({product.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {product.reviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="p-6 bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg">{review.user}</span>
                            {review.verified && (
                              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 font-medium">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">{renderStars(review.rating)}</div>
                        <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <button className="flex items-center gap-2 hover:text-green-600 transition-colors font-medium">
                            <ThumbsUp className="h-4 w-4" />
                            <span>Helpful ({review.helpful})</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-green-600 transition-colors font-medium">
                            <MessageCircle className="h-4 w-4" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Write Review */}
                  <div className="border-t border-green-200 pt-8">
                    <h4 className="font-bold text-green-800 mb-6 text-xl">Write a Review</h4>
                    <div className="space-y-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Rating</label>
                        <div className="flex gap-2">
                          {Array.from({ length: 5 }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                              className="p-1 hover:scale-110 transition-transform duration-200"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  i < newReview.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300 hover:text-yellow-400"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Your Review</label>
                        <Textarea
                          placeholder="Share your experience with this product..."
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          className="min-h-[120px] border-green-200 focus:border-green-400 bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-3">
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="p-8">
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
                    <Truck className="h-6 w-6" />
                    Shipping Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-600 rounded-full">
                          <Truck className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-bold text-green-800 text-lg">Free Standard Shipping</h4>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        On orders over $75. Delivery in 3-5 business days.
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-600 rounded-full">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-bold text-green-800 text-lg">Discreet Packaging</h4>
                      </div>
                      <p className="text-gray-600 leading-relaxed">All orders shipped in plain, unmarked packaging.</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-600 rounded-full">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-bold text-green-800 text-lg">Quality Guarantee</h4>
                      </div>
                      <p className="text-gray-600 leading-relaxed">30-day satisfaction guarantee on all products.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Similar Products */}
        <div>
          <h2 className="text-3xl font-black text-green-900 mb-8 flex items-center gap-3">
            <div className="text-2xl">🐼</div>
            Similar Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarProducts.map((similarProduct) => (
              <ProductCard
                key={similarProduct.id}
                product={similarProduct}
                onQuickView={(product) => {
                  // Handle quick view
                  console.log("Quick view:", product)
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add to Cart Modal */}
      {showAddToCart && selectedVariant && (
        <AddToCartModal
          product={{
            id: product.id,
            name: product.name,
            price: selectedVariant.price,
            image: product.image,
            variant: selectedVariant.name,
            quantity: quantity,
          }}
          onClose={() => setShowAddToCart(false)}
        />
      )}
    </div>
  )
}
