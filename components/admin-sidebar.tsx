"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ShoppingCart, Users, BarChart } from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Overview", icon: Home },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-slate-200">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="text-2xl">🐼</div>
          <span className="text-xl font-bold tracking-tight text-gray-800">Green Panda Admin</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium transition-colors",
                    isActive ? "bg-green-100 text-green-700" : "text-slate-600 hover:bg-slate-100",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
