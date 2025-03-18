"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon, AlertTriangle, Settings, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Facility {
  id: string
  name: string
  location: string
  status: string
  capacity: number
  openTime: string
  closeTime: string
  description: string
  maintenanceSchedule: string
  lastMaintenance: string
}

interface FacilityManagementPanelProps {
  facilityId: string
  facilities: Facility[]
  setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>
}

export default function FacilityManagementPanel({
  facilityId,
  facilities,
  setFacilities,
}: FacilityManagementPanelProps) {
  const facility = facilities.find((f) => f.id === facilityId)
  const [isOperational, setIsOperational] = useState(facility?.status === "운영 중")
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [maintenanceNotes, setMaintenanceNotes] = useState("")
  const { toast } = useToast()

  if (!facility) {
    return <div>시설을 찾을 수 없습니다.</div>
  }

  // Handle operational status toggle
  const handleStatusToggle = (checked: boolean) => {
    setIsOperational(checked)

    // Update facility status
    const newStatus = checked ? "운영 중" : "운영 중단"
    const updatedFacilities = facilities.map((f) => (f.id === facilityId ? { ...f, status: newStatus } : f))
    setFacilities(updatedFacilities)

    toast({
      title: "시설 상태 업데이트",
      description: `${facility.name}의 상태가 ${newStatus}(으)로 변경되었습니다.`,
    })
  }

  // Handle maintenance scheduling
  const handleScheduleMaintenance = () => {
    if (!selectedDate) return

    // Update facility status and maintenance info
    const formattedDate = format(selectedDate, "yyyy-MM-dd")
    const updatedFacilities = facilities.map((f) =>
      f.id === facilityId
        ? {
            ...f,
            status: "점검 중",
            lastMaintenance: formattedDate,
          }
        : f,
    )
    setFacilities(updatedFacilities)

    toast({
      title: "점검 일정 등록",
      description: `${facility.name}의 점검 일정이 ${format(selectedDate, "PPP", { locale: ko })}로 등록되었습니다.`,
    })

    setIsMaintenanceDialogOpen(false)
    setSelectedDate(undefined)
    setMaintenanceNotes("")
  }

  // Handle facility edit
  const handleEditFacility = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const updatedFacility = {
      ...facility,
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      capacity: Number.parseInt(formData.get("capacity") as string),
      openTime: formData.get("openTime") as string,
      closeTime: formData.get("closeTime") as string,
      description: formData.get("description") as string,
      maintenanceSchedule: formData.get("maintenanceSchedule") as string,
    }

    const updatedFacilities = facilities.map((f) => (f.id === facilityId ? updatedFacility : f))
    setFacilities(updatedFacilities)

    toast({
      title: "시설 정보 업데이트",
      description: `${facility.name}의 정보가 업데이트되었습니다.`,
    })

    setIsEditDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{facility.name} 관리</CardTitle>
          <CardDescription>시설 운영 상태 및 점검 일정 관리</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">위치</Label>
                    <p>{facility.location}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">수용 인원</Label>
                    <p>{facility.capacity}명</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">운영 시간</Label>
                    <p>
                      {facility.openTime} - {facility.closeTime}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">점검 일정</Label>
                    <p>{facility.maintenanceSchedule}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">설명</Label>
                  <p>{facility.description}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" /> 정보 수정
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">운영 관리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="operational-status">운영 상태</Label>
                    <p className="text-sm text-muted-foreground">시설 운영 상태를 변경합니다.</p>
                  </div>
                  <Switch id="operational-status" checked={isOperational} onCheckedChange={handleStatusToggle} />
                </div>
                <div className="pt-4">
                  <Label className="text-muted-foreground">현재 상태</Label>
                  <div className="flex items-center mt-1">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${
                        facility.status === "운영 중"
                          ? "bg-green-500"
                          : facility.status === "점검 중"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <p>{facility.status}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">마지막 점검일</Label>
                  <p>{facility.lastMaintenance}</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => setIsMaintenanceDialogOpen(true)}>
                  <AlertTriangle className="h-4 w-4 mr-2" /> 점검 일정 등록
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <History className="h-4 w-4 mr-2" /> 점검 이력 보기
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 점검 일정 등록 다이얼로그 */}
      <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>점검 일정 등록</DialogTitle>
            <DialogDescription>{facility.name}의 점검 일정을 등록합니다.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="maintenance-date">점검 날짜</Label>
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
                    {selectedDate ? format(selectedDate, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus locale={ko} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maintenance-notes">점검 내용</Label>
              <Textarea
                id="maintenance-notes"
                placeholder="점검 내용을 입력하세요"
                value={maintenanceNotes}
                onChange={(e) => setMaintenanceNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMaintenanceDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleScheduleMaintenance} disabled={!selectedDate}>
              등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 시설 정보 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>시설 정보 수정</DialogTitle>
            <DialogDescription>{facility.name}의 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditFacility}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">시설명</Label>
                  <Input id="name" name="name" defaultValue={facility.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">위치</Label>
                  <Input id="location" name="location" defaultValue={facility.location} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">수용 인원</Label>
                  <Input id="capacity" name="capacity" type="number" defaultValue={facility.capacity} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenanceSchedule">점검 일정</Label>
                  <Input
                    id="maintenanceSchedule"
                    name="maintenanceSchedule"
                    defaultValue={facility.maintenanceSchedule}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openTime">개장 시간</Label>
                  <Input id="openTime" name="openTime" type="time" defaultValue={facility.openTime} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeTime">폐장 시간</Label>
                  <Input id="closeTime" name="closeTime" type="time" defaultValue={facility.closeTime} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea id="description" name="description" defaultValue={facility.description} required />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                취소
              </Button>
              <Button type="submit">저장</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

