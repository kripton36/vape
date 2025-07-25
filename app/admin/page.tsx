"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LineChart, BarChart } from "@/components/charts"
import { TrendingUp, TrendingDown, DollarSign, Users, Package, ShoppingCart, Star, Leaf } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      description: "Zen profits flowing peacefully",
    },
    {
      title: "Happy Pandas",
      value: "2,350",
      change: "+180.1%",
      trend: "up",
      icon: Users,
      description: "Growing bamboo family",
    },
    {
      title: "Zen Orders",
      value: "12,234",
      change: "+19%",
      trend: "up",
      icon: ShoppingCart,
      description: "Peaceful transactions",
    },
    {
      title: "Harmony Products",
      value: "573",
      change: "+201",
      trend: "up",
      icon: Package,
      description: "Natural offerings",
    },
  ]

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Zen Master Liu",
      product: "Bamboo Bliss Gummies 🐼",
      amount: "$89.99",
      status: "completed",
      time: "2 min ago",
    },
    {
      id: "ORD-002",
      customer: "Peaceful Panda",
      product: "Harmony Hash 🌿",
      amount: "$156.50",
      status: "processing",
      time: "5 min ago",
    },
    {
      id: "ORD-003",
      customer: "Bamboo Lover",
      product: "Zen Garden Cookies 🍪",
      amount: "$45.00",
      status: "completed",
      time: "12 min ago",
    },
    {
      id: "ORD-004",
      customer: "Nature Spirit",
      product: "Peaceful Pipe 🎋",
      amount: "$234.99",
      status: "shipped",
      time: "1 hour ago",
    },
    {
      id: "ORD-005",
      customer: "Green Goddess",
      product: "Tranquil Treats 🌱",
      amount: "$67.25",
      status: "completed",
      time: "2 hours ago",
    },
  ]

  const topProducts = [
    { name: "Bamboo Bliss Gummies 🐼", sales: 1234, revenue: "$12,340", growth: 15 },
    { name: "Zen Garden Cookies 🍪", sales: 987, revenue: "$9,870", growth: 12 },
    { name: "Harmony Hash 🌿", sales: 756, revenue: "$15,120", growth: 8 },
    { name: "Peaceful Pipe 🎋", sales: 543, revenue: "$21,720", growth: 22 },
    { name: "Tranquil Treats 🌱", sales: 432, revenue: "$8,640", growth: 5 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              🐼 Panda Admin Dashboard
            </h1>
            <p className="text-green-600 mt-2">Welcome to your zen business sanctuary</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 font-medium">All systems peaceful</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-green-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800 mb-1">{stat.value}</div>
                <div className="flex items-center text-xs">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                  <span className="text-green-500 ml-1">from last month</span>
                </div>
                <p className="text-xs text-green-600 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Growth
              </CardTitle>
              <CardDescription className="text-green-600">
                Monthly revenue flowing like a peaceful stream 🌊
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart />
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Performance
              </CardTitle>
              <CardDescription className="text-green-600">
                Top zen products loved by our panda family 🐼
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart />
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Recent Zen Orders
              </CardTitle>
              <CardDescription className="text-green-600">
                Latest peaceful transactions from our bamboo family
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-green-800">{order.customer}</span>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-green-600 mb-1">{order.product}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-700">{order.amount}</span>
                        <span className="text-xs text-green-500">{order.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Zen Products
              </CardTitle>
              <CardDescription className="text-green-600">
                Most beloved items in our peaceful collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-sm font-bold text-green-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-green-800">{product.name}</p>
                        <p className="text-sm text-green-600">{product.sales} happy customers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-700">{product.revenue}</p>
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />+{product.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Zen Garden Status
            </CardTitle>
            <CardDescription className="text-green-600">
              Current harmony levels across your panda empire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Customer Happiness</span>
                  <span className="text-sm text-green-600">98%</span>
                </div>
                <Progress value={98} className="h-2" />
                <p className="text-xs text-green-500">Pandas are very content 🐼</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Inventory Zen</span>
                  <span className="text-sm text-green-600">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-green-500">Stock levels balanced 🌿</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Order Fulfillment</span>
                  <span className="text-sm text-green-600">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                <p className="text-xs text-green-500">Peaceful delivery flow 📦</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
