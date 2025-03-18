"use server"

// This is a mock implementation. In a real application, you would connect to a database.
// For now, we'll use in-memory data for demonstration purposes.

let facilities = [
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

let reservations = [
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

export async function getFacilities() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return facilities
}

export async function getFacilityReservations() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return reservations
}

export async function updateFacilityStatus(id: string, isOperational: boolean) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  facilities = facilities.map((facility) => (facility.id === id ? { ...facility, isOperational } : facility))

  return { success: true }
}

export async function scheduleMaintenance(id: string, date: string, notes: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  facilities = facilities.map((facility) =>
    facility.id === id ? { ...facility, maintenanceScheduled: date, notes } : facility,
  )

  return { success: true }
}

export async function updateReservationStatus(id: string, status: "confirmed" | "pending" | "cancelled") {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  reservations = reservations.map((reservation) => (reservation.id === id ? { ...reservation, status } : reservation))

  return { success: true }
}

export async function createReservation(data: {
  facilityId: string
  residentName: string
  apartmentNumber: string
  date: string
  startTime: string
  endTime: string
}) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const facility = facilities.find((f) => f.id === data.facilityId)

  if (!facility) {
    throw new Error("Facility not found")
  }

  const newReservation = {
    id: (reservations.length + 1).toString(),
    facilityId: data.facilityId,
    facilityName: facility.name,
    residentName: data.residentName,
    apartmentNumber: data.apartmentNumber,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    status: "pending" as const,
  }

  reservations.push(newReservation)

  return { success: true, reservation: newReservation }
}

