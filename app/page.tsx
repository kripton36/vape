"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Star, Leaf, Heart, Sparkles, TreePine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const [floatingLeaves, setFloatingLeaves] = useState<
    Array<{ id: number; x: number; y: number; delay: number; size: number; type: "cannabis" | "bamboo" }>
  >([])

  const [bambooStems, setBambooStems] = useState<Array<{ id: number; x: number; height: number; delay: number }>>([])

  useEffect(() => {
    // Create floating cannabis and bamboo leaves
    const leaves = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
      size: Math.random() * 0.4 + 0.6,
      type: Math.random() > 0.6 ? "cannabis" : ("bamboo" as "cannabis" | "bamboo"),
    }))
    setFloatingLeaves(leaves)

    // Create bamboo stems
    const stems = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      height: Math.random() * 40 + 60,
      delay: Math.random() * 3,
    }))
    setBambooStems(stems)
  }, [])

  const featuredProducts = [
    {
      id: 1,
      name: "Panda's Choice",
      price: 29.99,
      image: "/placeholder-defpf.png",
      badge: "Bestseller",
      rating: 4.9,
      description: "Our signature blend, loved by pandas everywhere",
    },
    {
      id: 2,
      name: "Bamboo Bliss",
      price: 39.99,
      image: "/placeholder-flower1.png",
      badge: "Premium",
      rating: 4.8,
      description: "Pure zen in every puff",
    },
    {
      id: 3,
      name: "Panda Munchies",
      price: 24.99,
      image: "/placeholder-gummies.png",
      badge: "Fan Favorite",
      rating: 4.9,
      description: "Sweet treats for the sweetest pandas",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-900 relative overflow-hidden">
      {/* Bamboo Forest Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {bambooStems.map((stem) => (
          <div
            key={stem.id}
            className="absolute bottom-0 opacity-10"
            style={{
              left: `${stem.x}%`,
              height: `${stem.height}%`,
              animationDelay: `${stem.delay}s`,
              animation: `sway 8s ease-in-out infinite ${stem.delay}s`,
            }}
          >
            {/* Bamboo Stem */}
            <div className="w-6 h-full bg-gradient-to-t from-green-800 to-green-600 rounded-t-full relative">
              {/* Bamboo Nodes */}
              <div
                className="absolute w-8 h-2 bg-green-700 rounded-full left-1/2 transform -translate-x-1/2"
                style={{ top: "20%" }}
              ></div>
              <div
                className="absolute w-8 h-2 bg-green-700 rounded-full left-1/2 transform -translate-x-1/2"
                style={{ top: "40%" }}
              ></div>
              <div
                className="absolute w-8 h-2 bg-green-700 rounded-full left-1/2 transform -translate-x-1/2"
                style={{ top: "60%" }}
              ></div>
              <div
                className="absolute w-8 h-2 bg-green-700 rounded-full left-1/2 transform -translate-x-1/2"
                style={{ top: "80%" }}
              ></div>

              {/* Bamboo Leaves at top */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  <div className="w-8 h-16 bg-green-500 rounded-full transform rotate-12 opacity-80"></div>
                  <div className="w-6 h-12 bg-green-600 rounded-full transform -rotate-12 opacity-80"></div>
                  <div className="w-7 h-14 bg-green-500 rounded-full transform rotate-6 opacity-80"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cannabis and Bamboo Leaves */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {floatingLeaves.map((leaf) => (
          <div
            key={leaf.id}
            className="absolute opacity-15"
            style={{
              left: `${leaf.x}%`,
              top: `${leaf.y}%`,
              transform: `scale(${leaf.size})`,
              animationDelay: `${leaf.delay}s`,
              animation: `float 10s ease-in-out infinite ${leaf.delay}s, rotate 15s linear infinite`,
            }}
          >
            {leaf.type === "cannabis" ? (
              // Cannabis Leaf SVG
              <svg className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C12 2 8 6 8 10C8 12 9 13 10 13C10 13 11 12 12 12C13 12 14 13 14 13C15 13 16 12 16 10C16 6 12 2 12 2Z" />
                <path d="M12 12C12 12 6 8 4 10C3 11 3 12 4 13C4 13 5 13 6 12C7 11 8 11 8 11C8 11 9 12 10 13C11 14 12 12 12 12Z" />
                <path d="M12 12C12 12 18 8 20 10C21 11 21 12 20 13C20 13 19 13 18 12C17 11 16 11 16 11C16 11 15 12 14 13C13 14 12 12 12 12Z" />
                <path d="M12 12C12 12 8 18 10 20C11 21 12 21 13 20C13 20 13 19 12 18C11 17 11 16 11 16C11 16 12 15 13 14C14 13 12 12 12 12Z" />
                <path d="M12 12C12 12 16 18 14 20C13 21 12 21 11 20C11 20 11 19 12 18C13 17 13 16 13 16C13 16 12 15 11 14C10 13 12 12 12 12Z" />
                <path d="M12 12L12 22" stroke="currentColor" strokeWidth="2" />
              </svg>
            ) : (
              // Bamboo Leaf
              <div className="w-8 h-16 bg-green-600 rounded-full transform rotate-12"></div>
            )}
          </div>
        ))}
      </div>

      {/* Cannabis Pattern Background */}
      <div className="fixed inset-0 opacity-5 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23166534' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-2.5-2-4.5-4.5-4.5S21 27.5 21 30s2 4.5 4.5 4.5S30 32.5 30 30zm-9 0c0-1.4 1.1-2.5 2.5-2.5S26 28.6 26 30s-1.1 2.5-2.5 2.5S21 31.4 21 30z'/%3E%3Cpath d='M25.5 25.5c1.4 0 2.5-1.1 2.5-2.5s-1.1-2.5-2.5-2.5S23 21.6 23 23s1.1 2.5 2.5 2.5zm0 10c1.4 0 2.5-1.1 2.5-2.5s-1.1-2.5-2.5-2.5S23 31.6 23 33s1.1 2.5 2.5 2.5z'/%3E%3Cpath d='M30 25.5c0-1.4-1.1-2.5-2.5-2.5S25 24.1 25 25.5s1.1 2.5 2.5 2.5S30 26.9 30 25.5zm-10 0c0-1.4-1.1-2.5-2.5-2.5S15 24.1 15 25.5s1.1 2.5 2.5 2.5S20 26.9 20 25.5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Panda Logo */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-white text-2xl">🐼</div>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Leaf className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  GREEN PANDA
                </h1>
                <p className="text-xs text-gray-600 font-semibold tracking-wider">ZEN • NATURAL • PREMIUM QUALITY</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/pro-store" className="text-gray-700 hover:text-green-600 font-semibold transition-colors">
                Shop
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600 font-semibold transition-colors">
                Our Story
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-green-600 font-semibold transition-colors">
                Account
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full px-6">
                  Join the Garden
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm font-semibold mb-6">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Premium Cannabis, Panda Approved
                </Badge>
              </div>

              <h2 className="text-6xl md:text-7xl font-black tracking-tight leading-none">
                <span className="text-gray-900">Welcome to</span>
                <br />
                <span className="bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                  Panda Paradise
                </span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Discover our zen garden of premium cannabis products. Carefully curated with love, naturally grown, and
                panda-tested for the ultimate chill experience.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/pro-store">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <TreePine className="mr-2 h-5 w-5" />
                    Explore the Garden
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-green-500 text-green-700 hover:bg-green-50 font-semibold rounded-full px-8 py-4 text-lg bg-transparent"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Our Story
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">4.9/5 from happy pandas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Leaf className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">100% Natural</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-green-100 to-green-200 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-600/10"></div>

                {/* Panda Illustration with Cannabis Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 relative">
                    <div className="text-8xl">🐼</div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="text-2xl">🌿</div>
                      <div className="text-2xl">🎋</div>
                      <div className="text-2xl">🌿</div>
                    </div>
                    <p className="text-green-700 font-semibold">Zen Panda Vibes</p>

                    {/* Floating cannabis leaves around panda */}
                    <div className="absolute -top-8 -left-8 text-green-500 opacity-60 animate-pulse">🌿</div>
                    <div
                      className="absolute -top-4 -right-8 text-green-600 opacity-60 animate-pulse"
                      style={{ animationDelay: "1s" }}
                    >
                      🌿
                    </div>
                    <div
                      className="absolute -bottom-4 -left-6 text-green-500 opacity-60 animate-pulse"
                      style={{ animationDelay: "2s" }}
                    >
                      🌿
                    </div>
                    <div
                      className="absolute -bottom-8 -right-4 text-green-600 opacity-60 animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    >
                      🌿
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold text-gray-700">Lab Tested</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span className="text-sm font-semibold text-gray-700">Made with Love</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative z-10 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black mb-4 text-gray-900">Panda's Favorites</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our most beloved products, carefully selected by our panda experts for the ultimate zen experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group bg-white border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:shadow-green-100 rounded-2xl overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain p-6 group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-green-500 text-white font-semibold">
                      {product.badge}
                    </Badge>
                    <div className="absolute top-4 right-4 text-2xl">🐼</div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-yellow-600 font-semibold">{product.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">${product.price}</span>
                      <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Zen Values */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black mb-4 text-gray-900">The Panda Way</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our philosophy is simple: natural, peaceful, and always with a smile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🌱",
                title: "Natural & Pure",
                description: "Like bamboo in the wild, our products are grown naturally without harmful chemicals.",
              },
              {
                icon: "☯️",
                title: "Zen Balance",
                description: "Finding the perfect harmony between relaxation and clarity, just like a peaceful panda.",
              },
              {
                icon: "💚",
                title: "Made with Love",
                description:
                  "Every product is crafted with care and attention, spreading good vibes to all our panda friends.",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="bg-white border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg rounded-2xl"
              >
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-6">{value.icon}</div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-green-500 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🐼🌿</div>
          <h3 className="text-5xl font-black mb-6 text-white">
            Ready to Join Our
            <span className="block">Zen Garden?</span>
          </h3>
          <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto">
            Discover the peaceful world of premium cannabis with your favorite panda friends. Natural products, zen
            vibes, and endless good times await!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/pro-store">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-green-50 font-bold px-12 py-4 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <TreePine className="mr-3 h-6 w-6" />
                Start Shopping
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-bold px-12 py-4 text-xl rounded-full bg-transparent"
              >
                <Heart className="mr-3 h-6 w-6" />
                Join the Family
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes sway {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          25% { transform: translateX(5px) rotate(2deg); }
          75% { transform: translateX(-5px) rotate(-2deg); }
        }
      `}</style>
    </div>
  )
}
