"use client"

import { useState } from "react"
import { LiveChat } from "@/components/live-chat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Clock, CheckCircle, Users, Zap } from "lucide-react"

interface ChatSession {
  id: string
  customerId: string
  customerName: string
  status: "active" | "waiting" | "resolved"
  lastMessage: string
  timestamp: string
  priority: "high" | "normal"
  unreadCount: number
}

export default function AdminSupportPage() {
  const [selectedChat, setSelectedChat] = useState<string>("customer-1")
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "chat-1",
      customerId: "customer-1",
      customerName: "Sarah Chen",
      status: "active",
      lastMessage: "Hi, I have a question about the Bamboo Bliss Gummies",
      timestamp: "2 min ago",
      priority: "normal",
      unreadCount: 2,
    },
    {
      id: "chat-2",
      customerId: "customer-2",
      customerName: "Mike Rodriguez",
      status: "waiting",
      lastMessage: "My order hasn't arrived yet, can you help?",
      timestamp: "5 min ago",
      priority: "high",
      unreadCount: 1,
    },
    {
      id: "chat-3",
      customerId: "customer-3",
      customerName: "Emma Johnson",
      status: "resolved",
      lastMessage: "Thank you so much for your help!",
      timestamp: "15 min ago",
      priority: "normal",
      unreadCount: 0,
    },
  ])

  const [supportStats] = useState({
    activeChats: 2,
    waitingChats: 1,
    resolvedToday: 23,
    avgResponseTime: "2.3 min",
    customerSatisfaction: 98,
  })

  const handleNewMessage = (message: any) => {
    // Update chat session with new message info
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.customerId === message.customerId
          ? {
              ...chat,
              lastMessage: message.text,
              timestamp: "now",
              unreadCount: message.sender === "customer" ? chat.unreadCount + 1 : 0,
            }
          : chat,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "normal":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              🐼 Support Center
            </h1>
            <p className="text-green-600 mt-1">Manage customer conversations</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 font-medium">Online</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-green-700">Active</CardTitle>
              <MessageCircle className="h-3 w-3 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-800">{supportStats.activeChats}</div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-green-700">Waiting</CardTitle>
              <Clock className="h-3 w-3 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-yellow-600">{supportStats.waitingChats}</div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-green-700">Resolved</CardTitle>
              <CheckCircle className="h-3 w-3 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-blue-600">{supportStats.resolvedToday}</div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-green-700">Response</CardTitle>
              <Zap className="h-3 w-3 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-800">{supportStats.avgResponseTime}</div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-green-700">Satisfaction</CardTitle>
              <Users className="h-3 w-3 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-800">{supportStats.customerSatisfaction}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-800 flex items-center gap-2 text-lg">
                  <MessageCircle className="h-4 w-4" />
                  Active Chats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {chatSessions.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.customerId)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedChat === chat.customerId
                        ? "bg-green-100 border-green-300"
                        : "bg-green-50 border-green-100 hover:bg-green-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-green-800 text-sm">{chat.customerName}</span>
                      <div className="flex items-center space-x-1">
                        {chat.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">{chat.unreadCount}</Badge>
                        )}
                        <Badge className={`${getPriorityColor(chat.priority)} text-xs`}>{chat.priority}</Badge>
                        <Badge className={`${getStatusColor(chat.status)} text-xs`}>{chat.status}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 mb-1 truncate">{chat.lastMessage}</p>
                    <span className="text-xs text-green-500">{chat.timestamp}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Live Chat Interface */}
          <div className="lg:col-span-2">
            <LiveChat isAdmin={true} customerId={selectedChat} onNewMessage={handleNewMessage} />
          </div>
        </div>
      </div>
    </div>
  )
}
