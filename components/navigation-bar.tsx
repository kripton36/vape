"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, ShoppingCart, Heart, User, Menu, Bell, Settings, LogOut, Package, Star, Gift, Zap } from "lucide-react"
import { useStore } from "@/lib/store-context"

export function NavigationBar() {
  const { user, cart = [], wishlist = [], cartCount, wishlistCount, setUser } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [notifications] = useState(3) // Mock notifications
  const router = useRouter()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/store?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    setUser(null)
    router.push("/")
  }

  const handleLogin = () => {
    router.push("/login")
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Store", href: "/store" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-green-200" : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl group-hover:animate-bounce">🐼</div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Panda Cannabis
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full" role="search">
              <label htmlFor="search-input" className="sr-only">
                Search products
              </label>
              <Input
                id="search-input"
                type="text"
                placeholder="Search zen products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-green-200 focus:border-green-400 focus:ring-green-400"
                aria-label="Search products"
                autoComplete="off"
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
                aria-hidden="true"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                aria-label={`Notifications${notifications > 0 ? ` (${notifications} unread)` : ''}`}
                aria-describedby={notifications > 0 ? "notification-count" : undefined}
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                {notifications > 0 && (
                  <Badge 
                    id="notification-count"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
                    aria-label={`${notifications} unread notifications`}
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            )}

            {/* Wishlist */}
            <Link href="/wishlist" aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ''}`}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative group"
                aria-label={`View wishlist${wishlistCount > 0 ? ` - ${wishlistCount} items` : ' - empty'}`}
              >
                <Heart className="h-5 w-5 group-hover:text-red-500 transition-colors" aria-hidden="true" />
                {wishlistCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
                    aria-label={`${wishlistCount} items in wishlist`}
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart" aria-label={`Shopping cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative group"
                aria-label={`View shopping cart${cartCount > 0 ? ` - ${cartCount} items` : ' - empty'}`}
              >
                <ShoppingCart className="h-5 w-5 group-hover:text-green-600 transition-colors" aria-hidden="true" />
                {cartCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-600 text-white text-xs"
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-2"
                    aria-label={`User menu for ${user.name}`}
                    aria-haspopup="menu"
                    aria-expanded={false}
                  >
                    <div 
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-semibold"
                      aria-hidden="true"
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">{user.points} points</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/rewards" className="flex items-center">
                      <Gift className="mr-2 h-4 w-4" />
                      Rewards
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center text-green-600">
                          <Zap className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin} className="bg-green-600 hover:bg-green-700 text-white">
                Sign In
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Search zen products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-green-200 focus:border-green-400"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium py-2 px-3 rounded-lg hover:bg-green-50"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile User Actions */}
                  {!user && (
                    <Button onClick={handleLogin} className="bg-green-600 hover:bg-green-700 text-white">
                      Sign In
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
