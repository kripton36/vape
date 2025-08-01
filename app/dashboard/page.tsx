"use client"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { TabsContent as TabsContentComponent } from "@/components/ui/tabs"
import { Tabs } from "@/components/ui/tabs"
import { useState } from "react"
import { NavigationBar } from "@/components/navigation-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store-context"
import {
  User,
  Package,
  Heart,
  LogOut,
  TrendingUp,
  Shield,
  Upload,
  Star,
  Wallet,
  Plus,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  AlertCircle,
  Edit,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { TopUpWalletModal } from "@/components/top-up-wallet-modal"
import { WithdrawFundsModal } from "@/components/withdraw-funds-modal"

export default function DashboardPage() {
  const { user, updateUserWalletBalance, updateUserLoyaltyPoints } = useStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

  if (!user) {
    if (typeof window !== "undefined") {
      router.push("/login")
    }
    return null
  }

  const recentOrders = [
    {
      id: "PANDA-001",
      date: "2024-07-15",
      status: "delivered",
      total: 76.97,
      items: [
        { name: "Panda's Choice", quantity: 2, image: "/placeholder-defpf.png" },
        { name: "Panda Munchies", quantity: 1, image: "/placeholder-gummies.png" },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "shipped",
      total: 35.99,
      items: [{ name: "Purple Haze", quantity: 1, image: "/placeholder-flower1.png" }],
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "processing",
      total: 129.99,
      items: [{ name: "Glass Bong", quantity: 1, image: "/placeholder-bong.png" }],
    },
  ]

  const wishlistItems = [
    { id: 1, name: "Blue Dream", price: 38.99, image: "/placeholder-flower3.png" },
    { id: 2, name: "Zen Cookies", price: 18.99, image: "/placeholder-cookies.png" },
    { id: 3, name: "Grinder Pro", price: 24.99, image: "/placeholder-grinder.png" },
  ]

  const walletTransactions = [
    {
      id: "TXN-001",
      type: "topup",
      amount: 100.0,
      method: "Bitcoin",
      status: "completed",
      date: "2024-01-24",
      description: "Wallet top-up via Bitcoin",
    },
    {
      id: "TXN-002",
      type: "purchase",
      amount: -76.97,
      method: "Wallet Balance",
      status: "completed",
      date: "2024-01-23",
      description: "Order #ORD-001 payment",
    },
    {
      id: "TXN-003",
      type: "topup",
      amount: 50.0,
      method: "CashApp",
      status: "completed",
      date: "2024-01-20",
      description: "Wallet top-up via CashApp",
    },
    {
      id: "TXN-004",
      type: "purchase",
      amount: -35.99,
      method: "Wallet Balance",
      status: "completed",
      date: "2024-01-18",
      description: "Order #ORD-002 payment",
    },
    {
      id: "TXN-005",
      type: "refund",
      amount: 25.0,
      method: "Wallet Credit",
      status: "completed",
      date: "2024-01-15",
      description: "Refund for cancelled order",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "topup":
      case "refund":
        return <ArrowDownRight className="h-4 w-4 text-green-500" />
      case "purchase":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      default:
        return <CreditCard className="h-4 w-4 text-slate-500" />
    }
  }

  const handleTopUpConfirm = (amount: number, method: string) => {
    console.log(`Top up $${amount} via ${method}`)
    updateUserWalletBalance(amount)
    setIsTopUpModalOpen(false)
    // In a real app, this would process the payment and update the backend
  }

  const handleWithdrawConfirm = (amount: number, method: string, details: string) => {
    console.log(`Withdraw $${amount} via ${method} with details: ${details}`)
    updateUserWalletBalance(-amount) // Subtract from balance
    setIsWithdrawModalOpen(false)
    // In a real app, this would process the withdrawal and update the backend
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome, {user.name}!</h1>
            <p className="text-lg text-gray-600">Here's your Panda Cannabis dashboard.</p>
          </div>
          <Button variant="outline" onClick={() => setActiveTab("profile")}>
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">View your order history</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Zen Points</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.points}</div>
              <p className="text-xs text-muted-foreground">Earn more by shopping!</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>Your saved items for later.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Wishlist items would be listed here */}
              <p className="text-gray-500">Your wishlist is empty.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mt-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 border-green-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center text-4xl">🐼</div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="mt-2 bg-green-100 text-green-800 px-2 py-1 rounded-full">Zen Master</div>
                  </div>
                </div>

                <nav className="mt-8 space-y-2">
                  {[
                    { id: "overview", label: "Overview", icon: TrendingUp },
                    { id: "orders", label: "My Orders", icon: Package },
                    { id: "wishlist", label: "Wishlist", icon: Heart },
                    { id: "wallet", label: "Wallet", icon: Wallet },
                    { id: "points", label: "Zen Points", icon: Star },
                    { id: "profile", label: "Profile", icon: User },
                    { id: "kyc", label: "Verification", icon: Shield },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-full transition-colors ${
                          activeTab === item.id
                            ? "bg-green-500 text-white font-semibold shadow-md"
                            : "text-gray-600 hover:bg-green-100"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}

                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-full text-gray-600 hover:bg-green-100 transition-colors">
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContentComponent value="overview" className="space-y-6">
                  <h1 className="text-3xl font-bold text-gray-900">Panda Dashboard</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { title: "Total Orders", value: "12", icon: Package, color: "green" },
                      { title: "Total Spent", value: "$847", icon: TrendingUp, color: "blue" },
                      {
                        title: "Wallet Balance",
                        value: `$${user.walletBalance.toFixed(2)}`,
                        icon: Wallet,
                        color: "purple",
                      },
                      { title: "Zen Points", value: user.points.toLocaleString(), icon: Star, color: "yellow" },
                    ].map((stat) => {
                      const Icon = stat.icon
                      return (
                        <Card key={stat.title} className="bg-white/80 border-green-200 shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                                <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  <Card className="bg-white/80 border-green-200 shadow-lg">
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-4 bg-green-50/50 rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex -space-x-2">
                                {order.items.slice(0, 2).map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="w-10 h-10 bg-white rounded-full border-2 border-white flex items-center justify-center"
                                  >
                                    <Image
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      width={30}
                                      height={30}
                                      className="object-contain"
                                    />
                                  </div>
                                ))}
                              </div>
                              <div>
                                <p className="font-semibold">{order.id}</p>
                                <p className="text-sm text-gray-600">{order.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full">{order.status}</div>
                              <p className="font-bold mt-1">${order.total}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContentComponent>

                <TabsContentComponent value="orders" className="space-y-6">
                  <h1 className="text-3xl font-bold text-gray-900">Order History</h1>

                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <Card key={order.id} className="bg-white/80 border-green-200 shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-lg">{order.id}</h3>
                              <p className="text-gray-600">Ordered on {order.date}</p>
                            </div>
                            <div className="text-right">
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full">{order.status}</div>
                              <p className="font-bold text-lg mt-1">${order.total}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold">{item.name}</p>
                                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex space-x-2 mt-4">
                            <Button variant="outline" size="sm" className="bg-white/80 border-green-200 shadow-lg">
                              Track Order
                            </Button>
                            <Button variant="outline" size="sm" className="bg-white/80 border-green-200 shadow-lg">
                              Reorder
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContentComponent>

                <TabsContentComponent value="wishlist" className="space-y-6">
                  <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <Card key={item.id} className="bg-white/80 border-green-200 shadow-lg">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-green-50 rounded-lg mb-4 flex items-center justify-center">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={120}
                              height={120}
                              className="object-contain"
                            />
                          </div>
                          <h3 className="font-bold mb-2">{item.name}</h3>
                          <p className="text-2xl font-bold text-green-600 mb-4">${item.price}</p>
                          <div className="space-y-2">
                            <Button className="w-full bg-green-500 hover:bg-green-600">Add to Cart</Button>
                            <Button variant="outline" className="w-full bg-transparent">
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContentComponent>

                <TabsContentComponent value="wallet" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsTopUpModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Top Up Wallet
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white/80 border-green-200 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Wallet className="h-5 w-5 text-green-500" />
                          <span>Current Balance</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                          <div className="text-4xl font-extrabold text-green-600 mb-2">
                            ${user.walletBalance.toFixed(2)}
                          </div>
                          <p className="text-gray-600">Available Balance</p>
                          <p className="text-sm text-gray-500 mt-2">Ready to spend on your next order</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                            <span className="font-medium">Total Deposited</span>
                            <span className="text-green-600 font-bold">$275.00</span> {/* Placeholder */}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                            <span className="font-medium">Total Spent</span>
                            <span className="text-red-600 font-bold">$112.96</span> {/* Placeholder */}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                            <span className="font-medium">Pending Transactions</span>
                            <span className="text-yellow-600 font-bold">$0.00</span> {/* Placeholder */}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 border-green-200 shadow-lg">
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                            onClick={() => setIsTopUpModalOpen(true)}
                          >
                            <Plus className="h-6 w-6 text-green-600" />
                            <span className="text-sm font-medium">Add Funds</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                            onClick={() => setIsWithdrawModalOpen(true)}
                          >
                            <ArrowUpRight className="h-6 w-6 text-blue-600" />
                            <span className="text-sm font-medium">Withdraw</span>
                          </Button>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Auto Top-Up</h4>
                          <p className="text-sm text-blue-700 mb-3">
                            Automatically add funds when your balance drops below $25
                          </p>
                          <Button size="sm" variant="outline" className="bg-transparent border-blue-300">
                            Enable Auto Top-Up
                          </Button>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2">Payment Benefits</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• Faster checkout process</li>
                            <li>• No payment processing delays</li>
                            <li>• Exclusive wallet-only discounts</li>
                            <li>• Priority order processing</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-white/80 border-green-200 shadow-lg">
                    <CardHeader>
                      <CardTitle>Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {walletTransactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 bg-green-50/50 rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-white rounded-lg">{getTransactionIcon(transaction.type)}</div>
                              <div>
                                <p className="font-semibold">{transaction.description}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <span>{transaction.date}</span>
                                  <span>•</span>
                                  <span>{transaction.method}</span>
                                  <div
                                    className={
                                      transaction.status === "completed"
                                        ? "bg-green-100 text-green-800 px-2 py-1 rounded-full"
                                        : "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                                    }
                                  >
                                    {transaction.status}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`font-bold text-lg ${
                                  transaction.amount > 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContentComponent>

                <TabsContentComponent value="points" className="space-y-6">
                  <h1 className="text-3xl font-bold text-gray-900">Zen Points</h1>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white/80 border-green-200 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <span>Points Balance</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                          <div className="text-4xl font-extrabold text-yellow-600 mb-2">{user.points}</div>
                          <p className="text-gray-600">Available Points</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Worth ${(user.points / 100).toFixed(2)} in rewards
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                            <span className="font-medium">Points Earned This Month</span>
                            <span className="text-green-600 font-bold">+340</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                            <span className="font-medium">Points Redeemed</span>
                            <span className="text-red-600 font-bold">-150</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                            <span className="font-medium">Next Tier</span>
                            <span className="text-blue-600 font-bold">VIP Gold (3,000 pts)</span>
                          </div>
                        </div>

                        <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Redeem Points</Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 border-green-200 shadow-lg">
                      <CardHeader>
                        <CardTitle>How to Earn Points</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Package className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="font-medium">Every $1 spent</span>
                            </div>
                            <span className="text-green-600 font-bold">+10 points</span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium">Account creation</span>
                            </div>
                            <span className="text-blue-600 font-bold">+100 points</span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Heart className="h-4 w-4 text-purple-600" />
                              </div>
                              <span className="font-medium">Product review</span>
                            </div>
                            <span className="text-purple-600 font-bold">+25 points</span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <Users className="h-4 w-4 text-orange-600" />
                              </div>
                              <span className="font-medium">Refer a friend</span>
                            </div>
                            <span className="text-orange-600 font-bold">+200 points</span>
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-green-50/50 rounded-lg border border-green-200">
                          <h4 className="font-semibold mb-2">Loyalty Tiers</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Bronze (0-999 pts)</span>
                              <span>1x points</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Silver (1,000-2,999 pts)</span>
                              <span>1.2x points</span>
                            </div>
                            <div className="flex justify-between font-semibold text-green-600">
                              <span>Gold (3,000-4,999 pts) ← Current</span>
                              <span>1.5x points</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Platinum (5,000+ pts)</span>
                              <span>2x points</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-white/80 border-green-200 shadow-lg">
                    <CardHeader>
                      <CardTitle>Points History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          {
                            date: "2024-01-24",
                            description: "Purchase - Order #ORD-001",
                            points: "+77",
                            type: "earned",
                          },
                          {
                            date: "2024-01-20",
                            description: "Product Review - NOVA Pro Max",
                            points: "+25",
                            type: "earned",
                          },
                          {
                            date: "2024-01-18",
                            description: "Redeemed - $15 discount",
                            points: "-150",
                            type: "redeemed",
                          },
                          {
                            date: "2024-01-15",
                            description: "Purchase - Order #ORD-002",
                            points: "+36",
                            type: "earned",
                          },
                          {
                            date: "2024-01-10",
                            description: "Friend Referral - Jane Smith",
                            points: "+200",
                            type: "earned",
                          },
                        ].map((transaction, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-gray-500">{transaction.date}</p>
                            </div>
                            <span
                              className={`font-bold ${transaction.type === "earned" ? "text-green-600" : "text-red-600"}`}
                            >
                              {transaction.points}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContentComponent>

                <TabsContentComponent value="profile" className="space-y-6">
                  <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white/80 border-green-200 shadow-lg">
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">First Name</Label>
                            <Input className="w-full mt-1 p-2 border rounded-lg" defaultValue="John" />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Last Name</Label>
                            <Input className="w-full mt-1 p-2 border rounded-lg" defaultValue="Doe" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Email</Label>
                          <Input className="w-full mt-1 p-2 border rounded-lg" defaultValue="john@example.com" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Phone</Label>
                          <Input className="w-full mt-1 p-2 border rounded-lg" defaultValue="(555) 123-4567" />
                        </div>
                        <Button className="bg-green-600 hover:bg-green-700">Update Profile</Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 border-green-200 shadow-lg">
                      <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Address</Label>
                          <Input className="w-full mt-1 p-2 border rounded-lg" defaultValue="123 Main St" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">City</Label>
                            <Input className="w-full mt-1 p-2 border rounded-lg" defaultValue="New York" />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">State</Label>
                            <Input className="w-full mt-1 p-2 border rounded-lg" defaultValue="NY" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">ZIP Code</Label>
                          <Input className="w-full mt-1 p-2 border rounded-lg" defaultValue="10001" />
                        </div>
                        <Button className="bg-green-600 hover:bg-green-700">Update Address</Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContentComponent>

                <TabsContentComponent value="kyc" className="space-y-6">
                  <h1 className="text-3xl font-bold text-gray-900">Verification</h1>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white/80 border-green-200 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-green-500" />
                          <span>Identity Verification</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="font-semibold text-yellow-800">Verification Required</p>
                            <p className="text-sm text-yellow-700">Complete KYC to unlock full account features</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">Government ID</Label>
                            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Upload driver's license or passport</p>
                              <Input type="file" className="hidden" accept="image/*" />
                              <Button variant="outline" className="mt-2 bg-transparent">
                                Choose File
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Proof of Address</Label>
                            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Upload utility bill or bank statement</p>
                              <Input type="file" className="hidden" accept="image/*" />
                              <Button variant="outline" className="mt-2 bg-transparent">
                                Choose File
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full bg-green-600 hover:bg-green-700">Submit for Verification</Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 border-green-200 shadow-lg">
                      <CardHeader>
                        <CardTitle>Verification Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                            <span className="font-medium">Email Verification</span>
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                            <span className="font-medium">Phone Verification</span>
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                            <span className="font-medium">Identity Verification</span>
                            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                            <span className="font-medium">Address Verification</span>
                            <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Not Started</div>
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Benefits of Verification</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Higher purchase limits</li>
                            <li>• Priority customer support</li>
                            <li>• Access to exclusive products</li>
                            <li>• Faster withdrawal processing</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContentComponent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <TopUpWalletModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        onConfirm={handleTopUpConfirm}
      />

      <WithdrawFundsModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={handleWithdrawConfirm}
        currentBalance={user.walletBalance}
      />
    </div>
  )
}
