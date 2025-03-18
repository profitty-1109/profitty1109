import type { Metadata } from "next"
import AdminDashboardClient from "./AdminDashboardClient"

export const metadata: Metadata = {
  title: "Admin Dashboard | Summit Center City",
  description: "Admin dashboard for Summit Center City apartment complex",
}

export default function AdminDashboard() {
  return <AdminDashboardClient />
}

