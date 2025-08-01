import type { ReactNode } from "react"
import AdminSidebar from "@/components/admin-sidebar" // Corrected import

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
