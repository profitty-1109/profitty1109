import { NextResponse } from "next/server"

// This is a mock API route for demonstration purposes
// In a real application, you would connect to a database

export async function GET() {
  const facilities = [
    {
      id: "1",
      name: "Swimming Pool",
      isOperational: true,
      maintenanceScheduled: null,
      notes: "",
    },
    {
      id: "2",
      name: "Gym",
      isOperational: true,
      maintenanceScheduled: null,
      notes: "",
    },
    {
      id: "3",
      name: "Community Room",
      isOperational: true,
      maintenanceScheduled: null,
      notes: "",
    },
    {
      id: "4",
      name: "Tennis Court",
      isOperational: false,
      maintenanceScheduled: "2023-12-15",
      notes: "Annual maintenance and resurfacing",
    },
    {
      id: "5",
      name: "Rooftop Garden",
      isOperational: true,
      maintenanceScheduled: null,
      notes: "",
    },
  ]

  return NextResponse.json(facilities)
}

