"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  Leaf,
  Star,
  TrendingUp,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview & metrics",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Charts & insights",
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
    description: "Manage inventory",
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    description: "Order management",
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
    description: "Customer data",
  },
  {
    title: "Support",
    href: "/admin/support",
    icon: MessageSquare,
    description: "Live chat & tickets",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "System configuration",
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white/80 backdrop-blur-md border-r border-green-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-green-800">Zen Admin</h2>
            <p className="text-xs text-green-600">Panda Control Center</p>
          </div>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-green-100 text-green-800 shadow-sm border border-green-200"
                    : "text-green-700 hover:bg-green-50 hover:text-green-800",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-green-600" : "text-green-500 group-hover:text-green-600",
                  )}
                />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-green-600 opacity-75">{item.description}</div>
                </div>
                {isActive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
              </Link>
            )
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-800 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Quick Stats
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-green-600">Today's Orders</span>
              <span className="font-medium text-green-800">23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Revenue</span>
              <span className="font-medium text-green-800">$1,234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Happy Pandas</span>
              <span className="font-medium text-green-800">156</span>
            </div>
          </div>
        </div>

        {/* Zen Quote */}
        <div className="mt-6 p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg border border-green-200">
          <div className="text-center">
            <Star className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-green-700 italic">
              "In the zen garden of business, every customer is a precious bamboo shoot." 🐼
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
