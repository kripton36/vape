"use client"

import { NavigationBar } from "@/components/navigation-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { useStore } from "@/lib/store-context"
import { Star, Leaf, Award, MessageCircle, ShoppingCart, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"

export default function HomePage() {
  const { products, setProducts } = useStore()

  // Mock product data - in a real app, this would come from your database
  const allProducts = [
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

  useEffect(() => {
    setProducts(allProducts)
  }, [setProducts])

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 3)

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-900">
      <NavigationBar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/placeholder-bc36y.png"
              alt="Zen background with bamboo"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 to-transparent" />
            <div
              className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"
              style={{ backgroundSize: "60px 60px" }}
            />
          </div>
          <div className="relative z-10 text-white space-y-6">
            <div className="text-6xl animate-bounce">🐼</div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
              Find Your Inner <span className="block text-green-300">Zen</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-green-100">
              Discover premium, organic cannabis products crafted for peace, balance, and well-being.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/store">
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-700 font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  <Leaf className="mr-2 h-5 w-5" /> Our Story
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Panda's Featured Selection</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Hand-picked products loved by our community for their exceptional quality and zen-inducing effects.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/store">
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-full bg-transparent"
                >
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-green-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Green Panda?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're more than just a store; we're a community dedicated to your well-being.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Award,
                  title: "Premium Quality",
                  description: "Only the finest, lab-tested cannabis products. Grown with care, delivered with zen.",
                },
                {
                  icon: Shield,
                  title: "Secure & Discreet",
                  description:
                    "Your privacy is paramount. We ensure secure transactions and discreet packaging every time.",
                },
                {
                  icon: MessageCircle,
                  title: "Panda Support",
                  description:
                    "Our friendly team is here to guide you. Experience peace of mind with our dedicated customer service.",
                },
              ].map((feature) => (
                <Card key={feature.title} className="text-center p-6 bg-white shadow-lg border-green-200">
                  <CardContent className="p-0">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white mb-6">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Pandas Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Hear from our happy customers who found their zen with Green Panda.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "ZenSeeker",
                  rating: 5,
                  comment:
                    "Green Panda truly delivers on its promise of peace. The quality is unmatched, and their customer service is top-notch!",
                  avatar: "/placeholder-avatar.png",
                },
                {
                  name: "HappyCamper",
                  rating: 5,
                  comment:
                    "I've tried many dispensaries, but Green Panda stands out. Discreet shipping and fantastic products every time.",
                  avatar: "/placeholder-avatar.png",
                },
                {
                  name: "MindfulMama",
                  rating: 4,
                  comment:
                    "Their edibles are a game-changer for my evening routine. Gentle, effective, and delicious. Highly recommend!",
                  avatar: "/placeholder-avatar.png",
                },
              ].map((testimonial, index) => (
                <Card key={index} className="p-6 bg-green-50/50 shadow-md border-green-200">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                        <div className="flex items-center">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 italic leading-relaxed">"{testimonial.comment}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="text-6xl mb-6">🌿</div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">Ready to Embrace Your Zen?</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-green-100 mb-8">
              Join the Green Panda family and embark on a journey of natural well-being.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/store">
                <Button
                  size="lg"
                  className="bg-white text-green-700 hover:bg-green-50 font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Shop Our Collection
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-700 font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
