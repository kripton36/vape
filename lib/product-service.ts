import type { Product } from "./store-context"

// Mock product data with zen panda theme
const mockProducts: Product[] = [
  {
    id: "zen-master-og",
    name: "Zen Master OG",
    price: 45,
    originalPrice: 55,
    image: "/placeholder-defpf.png",
    category: "flower",
    description: "A calming indica strain perfect for meditation and relaxation",
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    thc: "22%",
    cbd: "1%",
    effects: ["Relaxed", "Happy", "Sleepy"],
    flavors: ["Earthy", "Pine", "Sweet"],
    labTested: true,
    featured: true,
  },
  {
    id: "panda-express",
    name: "Panda Express",
    price: 38,
    image: "/placeholder-ff1cq.png",
    category: "flower",
    description: "Energizing sativa for creative bamboo sessions",
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    thc: "19%",
    cbd: "0.5%",
    effects: ["Energetic", "Creative", "Uplifted"],
    flavors: ["Citrus", "Tropical", "Sweet"],
    labTested: true,
    featured: true,
  },
  {
    id: "bamboo-bliss",
    name: "Bamboo Bliss Gummies",
    price: 25,
    image: "/placeholder-gummies.png",
    category: "edibles",
    description: "Delicious gummies infused with zen energy",
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    thc: "10mg per piece",
    cbd: "5mg per piece",
    effects: ["Relaxed", "Happy", "Euphoric"],
    flavors: ["Berry", "Tropical"],
    labTested: true,
    featured: false,
  },
  {
    id: "meditation-mints",
    name: "Meditation Mints",
    price: 18,
    image: "/placeholder-2p6ik.png",
    category: "edibles",
    description: "Refreshing mints for mindful moments",
    rating: 4.5,
    reviewCount: 67,
    inStock: true,
    thc: "5mg per mint",
    cbd: "5mg per mint",
    effects: ["Focused", "Relaxed"],
    flavors: ["Herbal", "Sweet"],
    labTested: true,
    featured: false,
  },
  {
    id: "zen-chocolate",
    name: "Zen Chocolate Bar",
    price: 32,
    originalPrice: 40,
    image: "/placeholder-chocolate.png",
    category: "edibles",
    description: "Premium dark chocolate infused with tranquility",
    rating: 4.9,
    reviewCount: 203,
    inStock: false,
    thc: "100mg total",
    cbd: "50mg total",
    effects: ["Relaxed", "Happy", "Euphoric"],
    flavors: ["Sweet", "Vanilla"],
    labTested: true,
    featured: true,
  },
  {
    id: "panda-cookies",
    name: "Panda Cookies",
    price: 28,
    image: "/placeholder-cookies.png",
    category: "edibles",
    description: "Homemade cookies with a zen twist",
    rating: 4.4,
    reviewCount: 91,
    inStock: true,
    thc: "15mg per cookie",
    cbd: "2mg per cookie",
    effects: ["Happy", "Relaxed", "Hungry"],
    flavors: ["Sweet", "Vanilla"],
    labTested: true,
    featured: false,
  },
  {
    id: "enlightened-brownies",
    name: "Enlightened Brownies",
    price: 35,
    image: "/placeholder-brownies.png",
    category: "edibles",
    description: "Fudgy brownies for spiritual awakening",
    rating: 4.6,
    reviewCount: 78,
    inStock: true,
    thc: "20mg per brownie",
    cbd: "5mg per brownie",
    effects: ["Euphoric", "Relaxed", "Creative"],
    flavors: ["Sweet"],
    labTested: true,
    featured: false,
  },
  {
    id: "inner-peace-indica",
    name: "Inner Peace Indica",
    price: 42,
    image: "/placeholder-flower1.png",
    category: "flower",
    description: "Deep relaxation strain for evening meditation",
    rating: 4.7,
    reviewCount: 112,
    inStock: true,
    thc: "24%",
    cbd: "1.5%",
    effects: ["Relaxed", "Sleepy", "Happy"],
    flavors: ["Earthy", "Woody", "Pine"],
    labTested: true,
    featured: false,
  },
  {
    id: "harmony-hybrid",
    name: "Harmony Hybrid",
    price: 40,
    image: "/placeholder-flower2.png",
    category: "flower",
    description: "Balanced hybrid for perfect zen harmony",
    rating: 4.5,
    reviewCount: 95,
    inStock: true,
    thc: "20%",
    cbd: "3%",
    effects: ["Balanced", "Happy", "Relaxed"],
    flavors: ["Floral", "Sweet", "Herbal"],
    labTested: true,
    featured: false,
  },
  {
    id: "mindful-sativa",
    name: "Mindful Sativa",
    price: 39,
    image: "/placeholder-flower3.png",
    category: "flower",
    description: "Uplifting sativa for mindful activities",
    rating: 4.6,
    reviewCount: 87,
    inStock: true,
    thc: "18%",
    cbd: "0.8%",
    effects: ["Energetic", "Creative", "Focused"],
    flavors: ["Citrus", "Pine", "Spicy"],
    labTested: true,
    featured: false,
  },
  {
    id: "tranquil-kush",
    name: "Tranquil Kush",
    price: 44,
    originalPrice: 50,
    image: "/placeholder-flower4.png",
    category: "flower",
    description: "Premium kush for ultimate tranquility",
    rating: 4.8,
    reviewCount: 134,
    inStock: true,
    thc: "26%",
    cbd: "2%",
    effects: ["Relaxed", "Euphoric", "Sleepy"],
    flavors: ["Earthy", "Woody", "Sweet"],
    labTested: true,
    featured: true,
  },
  {
    id: "zen-bong",
    name: "Zen Garden Bong",
    price: 89,
    image: "/placeholder-bong.png",
    category: "accessories",
    description: "Beautiful glass bong for peaceful sessions",
    rating: 4.7,
    reviewCount: 45,
    inStock: true,
    effects: [],
    flavors: [],
    labTested: false,
    featured: false,
  },
  {
    id: "bamboo-papers",
    name: "Bamboo Rolling Papers",
    price: 12,
    image: "/placeholder-papers.png",
    category: "accessories",
    description: "Eco-friendly papers made from bamboo",
    rating: 4.3,
    reviewCount: 67,
    inStock: true,
    effects: [],
    flavors: [],
    labTested: false,
    featured: false,
  },
  {
    id: "panda-grinder",
    name: "Panda Herb Grinder",
    price: 35,
    image: "/placeholder-grinder.png",
    category: "accessories",
    description: "Premium grinder with panda design",
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    effects: [],
    flavors: [],
    labTested: false,
    featured: false,
  },
  {
    id: "meditation-rig",
    name: "Meditation Dab Rig",
    price: 125,
    originalPrice: 150,
    image: "/placeholder-rig.png",
    category: "accessories",
    description: "Elegant dab rig for concentrated meditation",
    rating: 4.8,
    reviewCount: 34,
    inStock: false,
    effects: [],
    flavors: [],
    labTested: false,
    featured: true,
  },
]

const categories = [
  { id: "all", name: "All Products", count: mockProducts.length },
  { id: "flower", name: "Flower", count: mockProducts.filter((p) => p.category === "flower").length },
  { id: "edibles", name: "Edibles", count: mockProducts.filter((p) => p.category === "edibles").length },
  { id: "accessories", name: "Accessories", count: mockProducts.filter((p) => p.category === "accessories").length },
]

interface ProductFilters {
  category?: string
  search?: string
  sort?: string
  limit?: number
  offset?: number
  priceRange?: [number, number]
  effects?: string[]
  flavors?: string[]
  inStockOnly?: boolean
  onSaleOnly?: boolean
}

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<{ products: Product[]; total: number }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filteredProducts = [...mockProducts]

    // Apply filters
    if (filters.category && filters.category !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.category === filters.category)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.effects.some((effect) => effect.toLowerCase().includes(searchTerm)) ||
          p.flavors.some((flavor) => flavor.toLowerCase().includes(searchTerm)),
      )
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      filteredProducts = filteredProducts.filter((p) => p.price >= min && p.price <= max)
    }

    if (filters.effects && filters.effects.length > 0) {
      filteredProducts = filteredProducts.filter((p) => filters.effects!.some((effect) => p.effects.includes(effect)))
    }

    if (filters.flavors && filters.flavors.length > 0) {
      filteredProducts = filteredProducts.filter((p) => filters.flavors!.some((flavor) => p.flavors.includes(flavor)))
    }

    if (filters.inStockOnly) {
      filteredProducts = filteredProducts.filter((p) => p.inStock)
    }

    if (filters.onSaleOnly) {
      filteredProducts = filteredProducts.filter((p) => p.originalPrice && p.originalPrice > p.price)
    }

    // Apply sorting
    switch (filters.sort) {
      case "price-low-high":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        // In a real app, you'd sort by creation date
        filteredProducts.reverse()
        break
      case "featured":
      default:
        filteredProducts.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.rating - a.rating
        })
        break
    }

    const total = filteredProducts.length

    // Apply pagination
    if (filters.limit !== undefined) {
      const start = filters.offset || 0
      filteredProducts = filteredProducts.slice(start, start + filters.limit)
    }

    return { products: filteredProducts, total }
  },

  async getCategories() {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return categories
  },

  async getProduct(slug: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockProducts.find((p) => p.id === slug) || null
  },

  async getRelatedProducts(productId: string, category: string): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockProducts.filter((p) => p.id !== productId && p.category === category).slice(0, 4)
  },

  async getFeaturedProducts(): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockProducts.filter((p) => p.featured).slice(0, 8)
  },
}
