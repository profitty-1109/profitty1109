"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import FacilityReservationTable from "./facility-reservation-table"
import FacilityOperationsPanel from "./facility-operations-panel"
import AddReservationForm from "./add-reservation-form"

export default function FacilityStatusDashboard() {
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null)

  return (
    <Tabs defaultValue="reservations" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="reservations">Reservations</TabsTrigger>
        <TabsTrigger value="operations">Facility Operations</TabsTrigger>
        <TabsTrigger value="add">Add Reservation</TabsTrigger>
      </TabsList>

      <TabsContent value="reservations">
        <Card>
          <CardHeader>
            <CardTitle>Facility Reservations</CardTitle>
            <CardDescription>View and manage all facility reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <FacilityReservationTable onSelectFacility={setSelectedFacility} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="operations">
        <Card>
          <CardHeader>
            <CardTitle>Facility Operations</CardTitle>
            <CardDescription>Manage facility maintenance and operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <FacilityOperationsPanel />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="add">
        <Card>
          <CardHeader>
            <CardTitle>Add New Reservation</CardTitle>
            <CardDescription>Create a new facility reservation</CardDescription>
          </CardHeader>
          <CardContent>
            <AddReservationForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

