"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import { getFacilityReservations, updateReservationStatus } from "@/lib/actions/facility-actions"
import { useToast } from "@/hooks/use-toast"

interface Reservation {
  id: string
  facilityName: string
  residentName: string
  apartmentNumber: string
  date: string
  startTime: string
  endTime: string
  status: "confirmed" | "pending" | "cancelled"
}

interface FacilityReservationTableProps {
  onSelectFacility: (facilityId: string) => void
}

export default function FacilityReservationTable({ onSelectFacility }: FacilityReservationTableProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadReservations() {
      try {
        const data = await getFacilityReservations()
        setReservations(data)
      } catch (error) {
        toast({
          title: "Error loading reservations",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadReservations()
  }, [toast])

  async function handleStatusUpdate(id: string, status: "confirmed" | "pending" | "cancelled") {
    try {
      await updateReservationStatus(id, status)
      setReservations(reservations.map((res) => (res.id === id ? { ...res, status } : res)))
      toast({
        title: "Reservation updated",
        description: `Reservation status changed to ${status}`,
      })
    } catch (error) {
      toast({
        title: "Error updating reservation",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading reservations...</div>
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of all facility reservations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Facility</TableHead>
            <TableHead>Resident</TableHead>
            <TableHead>Apartment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No reservations found
              </TableCell>
            </TableRow>
          ) : (
            reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.facilityName}</TableCell>
                <TableCell>{reservation.residentName}</TableCell>
                <TableCell>{reservation.apartmentNumber}</TableCell>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>{`${reservation.startTime} - ${reservation.endTime}`}</TableCell>
                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleStatusUpdate(reservation.id, "confirmed")}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Confirm
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(reservation.id, "cancelled")}>
                        <XCircle className="mr-2 h-4 w-4" /> Cancel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectFacility(reservation.facilityName)}>
                        View Facility Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

