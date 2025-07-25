"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Package, Truck, CreditCard, Clock } from "lucide-react"
import Image from "next/image"

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const orders = [
    {
      id: "ORD-2024-001",
      customer: "John Doe",
      email: "john@example.com",
      date: "2024-01-24",
      status: "delivered",
      total: 76.97,
      paymentMethod: "Bitcoin",
      shippingAddress: "123 Main St, New York, NY 10001",
      items: [
        { name: "NOVA Pro Max", quantity: 2, price: 24.99, image: "/placeholder-defpf.png" },
        { name: "Cosmic Gummies", quantity: 1, price: 15.99, image: "/placeholder-gummies.png" },
      ],
      trackingNumber: "1Z999AA1234567890",
      notes: "Customer requested discreet packaging",
    },
    {
      id: "ORD-2024-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      date: "2024-01-23",
      status: "shipped",
      total: 35.99,
      paymentMethod: "CashApp",
      shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
      items: [{ name: "Purple Haze", quantity: 1, price: 35.99, image: "/placeholder-flower1.png" }],
      trackingNumber: "1Z999AA1234567891",
      notes: "",
    },
    {
      id: "ORD-2024-003",
      customer: "Mike Johnson",
      email: "mike@example.com",
      date: "2024-01-22",
      status: "processing",
      total: 129.99,
      paymentMethod: "Ethereum",
      shippingAddress: "789 Pine St, Chicago, IL 60601",
      items: [
        { name: "Glass Bong", quantity: 1, price: 89.99, image: "/placeholder-bong.png" },
        { name: "Grinder Pro", quantity: 1, price: 24.99, image: "/placeholder-grinder.png" },
      ],
      trackingNumber: "",
      notes: "Rush order - customer needs by Friday",
    },
    {
      id: "ORD-2024-004",
      customer: "Emily Davis",
      email: "emily@example.com",
      date: "2024-01-21",
      status: "pending",
      total: 42.99,
      paymentMethod: "Bitcoin",
      shippingAddress: "321 Elm St, Miami, FL 33101",
      items: [{ name: "Zen Cookies", quantity: 2, price: 18.99, image: "/placeholder-cookies.png" }],
      trackingNumber: "",
      notes: "Payment pending confirmation",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-slate-100 text-slate-600"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <Package className="h-4 w-4 text-green-500" />
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "pending":
        return <CreditCard className="h-4 w-4 text-slate-500" />
      default:
        return <Clock className="h-4 w-4 text-slate-500" />
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Orders Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-slate-500">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</div>
            <p className="text-xs text-slate-500">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "processing").length}</div>
            <p className="text-xs text-slate-500">Being prepared</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$285.95</div>
            <p className="text-xs text-slate-500">+8% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-slate-500">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <Badge className={getStatusBadge(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell className="font-semibold">${order.total}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.id}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Customer Information</h4>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="font-medium">Name:</span> {selectedOrder.customer}
                                  </p>
                                  <p>
                                    <span className="font-medium">Email:</span> {selectedOrder.email}
                                  </p>
                                  <p>
                                    <span className="font-medium">Address:</span> {selectedOrder.shippingAddress}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Order Information</h4>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="font-medium">Date:</span> {selectedOrder.date}
                                  </p>
                                  <p>
                                    <span className="font-medium">Payment:</span> {selectedOrder.paymentMethod}
                                  </p>
                                  <p>
                                    <span className="font-medium">Tracking:</span>{" "}
                                    {selectedOrder.trackingNumber || "Not assigned"}
                                  </p>
                                  {selectedOrder.notes && (
                                    <p>
                                      <span className="font-medium">Notes:</span> {selectedOrder.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Order Items</h4>
                              <div className="space-y-3">
                                {selectedOrder.items.map((item: any, idx: number) => (
                                  <div key={idx} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                      <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                ))}
                                <div className="border-t pt-3 flex justify-between items-center font-bold">
                                  <span>Total</span>
                                  <span>${selectedOrder.total}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-end space-x-2 mt-6">
                          <Select>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button className="bg-green-600 hover:bg-green-700">Update Order</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
