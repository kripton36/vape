"use client"

import { useState } from "react"
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { NavigationBar } from "@/components/navigation-bar"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

const faqData: FAQ[] = [
  {
    id: "1",
    question: "What makes Green Panda products special?",
    answer:
      "Our zen-inspired cannabis products are crafted with love by our panda family. We use only the finest organic ingredients and sustainable practices to bring you peaceful, high-quality experiences. Each product is tested for purity and potency to ensure your journey to tranquility is safe and enjoyable. 🐼🌿",
    category: "Products",
    tags: ["quality", "organic", "testing"],
  },
  {
    id: "2",
    question: "How do I place an order?",
    answer:
      "Placing an order is as peaceful as a panda nap! Simply browse our zen collection, add your favorite products to your bamboo cart, and proceed to checkout. We accept various payment methods including crypto and CashApp for your convenience. Your order will be processed with love and care. 🛒",
    category: "Orders",
    tags: ["ordering", "checkout", "cart"],
  },
  {
    id: "3",
    question: "What payment methods do you accept?",
    answer: "We accept various payment methods including major credit cards and other secure online payment systems.",
    category: "Payments",
    tags: ["payment", "crypto", "cashapp", "security"],
  },
  {
    id: "4",
    question: "How long does shipping take?",
    answer:
      "Our panda delivery team works diligently to get your zen products to you quickly! Standard shipping takes 3-5 business days, while express shipping arrives in 1-2 business days. We'll send you tracking information so you can follow your package's peaceful journey. 📦",
    category: "Orders",
    tags: ["shipping", "delivery", "tracking"],
  },
  {
    id: "5",
    question: "Can I track my order?",
    answer:
      "Once your order ships, you'll receive a tracking number via email. You can also check your order status in your account dashboard. Our customer support pandas are always happy to help if you need assistance tracking your zen delivery! 🔍",
    category: "Orders",
    tags: ["tracking", "status", "dashboard"],
  },
  {
    id: "6",
    question: "What is your return policy?",
    answer:
      "Due to the nature of our products, we generally do not accept returns. However, if your product arrives damaged or is incorrect, please contact our support team within 48 hours of delivery.",
    category: "Orders",
    tags: ["returns", "refund", "policy"],
  },
  {
    id: "7",
    question: "How do I earn Zen Points?",
    answer:
      "You earn Zen Points with every purchase! You can redeem these points for discounts on future orders. Make sure you're logged into your account to accumulate points.",
    category: "Account",
    tags: ["points", "rewards", "loyalty"],
  },
  {
    id: "8",
    question: "Are your products lab tested?",
    answer:
      "Yes! Every Green Panda product undergoes rigorous third-party lab testing for potency, purity, and safety. We test for pesticides, heavy metals, residual solvents, and microbials. Lab results are available upon request because transparency is part of our zen philosophy. 🧪",
    category: "Products",
    tags: ["testing", "safety", "lab", "quality"],
  },
  {
    id: "9",
    question: "Do you offer bulk discounts?",
    answer:
      "Yes! We offer special pricing for bulk orders. Contact our sales team for custom quotes on large quantities. Whether you're stocking up for personal use or for your business, our pandas will work with you to find the perfect zen solution at the right price. 📊",
    category: "Products",
    tags: ["bulk", "discount", "wholesale"],
  },
  {
    id: "10",
    question: "Is my personal information secure?",
    answer:
      "Your privacy and security are our top priorities. We use industry-standard encryption to protect your personal and payment information. We never share your data with third parties without your consent. Your trust is sacred to our panda family. 🔒",
    category: "Account",
    tags: ["privacy", "security", "data"],
  },
  {
    id: "11",
    question: "Is cannabis legal in my state?",
    answer:
      "Cannabis laws vary by state. We comply with all local and federal regulations and only ship to states where recreational or medical cannabis is legal. Please check your local laws before ordering.",
    category: "Legal",
    tags: ["legal", "state", "regulations"],
  },
  {
    id: "12",
    question: "How is my order packaged?",
    answer:
      "Your privacy is our priority. All orders are shipped in discreet, unmarked packaging with no indication of the contents inside.",
    category: "Orders",
    tags: ["packaging", "privacy", "discreet"],
  },
]

const categories = ["All", "Products", "Orders", "Payments", "Account", "Legal"]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [openItems, setOpenItems] = useState<string[]>([])

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="mt-4 text-xl text-gray-600">Find answers to common questions about Panda Cannabis.</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for answers to find your zen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-green-300 focus:border-green-500 bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`${
                selectedCategory === category
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4 mb-12">
          {filteredFAQs.map((faq) => (
            <Card
              key={faq.id}
              className="border-green-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-green-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3">
                        <Badge className="bg-green-100 text-green-800 mt-1">{faq.category}</Badge>
                        <CardTitle className="text-left text-green-800 text-lg">{faq.question}</CardTitle>
                      </div>
                      {openItems.includes(faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <p className="text-green-700 leading-relaxed mb-4">{faq.answer}</p>
                    <div className="flex flex-wrap gap-2">
                      {faq.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-green-300 text-green-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐼</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">No answers found</h3>
            <p className="text-green-600 mb-6">
              We couldn't find any FAQs matching your search. Try different keywords or contact our support team.
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-20 text-center p-8 bg-green-100/70 rounded-2xl max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900">Can't find your answer?</h2>
          <p className="mt-2 text-gray-700">
            Our Customer Zen Masters are here to help. Contact us for any further questions.
          </p>
          <a
            href="mailto:support@zenpanda.com"
            className="mt-4 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <Mail className="mr-2 h-5 w-5" /> Contact Support
          </a>
        </div>
      </main>
    </div>
  )
}
