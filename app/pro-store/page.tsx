"use client"

import { useState, useEffect } from "react"
import { useRef, type MouseEvent } from "react"
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion"
import {
  ShoppingCart,
  User,
  Leaf,
  ArrowRight,
  Star,
  CheckCircle,
  Search,
  Filter,
  Truck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  MessageCircle,
  ExternalLink,
  Quote,
  ChevronLeft,
  ChevronRight,
  Play,
  Heart,
  Sparkles,
  TreePine,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { AddToCartModal } from "@/components/add-to-cart-modal"
import Link from "next/link"

type FlyingImageState = {
  src: string
  startRect: DOMRect
} | null

// Mock products data
const productsData = [
  {
    id: 1,
    name: "Zen Master OG",
    slug: "zen-master-og",
    price: 45.0,
    originalPrice: 55.0,
    image: "/placeholder-flower1.png",
    rating: 4.8,
    reviewCount: 127,
    category: "flower",
    badge: "Bestseller",
    inStock: true,
  },
  {
    id: 2,
    name: "Panda Dream",
    slug: "panda-dream",
    price: 42.0,
    originalPrice: 50.0,
    image: "/placeholder-flower2.png",
    rating: 4.7,
    reviewCount: 89,
    category: "flower",
    badge: "New",
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
    category: "flower",
    badge: "Premium",
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
    category: "flower",
    inStock: false,
  },
  {
    id: 5,
    name: "Panda Munchies",
    slug: "panda-munchies",
    price: 24.99,
    originalPrice: 29.99,
    image: "/placeholder-gummies.png",
    rating: 4.5,
    reviewCount: 92,
    category: "edibles",
    badge: "Popular",
    inStock: true,
  },
  {
    id: 6,
    name: "Zen Chocolates",
    slug: "zen-chocolates",
    price: 19.99,
    originalPrice: 24.99,
    image: "/placeholder-chocolate.png",
    rating: 4.4,
    reviewCount: 67,
    category: "edibles",
    inStock: true,
  },
  {
    id: 7,
    name: "Peaceful Pipe",
    slug: "peaceful-pipe",
    price: 89.99,
    originalPrice: 109.99,
    image: "/placeholder-bong.png",
    rating: 4.7,
    reviewCount: 34,
    category: "accessories",
    badge: "Premium",
    inStock: true,
  },
  {
    id: 8,
    name: "Bamboo Papers",
    slug: "bamboo-papers",
    price: 12.99,
    image: "/placeholder-papers.png",
    rating: 4.3,
    reviewCount: 128,
    category: "accessories",
    inStock: true,
  },
]

export default function PandaVapeStore() {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)
  const [flyingImage, setFlyingImage] = useState<FlyingImageState>(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("shop")
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const [filteredProducts, setFilteredProducts] = useState(productsData)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)

  const cartIconRef = useRef<HTMLButtonElement>(null)
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  // Floating leaves animation
  const [floatingLeaves, setFloatingLeaves] = useState<
    Array<{ id: number; x: number; y: number; delay: number; size: number }>
  >([])

  useEffect(() => {
    const leaves = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 0.5 + 0.5,
    }))
    setFloatingLeaves(leaves)
  }, [])

  const categories = [
    { id: "all", name: "All Products", icon: "🌿" },
    { id: "vapes", name: "Zen Vapes", icon: "💨" },
    { id: "flowers", name: "Garden Flowers", icon: "🌸" },
    { id: "edibles", name: "Panda Treats", icon: "🍯" },
    { id: "accessories", name: "Bamboo Tools", icon: "🎋" },
  ]

  const products = [
    {
      id: 1,
      name: "Panda's Choice",
      category: "vapes",
      price: 29.99,
      originalPrice: 34.99,
      rating: 4.9,
      reviews: 247,
      image: "/placeholder-defpf.png",
      badge: "Bestseller",
      description: "Our signature blend, loved by pandas everywhere. Smooth, natural, and perfectly balanced.",
      inStock: true,
      isHot: true,
    },
    {
      id: 2,
      name: "Bamboo Bliss",
      category: "flowers",
      price: 39.99,
      rating: 4.8,
      reviews: 189,
      image: "/placeholder-flower1.png",
      badge: "Premium",
      description: "Pure zen in every puff. Grown in our secret bamboo forest.",
      inStock: true,
      isNew: true,
    },
    {
      id: 3,
      name: "Zen Garden",
      category: "vapes",
      price: 24.99,
      rating: 4.7,
      reviews: 156,
      image: "/placeholder-ff1cq.png",
      badge: "Peaceful",
      description: "Find your inner peace with this calming blend.",
      inStock: true,
    },
    {
      id: 4,
      name: "Panda Munchies",
      category: "edibles",
      price: 22.99,
      rating: 4.9,
      reviews: 203,
      image: "/placeholder-gummies.png",
      badge: "Fan Favorite",
      description: "Sweet treats that make every panda happy. Made with love and natural ingredients.",
      inStock: true,
      isHot: true,
    },
    {
      id: 5,
      name: "Emerald Dreams",
      category: "flowers",
      price: 44.99,
      rating: 4.8,
      reviews: 134,
      image: "/placeholder-flower2.png",
      badge: "Luxury",
      description: "Premium grade for the most discerning pandas. A true gem of nature.",
      inStock: false,
    },
    {
      id: 6,
      name: "Honey Bamboo",
      category: "edibles",
      price: 19.99,
      rating: 4.6,
      reviews: 98,
      image: "/placeholder-cookies.png",
      badge: "Sweet",
      description: "Natural sweetness meets zen relaxation. A panda's perfect snack.",
      inStock: true,
    },
    {
      id: 7,
      name: "Zen Master",
      category: "accessories",
      price: 79.99,
      rating: 4.9,
      reviews: 67,
      image: "/placeholder-bong.png",
      badge: "Artisan",
      description: "Handcrafted bamboo piece for the ultimate zen experience.",
      inStock: true,
      isNew: true,
    },
    {
      id: 8,
      name: "Panda Papers",
      category: "accessories",
      price: 12.99,
      rating: 4.5,
      reviews: 234,
      image: "/placeholder-papers.png",
      badge: "Essential",
      description: "Eco-friendly rolling papers made from sustainable bamboo.",
      inStock: true,
    },
  ]

  const strains = [
    {
      id: 1,
      name: "Bamboo Bliss",
      type: "Sativa",
      thc: "22%",
      cbd: "0.5%",
      price: 39.99,
      image: "/placeholder-flower1.png",
      effects: ["Euphoric", "Creative", "Energetic"],
      description: "Like a gentle breeze through a bamboo forest, this strain brings clarity and joy.",
      rating: 4.8,
      reviews: 156,
    },
    {
      id: 2,
      name: "Panda's Dream",
      type: "Hybrid",
      thc: "24%",
      cbd: "0.3%",
      price: 42.99,
      image: "/placeholder-flower2.png",
      effects: ["Relaxed", "Happy", "Sleepy"],
      description: "The perfect balance of relaxation and happiness, just like a content panda.",
      rating: 4.9,
      reviews: 203,
    },
    {
      id: 3,
      name: "Zen Garden",
      type: "Hybrid",
      thc: "18%",
      cbd: "2%",
      price: 36.99,
      image: "/placeholder-flower3.png",
      effects: ["Calm", "Creative", "Focused"],
      description: "Find your center with this perfectly balanced strain that promotes mindfulness.",
      rating: 4.7,
      reviews: 189,
    },
    {
      id: 4,
      name: "Sleepy Panda",
      type: "Indica",
      thc: "20%",
      cbd: "0.1%",
      price: 38.99,
      image: "/placeholder-flower4.png",
      effects: ["Sleepy", "Relaxed", "Hungry"],
      description: "When it's time to hibernate like a panda, this strain is your perfect companion.",
      rating: 4.6,
      reviews: 134,
    },
  ]

  const reviewsData = [
    {
      id: 1,
      name: "Sarah M.",
      rating: 5,
      date: "2 days ago",
      text: "Absolutely love Green Panda! The Panda's Choice is amazing - smooth, natural, and the packaging is so cute! 🐼",
      product: "Panda's Choice",
      verified: true,
    },
    {
      id: 2,
      name: "Mike R.",
      rating: 5,
      date: "1 week ago",
      text: "Best online dispensary I've found. The zen vibes are real, and the quality is top-notch. My new go-to!",
      product: "Bamboo Bliss",
      verified: true,
    },
    {
      id: 3,
      name: "Jessica L.",
      rating: 4,
      date: "2 weeks ago",
      text: "The Panda Munchies are incredible! Perfect dosing and they taste amazing. Love the natural approach.",
      product: "Panda Munchies",
      verified: true,
    },
    {
      id: 4,
      name: "David K.",
      rating: 5,
      date: "3 weeks ago",
      text: "Green Panda really cares about quality and sustainability. The bamboo packaging is a nice touch!",
      product: "Zen Master",
      verified: true,
    },
    {
      id: 5,
      name: "Emma T.",
      rating: 5,
      date: "1 month ago",
      text: "Found my zen with Green Panda. The customer service is as sweet as their products. Highly recommend!",
      product: "Zen Garden",
      verified: true,
    },
  ]

  const filteredProductsOld =
    activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory)

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>, product: any) => {
    const card = e.currentTarget.closest(".product-card")
    if (!card) return

    const img = card.querySelector(".product-image") as HTMLImageElement
    if (!img) return

    const rect = img.getBoundingClientRect()
    setSelectedProduct(product)
    setFlyingImage({ src: img.src, startRect: rect })
  }

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviewsData.length)
  }

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length)
  }

  const endRect = cartIconRef.current?.getBoundingClientRect()

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  useEffect(() => {
    let filtered = productsData

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered = [...filtered].sort((a, b) => b.id - a.id)
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, searchQuery, sortBy])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="pt-20 container mx-auto px-4">
          <div className="text-center py-20">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-200 border-t-green-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-green-600 animate-pulse" />
              </div>
            </div>
            <p className="text-green-800 text-xl font-medium">Loading zen products...</p>
            <div className="flex items-center justify-center gap-1 mt-4">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-900 relative overflow-hidden">
      {/* Floating Cannabis Leaves */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {floatingLeaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            className="absolute opacity-20"
            style={{
              left: `${leaf.x}%`,
              top: `${leaf.y}%`,
              transform: `scale(${leaf.size})`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + leaf.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: leaf.delay,
            }}
          >
            <Leaf className="h-6 w-6 text-green-600" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {flyingImage && endRect && !shouldReduceMotion && (
          <motion.div
            className="fixed z-[999] rounded-lg shadow-2xl"
            initial={{
              top: flyingImage.startRect.top,
              left: flyingImage.startRect.left,
              width: flyingImage.startRect.width,
              height: flyingImage.startRect.height,
            }}
            animate={{
              top: endRect.top + window.scrollY,
              left: endRect.left + window.scrollX,
              width: 20,
              height: 20,
              opacity: 0,
              scale: 0.5,
            }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            onAnimationComplete={() => {
              setFlyingImage(null)
              setIsCartModalOpen(true)
            }}
          >
            <Image src={flyingImage.src || "/placeholder.svg"} alt="flying product" layout="fill" objectFit="contain" />
          </motion.div>
        )}
      </AnimatePresence>

      <AddToCartModal isOpen={isCartModalOpen} onOpenChange={setIsCartModalOpen} product={selectedProduct} />

      {/* Header */}
      <motion.header
        className="bg-white/90 backdrop-blur-xl sticky top-0 z-40 border-b border-green-200 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center shadow-lg">
                    <div className="text-white text-xl">🐼</div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Leaf className="h-2 w-2 text-white" />
                  </div>
                </div>
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  GREEN PANDA
                </span>
              </Link>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block">
              <TabsList className="bg-green-100/80 backdrop-blur-sm border border-green-200">
                <TabsTrigger
                  value="shop"
                  className="font-medium data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  Shop
                </TabsTrigger>
                <TabsTrigger
                  value="strains"
                  className="font-medium data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  Garden
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="font-medium data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  Our Story
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="font-medium data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  Contact
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center space-x-2">
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-full"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/cart">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    ref={cartIconRef}
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-full relative"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <motion.span
                      className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      3
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <main>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Shop Tab */}
          <TabsContent value="shop" className="mt-0">
            {/* Hero Section */}
            <section
              ref={heroRef}
              className="relative overflow-hidden bg-gradient-to-br from-green-100 via-white to-green-50 border-b border-green-200"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <Badge className="bg-green-100 text-green-800 border-green-200 mb-4">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Premium Cannabis, Panda Approved
                      </Badge>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 leading-tight">
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="block"
                      >
                        Welcome to
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="block bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent"
                      >
                        Panda Paradise
                      </motion.span>
                    </h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="text-xl text-gray-600 max-w-lg leading-relaxed"
                    >
                      Discover our zen garden of premium cannabis products. Carefully curated with love, naturally
                      grown, and panda-tested for the ultimate chill experience.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
                    >
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                          <TreePine className="mr-2 h-5 w-5" />
                          Explore Garden
                          <motion.div
                            className="ml-2"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <ArrowRight className="h-5 w-5" />
                          </motion.div>
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="lg"
                          variant="outline"
                          className="rounded-full px-8 py-6 bg-white/80 backdrop-blur-sm border-green-300 hover:bg-green-50 hover:shadow-lg transition-all duration-300"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Watch Story
                        </Button>
                      </motion.div>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      className="flex items-center space-x-6 pt-4"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">4.9/5 from happy pandas</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Leaf className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-700">100% Natural</span>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={isHeroInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="relative"
                  >
                    <div className="relative h-96 lg:h-[500px]">
                      <motion.div
                        animate={{
                          y: [0, -20, 0],
                          rotate: [0, 2, 0],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0"
                      >
                        <Card className="h-full bg-gradient-to-br from-green-100 to-green-200 rounded-3xl overflow-hidden shadow-2xl border-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-600/10"></div>

                          {/* Panda Illustration */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                              <div className="text-9xl">🐼</div>
                              <div className="text-5xl">🌿</div>
                              <p className="text-green-700 font-bold text-xl">Zen Panda Vibes</p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>

                      {/* Floating elements */}
                      <motion.div
                        animate={{
                          y: [0, -15, 0],
                          x: [0, 10, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                        className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-green-200"
                      >
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm font-semibold">Lab Tested</span>
                        </div>
                      </motion.div>

                      <motion.div
                        animate={{
                          y: [0, 15, 0],
                          x: [0, -10, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                          delay: 2,
                        }}
                        className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-green-200"
                      >
                        <div className="flex items-center space-x-2">
                          <Heart className="h-5 w-5 text-pink-500" />
                          <span className="text-sm font-semibold">Made with Love</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Trust Badges */}
            <motion.section
              className="py-16 bg-white border-b border-green-100"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      icon: "🌱",
                      title: "Natural & Pure",
                      desc: "Like bamboo in the wild, our products are grown naturally without harmful chemicals.",
                      color: "text-green-600",
                      bgColor: "bg-green-100",
                    },
                    {
                      icon: "☯️",
                      title: "Zen Balance",
                      desc: "Finding the perfect harmony between relaxation and clarity, just like a peaceful panda.",
                      color: "text-blue-600",
                      bgColor: "bg-blue-100",
                    },
                    {
                      icon: "💚",
                      title: "Made with Love",
                      desc: "Every product is crafted with care and attention, spreading good vibes to all our panda friends.",
                      color: "text-pink-600",
                      bgColor: "bg-pink-100",
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      variants={fadeInUp}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      <motion.div
                        className={`${feature.bgColor} p-6 rounded-2xl mb-6 group-hover:shadow-lg transition-all duration-300`}
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="text-4xl">{feature.icon}</div>
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-green-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.section>

            {/* Products Section */}
            <section className="py-24 bg-gradient-to-br from-green-50 to-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900 mb-4">
                    Panda's Garden Collection
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Discover our carefully curated selection of premium cannabis products, each one panda-approved for
                    quality and zen.
                  </p>
                </motion.div>

                <motion.div
                  className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Category Filters */}
                  <div className="flex flex-wrap justify-center bg-white/80 backdrop-blur-sm p-2 rounded-2xl border border-green-200 shadow-lg">
                    {categories.map((category) => (
                      <motion.button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          activeCategory === category.id
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                            : "text-gray-600 hover:bg-green-100 hover:text-gray-900"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </motion.button>
                    ))}
                  </div>

                  {/* Search and Filter */}
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-2 border border-green-300 rounded-xl text-sm bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                    <Button variant="outline" className="rounded-xl bg-white/80 backdrop-blur-sm border-green-300">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                  >
                    {filteredProductsOld.map((product, i) => (
                      <motion.div
                        key={product.id}
                        className="product-card group"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                      >
                        <Link href={`/product/${product.name.toLowerCase().replace(/\s+/g, "-")}`}>
                          <Card className="rounded-2xl overflow-hidden h-full flex flex-col border-green-200 hover:shadow-2xl hover:border-green-400 transition-all duration-500 bg-white/80 backdrop-blur-sm cursor-pointer">
                            <div className="relative bg-gradient-to-br from-green-50 to-green-100 p-6">
                              {product.badge && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: i * 0.1 + 0.3 }}
                                >
                                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
                                    {product.badge}
                                  </Badge>
                                </motion.div>
                              )}
                              <div className="absolute top-4 right-4 text-xl">🐼</div>
                              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  width={300}
                                  height={300}
                                  className="w-full h-48 object-contain product-image drop-shadow-lg"
                                />
                              </motion.div>
                            </div>
                            <CardContent className="p-6 flex-grow flex flex-col justify-between">
                              <div>
                                <p className="text-sm text-green-600 font-semibold capitalize mb-1">
                                  {product.category}
                                </p>
                                <h3 className="text-lg font-bold mb-2 group-hover:text-green-600 transition-colors">
                                  {product.name}
                                </h3>
                                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{product.description}</p>
                                <div className="flex items-center space-x-2 mb-3">
                                  <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-3 w-3 ${star <= Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500">({product.reviews})</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-extrabold text-green-600">${product.price}</span>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    size="icon"
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                                    onClick={(e) => handleAddToCart(e, product)}
                                  >
                                    <ShoppingCart className="h-5 w-5" />
                                  </Button>
                                </motion.div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>

            {/* Reviews Section */}
            <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900 mb-4">
                    Happy Panda Reviews
                  </h2>
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xl font-semibold text-gray-700">4.9 out of 5</span>
                  </div>
                  <p className="text-lg text-gray-600">Based on 2,340+ verified panda reviews</p>
                </motion.div>

                <div className="relative">
                  <motion.div
                    className="overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
                    >
                      {reviewsData.map((review, index) => (
                        <div key={review.id} className="w-full flex-shrink-0 px-4">
                          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-white border-green-200 shadow-lg">
                            <CardContent className="p-8 text-center">
                              <div className="text-4xl mb-4">🐼</div>
                              <Quote className="h-12 w-12 text-green-500 mx-auto mb-6 opacity-50" />
                              <p className="text-lg text-gray-700 mb-6 leading-relaxed italic">"{review.text}"</p>
                              <div className="flex items-center justify-center space-x-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-5 w-5 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <div className="flex items-center justify-center space-x-4">
                                <div>
                                  <p className="font-semibold text-gray-900">{review.name}</p>
                                  <p className="text-sm text-gray-500">Verified Panda • {review.date}</p>
                                </div>
                                {review.verified && (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>

                  <div className="flex justify-center items-center space-x-4 mt-8">
                    <motion.button
                      onClick={prevReview}
                      className="p-3 rounded-full bg-white border border-green-300 hover:bg-green-50 transition-colors shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </motion.button>

                    <div className="flex space-x-2">
                      {reviewsData.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentReviewIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentReviewIndex ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <motion.button
                      onClick={nextReview}
                      className="p-3 rounded-full bg-white border border-green-300 hover:bg-green-50 transition-colors shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Garden Tab (Strains) */}
          <TabsContent value="strains" className="mt-0">
            <section className="py-24 bg-gradient-to-br from-green-50 to-white min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-6">
                    The Zen Garden
                  </h1>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Explore our premium cannabis strains, each one carefully cultivated in our peaceful bamboo gardens
                    and approved by our panda experts.
                  </p>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {strains.map((strain, i) => (
                    <motion.div
                      key={strain.id}
                      variants={fadeInUp}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group"
                    >
                      <Card className="overflow-hidden border-green-200 hover:shadow-2xl hover:border-green-400 transition-all duration-500 bg-white/80 backdrop-blur-sm">
                        <div className="grid md:grid-cols-2 gap-0">
                          <div className="relative bg-gradient-to-br from-green-50 to-green-100 p-8 flex items-center justify-center">
                            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
                              <Image
                                src={strain.image || "/placeholder.svg"}
                                alt={strain.name}
                                width={200}
                                height={200}
                                className="object-contain drop-shadow-lg"
                              />
                            </motion.div>
                            <div className="absolute top-4 right-4 text-2xl">🐼</div>
                          </div>

                          <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-4">
                              <Badge
                                className={`${
                                  strain.type === "Sativa"
                                    ? "bg-orange-100 text-orange-800"
                                    : strain.type === "Indica"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {strain.type}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${star <= Math.floor(strain.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                  />
                                ))}
                                <span className="text-sm text-gray-500 ml-1">({strain.reviews})</span>
                              </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                              {strain.name}
                            </h3>

                            <p className="text-gray-600 mb-4 leading-relaxed">{strain.description}</p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-green-50 rounded-lg p-3 text-center">
                                <p className="text-sm text-gray-500">THC</p>
                                <p className="text-lg font-bold text-green-600">{strain.thc}</p>
                              </div>
                              <div className="bg-green-50 rounded-lg p-3 text-center">
                                <p className="text-sm text-gray-500">CBD</p>
                                <p className="text-lg font-bold text-blue-600">{strain.cbd}</p>
                              </div>
                            </div>

                            <div className="mb-6">
                              <p className="text-sm font-semibold text-gray-700 mb-2">Effects:</p>
                              <div className="flex flex-wrap gap-2">
                                {strain.effects.map((effect) => (
                                  <Badge key={effect} variant="outline" className="bg-white">
                                    {effect}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-3xl font-extrabold text-green-600">${strain.price}</span>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-6">
                                  Add to Garden
                                </Button>
                              </motion.div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-0">
            <section className="py-24 bg-gradient-to-br from-green-50 to-white min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-6">
                    Our Panda Story
                  </h1>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    From bamboo forests to zen gardens, discover how Green Panda became the most trusted name in premium
                    cannabis.
                  </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">The Panda Philosophy</h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Just like pandas find peace in bamboo forests, we believe cannabis should bring tranquility and
                      joy to your life. Our journey began with a simple mission: to create the purest, most natural
                      cannabis products while maintaining the zen balance that pandas represent.
                    </p>
                    <div className="space-y-4">
                      {[
                        { icon: "🌱", text: "Naturally grown in peaceful environments" },
                        { icon: "🐼", text: "Panda-tested for ultimate relaxation" },
                        { icon: "☯️", text: "Perfect balance of quality and zen" },
                        { icon: "💚", text: "Made with love and positive energy" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                          <div className="text-2xl">{item.icon}</div>
                          <span className="font-semibold text-gray-700">{item.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                  >
                    <div className="relative h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-green-100 to-green-200">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="text-8xl">🐼</div>
                          <div className="text-4xl">🌿</div>
                          <p className="text-green-700 font-bold text-xl">Zen Panda Paradise</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                  className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {[
                    { number: "50K+", label: "Happy Pandas" },
                    { number: "500+", label: "Premium Products" },
                    { number: "99.9%", label: "Zen Satisfaction" },
                    { number: "24/7", label: "Panda Support" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center p-6 bg-white rounded-2xl shadow-lg border border-green-200"
                      whileHover={{ y: -5, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-4xl font-extrabold text-green-600 mb-2">{stat.number}</div>
                      <div className="text-gray-600 font-semibold">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Values */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">The Panda Way</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        title: "Natural & Pure",
                        description:
                          "Like bamboo in the wild, our products are grown naturally without harmful chemicals.",
                        icon: "🌱",
                      },
                      {
                        title: "Zen Balance",
                        description:
                          "Finding the perfect harmony between relaxation and clarity, just like a peaceful panda.",
                        icon: "☯️",
                      },
                      {
                        title: "Made with Love",
                        description:
                          "Every product is crafted with care and attention, spreading good vibes to all our panda friends.",
                        icon: "💚",
                      },
                    ].map((value, i) => (
                      <motion.div
                        key={i}
                        className="text-center p-8 bg-white rounded-2xl shadow-lg border border-green-200"
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-6xl mb-6">{value.icon}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{value.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="mt-0">
            <section className="py-24 bg-gradient-to-br from-green-50 to-white min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-6">
                    Connect with Pandas
                  </h1>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Have questions? Want to join our zen garden? We'd love to hear from you! Our panda team is here to
                    help.
                  </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16">
                  {/* Contact Form */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Card className="p-8 bg-white shadow-xl border-green-200">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                      <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <Input placeholder="Panda" className="rounded-xl" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <Input placeholder="Bear" className="rounded-xl" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <Input type="email" placeholder="panda@bamboo.com" className="rounded-xl" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                          <Input placeholder="Looking for zen products" className="rounded-xl" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                          <Textarea
                            placeholder="Tell us how we can help you find your zen..."
                            className="rounded-xl min-h-32"
                          />
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl py-3">
                            Send Message
                          </Button>
                        </motion.div>
                      </form>
                    </Card>
                  </motion.div>

                  {/* Contact Info */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                      <div className="space-y-6">
                        {[
                          {
                            icon: Phone,
                            title: "Phone",
                            info: "+1 (555) PANDA-ZEN",
                            subtitle: "Mon-Fri 9am-6pm PST",
                          },
                          {
                            icon: Mail,
                            title: "Email",
                            info: "hello@greenpanda.com",
                            subtitle: "We'll respond within 24 hours",
                          },
                          {
                            icon: MapPin,
                            title: "Address",
                            info: "123 Bamboo Grove, Suite 100",
                            subtitle: "San Francisco, CA 94102",
                          },
                          {
                            icon: Clock,
                            title: "Business Hours",
                            info: "Monday - Friday: 9am - 6pm",
                            subtitle: "Saturday - Sunday: 10am - 4pm",
                          },
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg border border-green-200"
                            whileHover={{ y: -2, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="p-3 bg-green-100 rounded-xl">
                              <item.icon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                              <p className="text-gray-700 font-medium">{item.info}</p>
                              <p className="text-sm text-gray-500">{item.subtitle}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8 border border-green-300">
                      <div className="text-4xl mb-4 text-center">🐼</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Need immediate help?</h3>
                      <p className="text-gray-600 mb-6 text-center">
                        Our panda support team is available to assist you with any questions about our zen products.
                      </p>
                      <div className="flex justify-center space-x-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Live Chat
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" className="rounded-xl bg-white border-green-300">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            FAQ
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <motion.footer
          className="bg-white border-t border-green-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center shadow-lg">
                      <div className="text-white text-xl">🐼</div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Leaf className="h-2 w-2 text-white" />
                    </div>
                  </div>
                  <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                    GREEN PANDA
                  </span>
                </motion.div>
                <p className="text-gray-600 leading-relaxed">
                  Premium cannabis products with zen vibes. Naturally grown, panda-approved, and made with love for the
                  ultimate chill experience.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">4.9/5 Panda Rating</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-6">Shop</h4>
                <ul className="space-y-3 text-gray-600">
                  {["Zen Vapes", "Garden Flowers", "Panda Treats", "Bamboo Tools", "New Arrivals", "Best Sellers"].map(
                    (item) => (
                      <motion.li key={item} whileHover={{ x: 5 }}>
                        <a href="#" className="hover:text-green-600 transition-colors">
                          {item}
                        </a>
                      </motion.li>
                    ),
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-6">Company</h4>
                <ul className="space-y-3 text-gray-600">
                  {["Our Story", "Contact", "FAQs", "Shipping", "Returns", "Privacy Policy"].map((item) => (
                    <motion.li key={item} whileHover={{ x: 5 }}>
                      <a href="#" className="hover:text-green-600 transition-colors">
                        {item}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-6">Join the Garden</h4>
                <p className="text-gray-600 mb-4">
                  Get the latest zen products and panda wisdom delivered to your inbox.
                </p>
                <div className="flex mb-4">
                  <Input
                    type="email"
                    placeholder="Your email"
                    className="rounded-l-xl border-r-0 focus:border-green-500"
                  />
                  <motion.button
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 rounded-r-xl hover:from-green-600 hover:to-green-700 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Lab Tested</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-green-500" />
                    <span>Free Shipping</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="mt-12 pt-8 border-t border-green-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center md:text-left">
                <p className="text-gray-600 text-sm">
                  &copy; 2024 Green Panda. All rights reserved. For adults 21+ only. Enjoy responsibly.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Licensed cannabis retailer. All products lab-tested for quality and panda approval.
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="text-lg">🐼</div>
                  <span>Panda Reviews</span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold">4.9</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Heart className="h-4 w-4 text-pink-500" />
                  <span>Made with Love</span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold">100%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.footer>
      </main>
    </div>
  )
}
