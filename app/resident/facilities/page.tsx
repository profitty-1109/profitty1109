"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Building, Clock, Info, Users, CalendarIcon, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Facility {
  id: number
  name: string
  description: string
  image: string
  hours: string
  location: string
  status: "open" | "maintenance" | "closed"
  capacity: number
  currentUsers: number
}

interface TimeSlot {
  timeSlot: string
  available: boolean
  bookedCount: number
  remainingSlots: number
}

interface Reservation {
  id: string
  facilityId: string
  facilityName: string
  date: string
  timeSlot: string
  status: string
}

export default function FacilitiesPage() {
  // 상태 변수 추가
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false)
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const { toast } = useToast()

  // 시설 목록 가져오기
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/facilities")
        if (!response.ok) {
          throw new Error("시설 정보를 가져오는데 실패했습니다.")
        }
        const data = await response.json()
        setFacilities(data)
      } catch (error) {
        console.error("Error fetching facilities:", error)
        toast({
          title: "오류",
          description: "시설 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFacilities()
  }, [toast])

  // 예약 현황 가져오기
  useEffect(() => {
    const fetchReservations = async () => {
      if (!selectedDate) return

      try {
        const dateString = format(selectedDate, "yyyy-MM-dd")
        const response = await fetch(`/api/facilities/reservations/date?date=${dateString}`)
        if (!response.ok) {
          throw new Error("예약 현황을 가져오는데 실패했습니다.")
        }
        const data = await response.json()
        setReservations(data)
      } catch (error) {
        console.error("Error fetching reservations:", error)
        toast({
          title: "오류",
          description: "예약 현황을 가져오는데 실패했습니다.",
          variant: "destructive",
        })
      }
    }

    fetchReservations()
  }, [selectedDate, toast])

  // 시설 선택 시 이용 가능 시간대 가져오기
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedFacility || !selectedDate) return

      try {
        const dateString = format(selectedDate, "yyyy-MM-dd")
        const response = await fetch(`/api/facilities/timeslots?facilityId=${selectedFacility.id}&date=${dateString}`)
        if (!response.ok) {
          throw new Error("이용 가능 시간을 가져오는데 실패했습니다.")
        }
        const data = await response.json()
        setTimeSlots(data)
        setSelectedTimeSlot(null) // 시설이 변경되면 선택된 시간대 초기화
      } catch (error) {
        console.error("Error fetching time slots:", error)
        toast({
          title: "오류",
          description: "이용 가능 시간을 가져오는데 실패했습니다.",
          variant: "destructive",
        })
        setTimeSlots([])
      }
    }

    fetchTimeSlots()
  }, [selectedFacility, selectedDate, toast])

  // 예약 처리
  const handleReservation = async () => {
    if (!selectedFacility || !selectedTimeSlot || !selectedDate) {
      toast({
        title: "오류",
        description: "시설과 시간을 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/facilities/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          facilityId: selectedFacility.id.toString(),
          facilityName: selectedFacility.name,
          date: format(selectedDate, "yyyy-MM-dd"),
          timeSlot: selectedTimeSlot,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "예약에 실패했습니다.")
      }

      toast({
        title: "예약 완료",
        description: `${selectedFacility.name} 예약이 완료되었습니다.`,
      })

      // 다이얼로그 닫기 및 상태 초기화
      setIsReservationDialogOpen(false)
      setSelectedFacility(null)
      setSelectedTimeSlot(null)

      // 예약 현황 다시 가져오기
      const dateString = format(selectedDate, "yyyy-MM-dd")
      const reservationsResponse = await fetch(`/api/facilities/reservations/date?date=${dateString}`)
      if (reservationsResponse.ok) {
        const data = await reservationsResponse.json()
        setReservations(data)
      }
    } catch (error) {
      console.error("Error making reservation:", error)
      toast({
        title: "예약 실패",
        description: error instanceof Error ? error.message : "예약 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 시설별 예약 현황 계산
  const getFacilityReservations = (facilityId: number) => {
    return reservations.filter(
      (reservation) => reservation.facilityId === facilityId.toString() && reservation.status !== "cancelled",
    )
  }

  // 시설별 예약 가능 여부 확인
  const isFacilityAvailable = (facility: Facility) => {
    return facility.status === "open"
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex flex-col w-64 border-r px-4 py-6">
        <MainNav userRole="resident" />
      </div>
      <div className="flex-1">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 md:px-6">
            <div className="md:hidden mr-4">
              {/* 모바일 메뉴 버튼 */}
              <Button variant="ghost" size="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <UserNav userName="홍길동" userEmail="hong@example.com" userRole="resident" />
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">시설 예약</h1>
            <Button asChild>
              <Link href="/resident/facilities/my-reservations">내 예약 보기</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {facilities.map((facility) => (
              <Card key={facility.id} className={facility.status === "maintenance" ? "opacity-70" : ""}>
                <CardHeader className="p-0">
                  <div className="relative">
                    <Image
                      src={facility.image || "/placeholder.svg"}
                      alt={facility.name}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      {facility.status === "open" ? (
                        <Badge className="bg-green-500">이용 가능</Badge>
                      ) : (
                        <Badge variant="destructive">점검 중</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl mb-2">{facility.name}</CardTitle>
                  <CardDescription className="mb-4">{facility.description}</CardDescription>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{facility.hours}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{facility.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        현재 {facility.currentUsers}/{facility.capacity}명 이용 중
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/resident/facilities/${facility.id}`}>
                        <Info className="h-4 w-4 mr-2" />
                        상세 정보
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      disabled={facility.status !== "open"}
                      onClick={() => {
                        setSelectedFacility(facility)
                        setIsReservationDialogOpen(true)
                      }}
                    >
                      예약하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>시설 예약 현황</CardTitle>
              <CardDescription>날짜를 선택하여 시설 예약 현황을 확인하고 예약하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="calendar">
                <TabsList>
                  <TabsTrigger value="calendar">캘린더</TabsTrigger>
                  <TabsTrigger value="list">목록</TabsTrigger>
                </TabsList>
                <TabsContent value="calendar" className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date)
                        }}
                        className="rounded-md border"
                        locale={ko}
                        disabled={{ before: new Date() }}
                      />
                      <div className="mt-4">
                        <Button
                          className="w-full"
                          onClick={() => {
                            if (!selectedDate) {
                              toast({
                                title: "날짜 선택 필요",
                                description: "예약할 날짜를 선택해주세요.",
                                variant: "destructive",
                              })
                              return
                            }
                            setIsReservationDialogOpen(true)
                          }}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          선택한 날짜에 예약하기
                        </Button>
                      </div>
                    </div>
                    <div className="md:w-1/2">
                      <h3 className="font-semibold mb-4">
                        {selectedDate ? format(selectedDate, "yyyy년 MM월 dd일", { locale: ko }) : "날짜를 선택하세요"}{" "}
                        예약 현황
                      </h3>

                      {facilities.length > 0 ? (
                        <div className="space-y-4">
                          {facilities.map((facility) => {
                            const facilityReservations = getFacilityReservations(facility.id)
                            return (
                              <Card key={facility.id}>
                                <CardHeader className="py-2">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">{facility.name}</CardTitle>
                                    {facility.status === "open" ? (
                                      <Badge className="bg-green-500">이용 가능</Badge>
                                    ) : (
                                      <Badge variant="destructive">점검 중</Badge>
                                    )}
                                  </div>
                                </CardHeader>
                                <CardContent className="py-2">
                                  {facilityReservations.length > 0 ? (
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">예약된 시간:</p>
                                      <div className="grid grid-cols-3 gap-2">
                                        {facilityReservations.map((reservation) => (
                                          <Badge key={reservation.id} variant="outline" className="justify-center">
                                            {reservation.timeSlot}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">예약된 시간이 없습니다.</p>
                                  )}
                                  <div className="mt-3 flex justify-end">
                                    <Button
                                      size="sm"
                                      disabled={!isFacilityAvailable(facility)}
                                      onClick={() => {
                                        setSelectedFacility(facility)
                                        setIsReservationDialogOpen(true)
                                      }}
                                    >
                                      예약하기
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-40 border rounded-md">
                          <p className="text-muted-foreground">시설 정보를 불러오는 중...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="list">
                  <div className="space-y-4">
                    {facilities
                      .filter((facility) => facility.status === "open")
                      .map((facility) => (
                        <Card key={facility.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>{facility.name}</CardTitle>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedFacility(facility)
                                  setIsReservationDialogOpen(true)
                                }}
                              >
                                예약하기
                              </Button>
                            </div>
                            <CardDescription>{facility.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{facility.hours}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{facility.location}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>
                                  현재 {facility.currentUsers}/{facility.capacity}명 이용 중
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 예약 다이얼로그 */}
          <Dialog open={isReservationDialogOpen} onOpenChange={setIsReservationDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>시설 예약</DialogTitle>
                <DialogDescription>
                  {selectedDate && format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}에 예약할 시설과 시간을
                  선택하세요
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-4">
                  {!selectedFacility ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">시설 선택</label>
                      <Select
                        onValueChange={(value) => {
                          const facility = facilities.find((f) => f.id.toString() === value)
                          setSelectedFacility(facility || null)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="시설을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilities
                            .filter((facility) => facility.status === "open")
                            .map((facility) => (
                              <SelectItem key={facility.id} value={facility.id.toString()}>
                                {facility.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between border p-3 rounded-md">
                        <div>
                          <h4 className="font-medium">{selectedFacility.name}</h4>
                          <p className="text-sm text-muted-foreground">{selectedFacility.location}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedFacility(null)}>
                          변경
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">시간 선택</label>
                        {timeSlots.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {timeSlots.map((slot) => (
                              <Button
                                key={slot.timeSlot}
                                variant={selectedTimeSlot === slot.timeSlot ? "default" : "outline"}
                                className="justify-start h-auto py-3"
                                disabled={!slot.available}
                                onClick={() => setSelectedTimeSlot(slot.timeSlot)}
                              >
                                <div className="flex flex-col items-start">
                                  <span>{slot.timeSlot}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {slot.available ? `잔여: ${slot.remainingSlots}명` : "예약 마감"}
                                  </span>
                                </div>
                                {selectedTimeSlot === slot.timeSlot && <Check className="ml-auto h-4 w-4" />}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-20 border rounded-md">
                            <p className="text-muted-foreground">이용 가능한 시간이 없습니다.</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReservationDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleReservation} disabled={!selectedFacility || !selectedTimeSlot || isSubmitting}>
                  {isSubmitting ? "예약 처리 중..." : "예약 확정"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}

