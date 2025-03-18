import { NextResponse } from "next/server"

// This is a mock API route for demonstration purposes
// In a real application, you would connect to a database

export async function GET() {
  const reservations = [
    {
      id: "1",
      facilityId: "1",
      facilityName: "Swimming Pool",
      residentName: "John Smith",
      apartmentNumber: "301",
      date: "2023-12-10",
      startTime: "14:00",
      endTime: "16:00",
      status: "confirmed",
    },
    {
      id: "2",
      facilityId: "3",
      facilityName: "Community Room",
      residentName: "Sarah Johnson",
      apartmentNumber: "205",
      date: "2023-12-12",
      startTime: "18:00",
      endTime: "21:00",
      status: "pending",
    },
    {
      id: "3",
      facilityId: "2",
      facilityName: "Gym",
      residentName: "Michael Brown",
      apartmentNumber: "412",
      date: "2023-12-11",
      startTime: "07:00",
      endTime: "08:00",
      status: "confirmed",
    },
    {
      id: "4",
      facilityId: "5",
      facilityName: "Rooftop Garden",
      residentName: "Emily Davis",
      apartmentNumber: "510",
      date: "2023-12-15",
      startTime: "17:00",
      endTime: "19:00",
      status: "cancelled",
    },
  ]

  return NextResponse.json(reservations)
}

