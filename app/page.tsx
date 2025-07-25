"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NavigationBar } from "@/components/navigation-bar"
import { ProductCard } from "@/components/product-card"
import { useStore, type Product } from "@/lib/store-context"
import { Star, Leaf, Shield, Truck, Award, Users, Sparkles, ArrowRight, Heart, Gift } from "lucide-react"

// Mock featured products
const featuredProducts: Product[] = [
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
]

// Mock testimonials
const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder-team1.png",
    rating: 5,
    text: "Zen Panda has completely transformed my wellness routine. The quality is unmatched and the zen vibes are real! 🐼",
    product: "Zen Master OG",
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    avatar: "/placeholder-team2.png",
    rating: 5,
    text: "Fast delivery, amazing products, and the customer service is top-notch. This panda knows what they're doing!",
    product: "Panda's Dream",
  },
  {
    id: 3,
    name: "Emma Thompson",
    avatar: "/placeholder-team3.png",
    rating: 5,
    text: "The lab testing and quality assurance gives me complete peace of mind. Plus, who doesn't love pandas? 🌿",
    product: "Bamboo Bliss",
  },
]

export default function HomePage() {
  const { setProducts } = useStore()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Set featured products in store
  useEffect(() => {
    setProducts(featuredProducts)
  }, [setProducts])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <NavigationBar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g fill="#ffffff" fillOpacity="0.1"><circle cx="30" cy="30" r="2"/></g></g></svg>')}")`,
          }}
        />

        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  🐼 Welcome to Zen Panda
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Find Your
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Inner Zen
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-green-100 leading-relaxed">
                  Premium cannabis products curated for your wellness journey. Lab-tested, organic, and delivered with
                  peaceful panda vibes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-6">
                  <Link href="/store">
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-6 bg-transparent"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-8">
                <div className="flex items-center gap-2 text-green-100">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium">Lab Tested</span>
                </div>
                <div className="flex items-center gap-2 text-green-100">
                  <Leaf className="h-5 w-5" />
                  <span className="text-sm font-medium">100% Organic</span>
                </div>
                <div className="flex items-center gap-2 text-green-100">
                  <Truck className="h-5 w-5" />
                  <span className="text-sm font-medium">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-green-100">
                  <Award className="h-5 w-5" />
                  <span className="text-sm font-medium">Premium Quality</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/placeholder-defpf.png"
                  alt="Zen Panda Hero"
                  width={500}
                  height={600}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl opacity-20 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-to-tr from-green-400 to-emerald-400 rounded-2xl opacity-20 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 mb-4">
              <Sparkles className="mr-2 h-4 w-4" />
              Featured Products
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Curated for Your
              <span className="block text-green-600">Zen Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our hand-picked selection of premium cannabis products, each chosen for quality, potency, and the
              perfect zen experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/store">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose
              <span className="block text-green-600">Zen Panda?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another cannabis retailer. We're your partners in wellness, committed to quality,
              transparency, and your zen journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Lab Tested Quality",
                description: "Every product is rigorously tested for purity, potency, and safety by third-party labs.",
                color: "text-blue-600",
                bgColor: "bg-blue-100",
              },
              {
                icon: Leaf,
                title: "100% Organic",
                description: "Sustainably grown, pesticide-free cannabis products that respect nature and your body.",
                color: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                icon: Truck,
                title: "Fast & Discreet",
                description: "Quick, secure delivery in unmarked packages. Your privacy is our priority.",
                color: "text-purple-600",
                bgColor: "bg-purple-100",
              },
              {
                icon: Users,
                title: "Expert Support",
                description: "Our knowledgeable team is here to guide you to the perfect products for your needs.",
                color: "text-orange-600",
                bgColor: "bg-orange-100",
              },
              {
                icon: Award,
                title: "Premium Selection",
                description: "Carefully curated products from trusted growers and manufacturers.",
                color: "text-red-600",
                bgColor: "bg-red-100",
              },
              {
                icon: Heart,
                title: "Community Focused",
                description: "Supporting local communities and promoting responsible cannabis use.",
                color: "text-pink-600",
                bgColor: "bg-pink-100",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 mb-4">
              <Star className="mr-2 h-4 w-4" />
              Customer Love
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Zen
              <span className="block text-green-600">Community Says</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-green-50">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-2xl lg:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  <div className="flex items-center justify-center space-x-4">
                    <Image
                      src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                      alt={testimonials[currentTestimonial].name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-bold text-gray-900">{testimonials[currentTestimonial].name}</div>
                      <div className="text-green-600 text-sm">
                        Verified Purchase: {testimonials[currentTestimonial].product}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? "bg-green-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g fill="#ffffff" fillOpacity="0.1"><circle cx="30" cy="30" r="2"/></g></g></svg>')}")`,
          }}
        />

        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="text-6xl mb-6">🐼</div>
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">Ready to Find Your Zen?</h2>
            <p className="text-xl lg:text-2xl text-green-100 mb-12 leading-relaxed">
              Join thousands of satisfied customers on their wellness journey. Premium cannabis products, delivered with
              love and peaceful panda vibes.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50 text-lg px-12 py-6">
                <Link href="/store">
                  <Gift className="mr-2 h-5 w-5" />
                  Shop Now
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-12 py-6 bg-transparent"
              >
                <Link href="/login">
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">🐼</div>
                <span className="text-xl font-bold">Zen Panda</span>
              </div>
              <p className="text-gray-400">
                Premium cannabis products for your wellness journey. Find your zen with quality you can trust.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors cursor-pointer">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors cursor-pointer">
                  <span className="text-sm">i</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/store?category=flower" className="hover:text-white transition-colors">
                    Flower
                  </Link>
                </li>
                <li>
                  <Link href="/store?category=edibles" className="hover:text-white transition-colors">
                    Edibles
                  </Link>
                </li>
                <li>
                  <Link href="/store?category=concentrates" className="hover:text-white transition-colors">
                    Concentrates
                  </Link>
                </li>
                <li>
                  <Link href="/store?category=pre-rolls" className="hover:text-white transition-colors">
                    Pre-Rolls
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white transition-colors">
                    Shipping Info
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/age-verification" className="hover:text-white transition-colors">
                    Age Verification
                  </Link>
                </li>
                <li>
                  <Link href="/compliance" className="hover:text-white transition-colors">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Zen Panda. All rights reserved. 🐼 Find your zen responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
