"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getFacilities, updateFacilityStatus, scheduleMaintenance } from "@/lib/actions/facility-actions"
import { useToast } from "@/hooks/use-toast"

interface Facility {
  id: string
  name: string
  isOperational: boolean
  maintenanceScheduled: string | null
  notes: string
}

export default function FacilityOperationsPanel() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [maintenanceNotes, setMaintenanceNotes] = useState("")
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function loadFacilities() {
      try {
        const data = await getFacilities()
        setFacilities(data)
      } catch (error) {
        toast({
          title: "Error loading facilities",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadFacilities()
  }, [toast])

  async function handleStatusToggle(id: string, isOperational: boolean) {
    try {
      await updateFacilityStatus(id, isOperational)
      setFacilities(facilities.map((facility) => (facility.id === id ? { ...facility, isOperational } : facility)))
      toast({
        title: "Facility status updated",
        description: `Facility is now ${isOperational ? "operational" : "non-operational"}`,
      })
    } catch (error) {
      toast({
        title: "Error updating facility status",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  async function handleScheduleMaintenance() {
    if (!selectedFacility || !selectedDate) return

    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd")
      await scheduleMaintenance(selectedFacility.id, formattedDate, maintenanceNotes)

      setFacilities(
        facilities.map((facility) =>
          facility.id === selectedFacility.id
            ? { ...facility, maintenanceScheduled: formattedDate, notes: maintenanceNotes }
            : facility,
        ),
      )

      toast({
        title: "Maintenance scheduled",
        description: `Maintenance scheduled for ${format(selectedDate, "PPP")}`,
      })

      setSelectedFacility(null)
      setSelectedDate(undefined)
      setMaintenanceNotes("")
    } catch (error) {
      toast({
        title: "Error scheduling maintenance",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading facilities...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {facilities.map((facility) => (
        <Card
          key={facility.id}
          className={cn("transition-colors", !facility.isOperational && "border-red-300 bg-red-50")}
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {facility.name}
              {!facility.isOperational && <AlertTriangle className="h-5 w-5 text-red-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor={`status-${facility.id}`}>Operational Status</Label>
                <Switch
                  id={`status-${facility.id}`}
                  checked={facility.isOperational}
                  onCheckedChange={(checked) => handleStatusToggle(facility.id, checked)}
                />
              </div>

              {facility.maintenanceScheduled && (
                <div className="text-sm">
                  <p className="font-medium">Maintenance Scheduled:</p>
                  <p>{facility.maintenanceScheduled}</p>
                  {facility.notes && (
                    <>
                      <p className="font-medium mt-2">Notes:</p>
                      <p>{facility.notes}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setSelectedFacility(facility)}>
                  Schedule Maintenance
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Maintenance</DialogTitle>
                  <DialogDescription>Set a date for maintenance of {facility.name}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="maintenance-date">Maintenance Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="maintenance-date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="maintenance-notes">Notes</Label>
                    <Textarea
                      id="maintenance-notes"
                      placeholder="Enter maintenance details"
                      value={maintenanceNotes}
                      onChange={(e) => setMaintenanceNotes(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={handleScheduleMaintenance}>Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

