"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, MessageSquare, Users, UserCheck, UserX, Mail, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      joinDate: "2024-01-15",
      totalOrders: 12,
      totalSpent: 847.32,
      status: "verified",
      kycStatus: "approved",
      lastOrder: "2024-01-24",
      avatar: "/placeholder-avatar.png",
      address: "123 Main St, New York, NY 10001",
      notes: "VIP customer, prefers Bitcoin payments",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(555) 234-5678",
      joinDate: "2024-01-10",
      totalOrders: 8,
      totalSpent: 523.45,
      status: "active",
      kycStatus: "pending",
      lastOrder: "2024-01-23",
      avatar: "/placeholder-avatar.png",
      address: "456 Oak Ave, Los Angeles, CA 90210",
      notes: "Frequent edibles customer",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "(555) 345-6789",
      joinDate: "2024-01-05",
      totalOrders: 15,
      totalSpent: 1234.67,
      status: "verified",
      kycStatus: "approved",
      lastOrder: "2024-01-22",
      avatar: "/placeholder-avatar.png",
      address: "789 Pine St, Chicago, IL 60601",
      notes: "Bulk buyer, wholesale pricing applied",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "(555) 456-7890",
      joinDate: "2024-01-20",
      totalOrders: 3,
      totalSpent: 156.78,
      status: "active",
      kycStatus: "rejected",
      lastOrder: "2024-01-21",
      avatar: "/placeholder-avatar.png",
      address: "321 Elm St, Miami, FL 33101",
      notes: "KYC documents need resubmission",
    },
  ]

  const supportTickets = [
    {
      id: "TKT-001",
      customer: "John Doe",
      subject: "Order delivery delay",
      status: "open",
      priority: "high",
      date: "2024-01-24",
      message: "My order ORD-2024-001 was supposed to arrive yesterday but I haven't received it yet.",
    },
    {
      id: "TKT-002",
      customer: "Jane Smith",
      subject: "Product quality concern",
      status: "resolved",
      priority: "medium",
      date: "2024-01-23",
      message: "The gummies I received seem to have a different texture than usual.",
    },
    {
      id: "TKT-003",
      customer: "Mike Johnson",
      subject: "Bulk pricing inquiry",
      status: "pending",
      priority: "low",
      date: "2024-01-22",
      message: "I'm interested in purchasing larger quantities. Do you offer wholesale pricing?",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getKYCBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Customer Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-slate-500">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter((c) => c.status === "verified").length}</div>
            <p className="text-xs text-slate-500">KYC approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
            <UserX className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter((c) => c.kycStatus === "pending").length}</div>
            <p className="text-xs text-slate-500">Need review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportTickets.filter((t) => t.status === "open").length}</div>
            <p className="text-xs text-slate-500">Open tickets</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{customer.name}</div>
                          <div className="text-xs text-slate-500">{customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(customer.status)}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getKYCBadge(customer.kycStatus)}>{customer.kycStatus}</Badge>
                    </TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedCustomer(customer)}>
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Customer Details</DialogTitle>
                          </DialogHeader>
                          {selectedCustomer && (
                            <div className="space-y-6">
                              <div className="flex items-center space-x-4">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage src={selectedCustomer.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {selectedCustomer.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                                  <p className="text-slate-600">{selectedCustomer.email}</p>
                                  <div className="flex space-x-2 mt-2">
                                    <Badge className={getStatusBadge(selectedCustomer.status)}>
                                      {selectedCustomer.status}
                                    </Badge>
                                    <Badge className={getKYCBadge(selectedCustomer.kycStatus)}>
                                      KYC: {selectedCustomer.kycStatus}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Contact Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4 text-slate-400" />
                                      <span>{selectedCustomer.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-4 w-4 text-slate-400" />
                                      <span>{selectedCustomer.phone}</span>
                                    </div>
                                    <p>
                                      <span className="font-medium">Address:</span> {selectedCustomer.address}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Account Statistics</h4>
                                  <div className="space-y-2 text-sm">
                                    <p>
                                      <span className="font-medium">Join Date:</span> {selectedCustomer.joinDate}
                                    </p>
                                    <p>
                                      <span className="font-medium">Total Orders:</span> {selectedCustomer.totalOrders}
                                    </p>
                                    <p>
                                      <span className="font-medium">Total Spent:</span> ${selectedCustomer.totalSpent}
                                    </p>
                                    <p>
                                      <span className="font-medium">Last Order:</span> {selectedCustomer.lastOrder}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Notes</h4>
                                <Textarea
                                  defaultValue={selectedCustomer.notes}
                                  placeholder="Add customer notes..."
                                  className="min-h-20"
                                />
                              </div>

                              <div className="flex justify-end space-x-2">
                                <Button variant="outline">Send Email</Button>
                                <Button className="bg-green-600 hover:bg-green-700">Update Customer</Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">{ticket.id}</span>
                      <Badge className={getPriorityBadge(ticket.priority)}>{ticket.priority}</Badge>
                      <Badge className={getTicketStatusBadge(ticket.status)}>{ticket.status}</Badge>
                    </div>
                    <span className="text-sm text-slate-500">{ticket.date}</span>
                  </div>
                  <h4 className="font-semibold mb-1">{ticket.subject}</h4>
                  <p className="text-sm text-slate-600 mb-2">From: {ticket.customer}</p>
                  <p className="text-sm text-slate-700">{ticket.message}</p>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline">
                      Reply
                    </Button>
                    <Button size="sm" variant="outline">
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
