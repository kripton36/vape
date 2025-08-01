"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[380px] gap-6">
          <div className="grid gap-2 text-center">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
              <div className="text-4xl">🐼</div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                GREEN PANDA
              </h1>
            </Link>
            <p className="text-balance text-gray-600">
              Welcome to the garden! Sign in or create an account to find your zen.
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-green-100/80">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-full"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-full"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="panda@bamboo.com" required className="rounded-full" />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline text-green-600">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required className="rounded-full" />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
                <Button variant="outline" className="w-full bg-transparent rounded-full border-gray-300">
                  Sign in with Google
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="panda@bamboo.com"
                    required
                    className="rounded-full"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" required className="rounded-full" />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
                <div className="text-center text-xs text-gray-500">
                  By creating an account, you agree to our{" "}
                  <Link href="#" className="underline text-green-600">
                    Terms of Service
                  </Link>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="hidden bg-green-100 lg:flex items-center justify-center p-8">
        <Image
          src="/placeholder-panda-login.png"
          alt="Panda Login"
          width="1920"
          height="1080"
          className="h-full w-full object-cover rounded-2xl"
        />
      </div>
    </div>
  )
}
