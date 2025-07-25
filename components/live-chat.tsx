"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  text: string
  sender: "customer" | "admin" | "bot"
  timestamp: Date
  adminName?: string
  customerId?: string
}

interface LiveChatProps {
  isAdmin?: boolean
  customerId?: string
  onNewMessage?: (message: Message) => void
}

// Simulated global chat store (in real app, this would be WebSocket/database)
const globalChatStore = {
  messages: new Map<string, Message[]>(),
  listeners: new Set<(customerId: string, message: Message) => void>(),

  addMessage: (customerId: string, message: Message) => {
    if (!globalChatStore.messages.has(customerId)) {
      globalChatStore.messages.set(customerId, [])
    }
    globalChatStore.messages.get(customerId)!.push(message)

    // Notify all listeners
    globalChatStore.listeners.forEach((listener) => {
      listener(customerId, message)
    })
  },

  getMessages: (customerId: string) => {
    return globalChatStore.messages.get(customerId) || []
  },

  subscribe: (listener: (customerId: string, message: Message) => void) => {
    globalChatStore.listeners.add(listener)
    return () => globalChatStore.listeners.delete(listener)
  },
}

export function LiveChat({ isAdmin = false, customerId = "customer-1", onNewMessage }: LiveChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Subscribe to global chat updates
  useEffect(() => {
    // Load existing messages
    setMessages(globalChatStore.getMessages(customerId))

    // Subscribe to new messages
    const unsubscribe = globalChatStore.subscribe((msgCustomerId, message) => {
      if (msgCustomerId === customerId) {
        setMessages((prev) => [...prev, message])
        if (onNewMessage) {
          onNewMessage(message)
        }
      }
    })

    return unsubscribe
  }, [customerId, onNewMessage])

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome-" + Date.now(),
        text: isAdmin
          ? "Admin panel ready. Respond to customer inquiries here."
          : "Hi there! 🐼 Welcome to Green Panda support. How can I help you find your zen today?",
        sender: "bot",
        timestamp: new Date(),
        customerId,
      }

      globalChatStore.addMessage(customerId, welcomeMessage)
    }
  }, [isOpen, messages.length, isAdmin, customerId])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: isAdmin ? "admin" : "customer",
      timestamp: new Date(),
      adminName: isAdmin ? "Panda Support" : undefined,
      customerId,
    }

    globalChatStore.addMessage(customerId, message)
    setNewMessage("")

    // Auto-response for customer messages (simulate admin response)
    if (!isAdmin) {
      setTimeout(
        () => {
          const responses = [
            "Thanks for reaching out! Let me help you with that. 🌿",
            "I understand your question. Our team will get back to you shortly.",
            "Great question! Let me look into that for you right away.",
            "Thanks for your patience! Our Panda team is here to help. 🐼",
          ]

          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: responses[Math.floor(Math.random() * responses.length)],
            sender: "admin",
            timestamp: new Date(),
            adminName: "Panda Support",
            customerId,
          }

          globalChatStore.addMessage(customerId, botResponse)
        },
        1000 + Math.random() * 2000,
      )
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Customer chat widget
  if (!isAdmin) {
    if (!isOpen) {
      return (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            <MessageCircle className="h-5 w-5 mr-1" />
            Chat 🐼
          </Button>
        </div>
      )
    }

    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 h-96 border-green-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-lg">🐼</div>
                <div>
                  <CardTitle className="text-sm">Panda Support</CardTitle>
                  <div className="flex items-center space-x-1 text-xs text-green-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-300"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-green-600 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="h-64 overflow-y-auto p-3 bg-green-50">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.sender === "customer"
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-800 border border-green-200"
                    }`}
                  >
                    {message.sender !== "customer" && (
                      <div className="flex items-center space-x-1 mb-1">
                        {message.sender === "admin" ? (
                          <User className="h-3 w-3 text-green-600" />
                        ) : (
                          <Bot className="h-3 w-3 text-green-600" />
                        )}
                        <span className="text-xs font-medium text-green-600">{message.adminName || "Panda Bot"}</span>
                      </div>
                    )}
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === "customer" ? "text-green-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <div className="p-3 border-t border-green-200 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask us anything..."
                className="flex-1 border-green-200 focus:border-green-400 text-sm"
                size="sm"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-green-600 hover:bg-green-700 text-white p-2"
                size="sm"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Admin compact chat interface
  return (
    <Card className="h-80 border-green-200">
      <CardHeader className="bg-green-50 p-3 border-b border-green-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-green-800 flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Customer Chat
          </CardTitle>
          <Badge className="bg-green-100 text-green-800 text-xs">
            {messages.filter((m) => m.sender === "customer").length} messages
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="h-48 overflow-y-auto p-3 bg-green-50">
        <div className="space-y-2">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] p-2 rounded-lg text-xs ${
                  message.sender === "admin"
                    ? "bg-green-600 text-white"
                    : message.sender === "customer"
                      ? "bg-white text-gray-800 border border-green-200"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {message.sender === "customer" && (
                  <div className="flex items-center space-x-1 mb-1">
                    <User className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">Customer</span>
                  </div>
                )}
                <p>{message.text}</p>
                <p className={`text-xs mt-1 opacity-70`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <div className="p-3 border-t border-green-200 bg-white">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Reply to customer..."
            className="flex-1 border-green-200 focus:border-green-400 text-sm"
            size="sm"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-green-600 hover:bg-green-700 text-white px-3"
            size="sm"
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
