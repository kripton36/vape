"use client"

import { Leaf, Shield, ChevronDown, ChevronUp, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function AboutPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const teamMembers = [
    {
      name: "Leo Chen",
      role: "Founder & Chief Panda",
      image: "/placeholder-panda-team1.png",
      bio: "A nature lover with a passion for pure, zen-like cannabis experiences.",
    },
    {
      name: "Mia Green",
      role: "Head of Garden",
      image: "/placeholder-panda-team2.png",
      bio: "Expert botanist ensuring every plant is grown with love and care.",
    },
    {
      name: "Sam Joy",
      role: "Panda Happiness Officer",
      image: "/placeholder-panda-team3.png",
      bio: "Dedicated to providing the best support for our panda family.",
    },
  ]

  const faqs = [
    {
      question: "Are your products natural?",
      answer:
        "Like a panda's diet, our products are 100% natural. We use organic growing methods and avoid all harmful pesticides and chemicals.",
    },
    {
      question: "How do you ensure product quality?",
      answer:
        "Every batch is panda-tested for quality and zen vibes! We also conduct rigorous third-party lab testing for potency and purity. Certificates of Analysis (COAs) are available for all products.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, as well as cryptocurrency (Bitcoin, Ethereum) for our tech-savvy panda friends.",
    },
    {
      question: "How is shipping handled?",
      answer:
        "We ship in discreet, eco-friendly packaging. Your order will be a happy little surprise, with no external branding.",
    },
    {
      question: "What if I'm not feeling the zen?",
      answer:
        "We offer a 30-day happiness guarantee. If you're not completely satisfied, contact our Panda Happiness Officer for a full refund or exchange.",
    },
    {
      question: "Do you have a loyalty program?",
      answer:
        "Yes! Join our 'Bamboo Club' to earn 'Zen Points' with every purchase, which you can redeem for discounts and exclusive products.",
    },
  ]

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-800 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <div>
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="text-5xl">🐼</div>
                <h1 className="text-5xl font-black tracking-tighter text-gray-900"></h1>
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 leading-tight">
                Finding Your Inner
                <span className="block bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                  Panda Peace
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Green Panda was born from a simple idea: cannabis should be as natural, joyful, and peaceful as a panda
                in a bamboo forest. We're a community dedicated to quality, nature, and finding our zen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-black tracking-tighter text-gray-900 mb-6">Our Panda Philosophy</h3>
              <p className="text-lg text-gray-600 mb-6">
                We believe in the power of nature to bring peace and happiness. Our mission is to provide the purest,
                highest-quality cannabis products, cultivated with love and respect for the earth, to help you find your
                perfect state of zen.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Leaf className="h-6 w-6 text-green-500" />
                  <span className="font-semibold">100% Naturally Grown</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-green-500" />
                  <span className="font-semibold">Lab-tested for purity and safety</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="h-6 w-6 text-green-500" />
                  <span className="font-semibold">Cultivated with love and positive vibes</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder-panda-about.png"
                alt="Serene bamboo forest"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Happy Pandas" },
              { number: "500+", label: "Zen Products" },
              { number: "99.9%", label: "Panda Satisfaction" },
              { number: "24/7", label: "Panda Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-extrabold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black tracking-tighter text-gray-900 mb-4">Meet the Panda Keepers</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A passionate team dedicated to cultivating joy and spreading zen vibes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index}>
                <Card className="border-green-200 hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                    <p className="text-green-600 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black tracking-tighter text-gray-900 mb-4">Panda Q&A</h3>
            <p className="text-lg text-gray-600">
              Got questions? We've got answers. Find everything you need to know about our zen garden.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index}>
                <Collapsible open={openFAQ === index} onOpenChange={() => setOpenFAQ(openFAQ === index ? null : index)}>
                  <CollapsibleTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow border-green-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900">{faq.question}</h4>
                          {openFAQ === index ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-500 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <div className="text-6xl mb-6">🐼</div>
            <h3 className="text-4xl font-extrabold tracking-tighter text-white mb-6">Ready to Find Your Zen?</h3>
            <p className="text-lg text-green-100 mb-8">
              Join thousands of happy pandas and discover premium, natural cannabis products today.
            </p>
            <div className="space-x-4">
              <Link href="/pro-store">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-3 rounded-full"
                >
                  Shop Now
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600 font-semibold px-8 py-3 bg-transparent rounded-full"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
