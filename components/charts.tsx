"use client"

import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const salesData = [
  { month: "Jan", revenue: 12500, orders: 145, customers: 89 },
  { month: "Feb", revenue: 15200, orders: 178, customers: 112 },
  { month: "Mar", revenue: 18900, orders: 203, customers: 134 },
  { month: "Apr", revenue: 22100, orders: 234, customers: 156 },
  { month: "May", revenue: 19800, orders: 198, customers: 143 },
  { month: "Jun", revenue: 25600, orders: 267, customers: 178 },
]

const productData = [
  { name: "Zen Gummies", sales: 234, revenue: 5847 },
  { name: "Bamboo Bliss", sales: 189, revenue: 3021 },
  { name: "Panda Cookies", sales: 156, revenue: 5614 },
  { name: "Peaceful Pipe", sales: 89, revenue: 8009 },
  { name: "Harmony Herbs", sales: 145, revenue: 3618 },
]

// LineChart component for the admin dashboard
export function LineChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={salesData}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #10b981",
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.1)",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
            labelStyle={{ color: "#065f46" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#revenueGradient)"
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#ffffff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// BarChart component for the admin dashboard
export function BarChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={productData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #10b981",
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.1)",
            }}
            formatter={(value: number, name: string) => [
              name === "sales" ? `${value} units` : `$${value.toLocaleString()}`,
              name === "sales" ? "Sales" : "Revenue",
            ]}
            labelStyle={{ color: "#065f46" }}
          />
          <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} name="sales" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Additional chart components for analytics page
export function RevenueChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={salesData}>
          <defs>
            <linearGradient id="revenueGradient2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#revenueGradient2)"
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#ffffff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ProductChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={productData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number, name: string) => [
              name === "sales" ? `${value} units` : `$${value.toLocaleString()}`,
              name === "sales" ? "Sales" : "Revenue",
            ]}
          />
          <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} name="sales" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

const categoryData = [
  { name: "Edibles", value: 42, color: "#10b981" },
  { name: "Flowers", value: 27, color: "#34d399" },
  { name: "Accessories", value: 21, color: "#6ee7b7" },
  { name: "Concentrates", value: 10, color: "#a7f3d0" },
]

export function CategoryChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number) => [`${value}%`, "Share"]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: "#374151" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

const dailyData = [
  { day: "Mon", revenue: 3200, orders: 24 },
  { day: "Tue", revenue: 4100, orders: 31 },
  { day: "Wed", revenue: 3800, orders: 28 },
  { day: "Thu", revenue: 5200, orders: 42 },
  { day: "Fri", revenue: 6800, orders: 56 },
  { day: "Sat", revenue: 8900, orders: 73 },
  { day: "Sun", revenue: 7200, orders: 61 },
]

export function DailyRevenueChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={dailyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number, name: string) => [
              name === "revenue" ? `$${value.toLocaleString()}` : `${value} orders`,
              name === "revenue" ? "Revenue" : "Orders",
            ]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#ffffff" }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#34d399"
            strokeWidth={2}
            dot={{ fill: "#34d399", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: "#34d399", strokeWidth: 2, fill: "#ffffff" }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
