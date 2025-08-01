"use client"
import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { NavigationBar } from "@/components/navigation-bar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useStore, type Product } from "@/lib/store-context"
import { Filter, ChevronDown } from "lucide-react"

const allProducts: Product[] = [
  {
    id: "1",
    name: "Zen Master OG",
    price: 45.99,
    originalPrice: 55.99,
    image: "/placeholder-defpf.png",
    category: "flower",
    description: "Premium indica strain for deep relaxation and zen meditation",
    thc: "24%",
    cbd: "2%",
    effects: ["Relaxed", "Happy", "Sleepy"],
    flavors: ["Earthy", "Pine", "Sweet"],
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviewCount: 124,
    isNew: false,
    isFeatured: true,
    slug: "zen-master-og",
  },
  {
    id: "2",
    name: "Panda's Dream",
    price: 38.99,
    originalPrice: 42.99,
    image: "/placeholder-gummies.png",
    category: "edibles",
    description: "Delicious gummies infused with peaceful vibes",
    thc: "10mg",
    cbd: "5mg",
    effects: ["Euphoric", "Creative", "Focused"],
    flavors: ["Berry", "Tropical", "Citrus"],
    inStock: true,
    stockCount: 28,
    rating: 4.9,
    reviewCount: 89,
    isNew: true,
    isFeatured: true,
    slug: "pandas-dream",
  },
  {
    id: "3",
    name: "Bamboo Bliss",
    price: 52.99,
    image: "/placeholder-flower1.png",
    category: "concentrates",
    description: "Pure concentrate for the ultimate zen experience",
    thc: "85%",
    cbd: "1%",
    effects: ["Uplifted", "Energetic", "Creative"],
    flavors: ["Citrus", "Diesel", "Herbal"],
    inStock: true,
    stockCount: 8,
    rating: 4.7,
    reviewCount: 67,
    isNew: false,
    isFeatured: true,
    slug: "bamboo-bliss",
  },
  {
    id: "4",
    name: "Peaceful Panda Pre-Roll",
    price: 15.99,
    originalPrice: 18.99,
    image: "/placeholder-papers.png",
    category: "pre-rolls",
    description: "Ready-to-enjoy pre-rolls for instant zen",
    thc: "20%",
    cbd: "3%",
    effects: ["Relaxed", "Happy", "Calm"],
    flavors: ["Floral", "Sweet", "Earthy"],
    inStock: true,
    stockCount: 42,
    rating: 4.6,
    reviewCount: 156,
    isNew: false,
    isFeatured: true,
    slug: "peaceful-panda-preroll",
  },
  // Add more products
  {
    id: "5",
    name: "Green Guardian CBD Oil",
    price: 65.0,
    image: "/placeholder-ff1cq.png",
    category: "tinctures",
    description: "High-potency CBD oil for daily wellness.",
    thc: "0.3%",
    cbd: "1000mg",
    effects: ["Calm", "Focused"],
    flavors: ["Natural", "Mint"],
    inStock: true,
    stockCount: 20,
    rating: 4.9,
    reviewCount: 210,
    slug: "green-guardian-cbd-oil",
  },
  {
    id: "6",
    name: "Serenity Sativa",
    price: 48.5,
    image: "/placeholder-flower2.png",
    category: "flower",
    description: "An uplifting sativa for creativity and daytime use.",
    thc: "22%",
    cbd: "1%",
    effects: ["Energetic", "Uplifted", "Creative"],
    flavors: ["Citrus", "Sweet", "Spicy"],
    inStock: true,
    stockCount: 18,
    rating: 4.7,
    reviewCount: 95,
    slug: "serenity-sativa",
  },
]

export default function StorePage() {
  const { setProducts } = useStore()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    priceRange: [0, 100],
    sortBy: "featured",
    search: searchParams.get("search") || "",
  })

  useEffect(() => {
    setProducts(allProducts)
  }, [setProducts])

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => (filters.category === "all" ? true : p.category === filters.category))
      .filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
      .filter((p) => p.name.toLowerCase().includes(filters.search.toLowerCase()))
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "price-asc":
            return a.price - b.price
          case "price-desc":
            return b.price - a.price
          case "rating":
            return b.rating - a.rating
          default:
            return 0 // or featured logic
        }
      })
  }, [filters])

  return (
    <div className="bg-white">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900">Explore Our Products</h1>
          <p className="mt-4 text-xl text-gray-600">Find the perfect zen for your needs.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Filter className="mr-2" /> Filters
              </h3>
              <div className="space-y-6">
                <div>
                  <Label>Search</Label>
                  <Input
                    placeholder="Product name..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={filters.category} onValueChange={(v) => handleFilterChange("category", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="flower">Flower</SelectItem>
                      <SelectItem value="edibles">Edibles</SelectItem>
                      <SelectItem value="concentrates">Concentrates</SelectItem>
                      <SelectItem value="pre-rolls">Pre-Rolls</SelectItem>
                      <SelectItem value="tinctures">Tinctures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Price Range</Label>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={filters.priceRange}
                    onValueChange={(v) => handleFilterChange("priceRange", v)}
                  />
                  <div className="flex justify-between text-sm mt-2">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{filteredProducts.length} products found</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort by <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => handleFilterChange("sortBy", "featured")}>
                    Featured
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFilterChange("sortBy", "price-asc")}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFilterChange("sortBy", "price-desc")}>
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFilterChange("sortBy", "rating")}>
                    Avg. Rating
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
