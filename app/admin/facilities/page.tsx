import type { Metadata } from "next"
import AdminFacilitiesClient from "./AdminFacilitiesClient"

export const metadata: Metadata = {
  title: "Facility Status | Admin Dashboard",
  description: "Manage facility reservations and operations",
}

export default function AdminFacilities() {
  return <AdminFacilitiesClient />
}

