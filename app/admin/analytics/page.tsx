"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RevenueChart, ProductChart, CategoryChart, DailyRevenueChart } from "@/components/charts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Leaf,
  Star,
} from "lucide-react"

export default function AnalyticsPage() {
  const kpiData = [
    {
      title: "Total Revenue",
      value: "$156,789",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "Monthly revenue growth",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Active Pandas",
      value: "3,247",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      description: "Monthly active customers",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Zen Orders",
      value: "1,892",
      change: "+15.3%",
      trend: "up",
      icon: ShoppingCart,
      description: "Orders this month",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Conversion Rate",
      value: "4.8%",
      change: "-0.3%",
      trend: "down",
      icon: Activity,
      description: "Visitor to customer rate",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ]

  const topCategories = [
    { name: "Zen Edibles 🍪", revenue: "$45,230", orders: 892, growth: 18 },
    { name: "Bamboo Flowers 🌸", revenue: "$38,120", orders: 567, growth: 12 },
    { name: "Panda Accessories 🎋", revenue: "$29,890", orders: 445, growth: 8 },
    { name: "Harmony Concentrates 🌿", revenue: "$22,340", orders: 234, growth: 25 },
  ]

  const recentActivity = [
    { action: "New order placed", customer: "Zen Master Liu", amount: "$89.99", time: "2 min ago", type: "order" },
    {
      action: "Product review added",
      customer: "Peaceful Panda",
      product: "Bamboo Bliss Gummies",
      time: "5 min ago",
      type: "review",
    },
    { action: "Customer registered", customer: "Nature Lover", time: "12 min ago", type: "signup" },
    { action: "Payment processed", customer: "Green Goddess", amount: "$156.50", time: "18 min ago", type: "payment" },
    {
      action: "Inventory updated",
      product: "Zen Garden Cookies",
      quantity: "+50",
      time: "25 min ago",
      type: "inventory",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4 text-green-600" />
      case "review":
        return <Star className="h-4 w-4 text-yellow-600" />
      case "signup":
        return <Users className="h-4 w-4 text-blue-600" />
      case "payment":
        return <DollarSign className="h-4 w-4 text-purple-600" />
      case "inventory":
        return <Package className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              📊 Zen Analytics Dashboard
            </h1>
            <p className="text-green-600 mt-2">Deep insights into your panda empire's performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Calendar className="h-3 w-3 mr-1" />
              Last 30 days
            </Badge>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Live data</span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card
              key={index}
              className={`${kpi.borderColor} ${kpi.bgColor} bg-opacity-50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{kpi.title}</CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800 mb-1">{kpi.value}</div>
                <div className="flex items-center text-xs">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                  )}
                  <span className={kpi.trend === "up" ? "text-green-600" : "text-red-600"}>{kpi.change}</span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{kpi.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue Trends
              </CardTitle>
              <CardDescription className="text-green-600">
                Monthly revenue flowing like a peaceful bamboo stream 🎋
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>

          {/* Product Performance */}
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
              <ProductChart />
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Category Distribution
              </CardTitle>
              <CardDescription className="text-green-600">
                Balanced harmony across all product categories 🌿
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryChart />
            </CardContent>
          </Card>

          {/* Daily Revenue */}
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Daily Performance
              </CardTitle>
              <CardDescription className="text-green-600">Weekly rhythm of your zen business flow 📈</CardDescription>
            </CardHeader>
            <CardContent>
              <DailyRevenueChart />
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Categories */}
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Top Categories
              </CardTitle>
              <CardDescription className="text-green-600">
                Most successful product categories this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-sm font-bold text-green-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-green-800">{category.name}</p>
                        <p className="text-sm text-green-600">{category.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-700">{category.revenue}</p>
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />+{category.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-green-600">Latest happenings in your zen garden</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-800">{activity.action}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-green-600">
                          {activity.customer}
                          {activity.product && ` • ${activity.product}`}
                          {activity.amount && ` • ${activity.amount}`}
                          {activity.quantity && ` • ${activity.quantity}`}
                        </p>
                        <span className="text-xs text-green-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Zen Performance Metrics
            </CardTitle>
            <CardDescription className="text-green-600">
              Overall harmony levels across your panda empire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Customer Satisfaction</span>
                  <span className="text-sm text-green-600">96%</span>
                </div>
                <Progress value={96} className="h-3" />
                <p className="text-xs text-green-500">Pandas are very happy 🐼</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Order Fulfillment</span>
                  <span className="text-sm text-green-600">94%</span>
                </div>
                <Progress value={94} className="h-3" />
                <p className="text-xs text-green-500">Peaceful delivery flow 📦</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Inventory Health</span>
                  <span className="text-sm text-green-600">88%</span>
                </div>
                <Progress value={88} className="h-3" />
                <p className="text-xs text-green-500">Stock levels balanced 🌿</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Revenue Growth</span>
                  <span className="text-sm text-green-600">92%</span>
                </div>
                <Progress value={92} className="h-3" />
                <p className="text-xs text-green-500">Growing like bamboo 🎋</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
