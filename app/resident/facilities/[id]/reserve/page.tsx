"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Check, Clock, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface Facility {
  id: string
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

export default function FacilityReservePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [facility, setFacility] = useState<Facility | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(null)

  // 로그인 시 저장된 인증 토큰 가져오기
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setAuthToken(token)
    }
  }, [])

  // 시설 정보 가져오기
  useEffect(() => {
    const fetchFacilityDetails = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/facilities/${params.id}`)
        if (!response.ok) {
          throw new Error("시설 정보를 가져오는데 실패했습니다.")
        }
        const data = await response.json()
        setFacility(data)

        // URL에서 날짜 파라미터 가져오기
        const searchParams = new URLSearchParams(window.location.search)
        const dateParam = searchParams.get("date")

        if (dateParam) {
          try {
            const parsedDate = new Date(dateParam)
            if (!isNaN(parsedDate.getTime())) {
              setSelectedDate(parsedDate)
            }
          } catch (e) {
            console.error("날짜 파싱 오류:", e)
          }
        }
      } catch (error) {
        console.error("Error fetching facility details:", error)
        toast({
          title: "오류",
          description: "시설 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFacilityDetails()
  }, [params.id, toast])

  // 선택한 날짜에 대한 이용 가능 시간대 가져오기
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!facility) return

      try {
        const dateString = format(selectedDate, "yyyy-MM-dd")

        // API 요청 URL 구성
        let url = `/api/facilities/timeslots?facilityId=${facility.id}&date=${dateString}`
        if (authToken) {
          url += `&token=${authToken}`
        }

        const response = await fetch(url, {
          headers: {
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
          },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("이용 가능 시간을 가져오는데 실패했습니다.")
        }

        const data = await response.json()
        setTimeSlots(data)
        setSelectedTimeSlot(null) // 날짜가 변경되면 선택된 시간대 초기화
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
  }, [facility, selectedDate, toast, authToken])

  // 예약 처리
  const handleReservation = async () => {
    if (!facility || !selectedTimeSlot) {
      toast({
        title: "오류",
        description: "시설과 시간을 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // API 요청 URL 구성
      let url = `/api/facilities/reservations`
      if (authToken) {
        url += `?token=${authToken}`
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
        body: JSON.stringify({
          facilityId: facility.id,
          facilityName: facility.name,
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
        description: `${facility.name} 예약이 완료되었습니다.`,
      })

      // 내 예약 페이지로 이동
      router.push("/resident/facilities/my-reservations")
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:flex flex-col w-64 border-r px-4 py-6">
          <MainNav userRole="resident" />
        </div>
        <div className="flex-1 p-8 flex justify-center items-center">
          <p>시설 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!facility) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:flex flex-col w-64 border-r px-4 py-6">
          <MainNav userRole="resident" />
        </div>
        <div className="flex-1 p-8 flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-4">시설을 찾을 수 없습니다</h2>
          <Button asChild>
            <Link href="/resident/facilities">시설 목록으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    )
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
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
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
                  className="h-4 w-4"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </Button>
              <h1 className="text-2xl font-bold">{facility.name} 예약</h1>
              <Badge className="bg-green-500">이용 가능</Badge>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>시설 정보</CardTitle>
                  <CardDescription>예약하려는 시설 정보</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={facility.image || "/placeholder.svg"}
                        alt={facility.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{facility.name}</h3>
                      <p className="text-sm text-muted-foreground">{facility.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{facility.hours}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        현재 {facility.currentUsers}/{facility.capacity}명 이용 중
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>날짜 및 시간 선택</CardTitle>
                  <CardDescription>예약하실 날짜와 시간을 선택하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">날짜 선택</h3>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        locale={ko}
                        className="border rounded-md"
                        disabled={(date) => {
                          // 오늘 이전 날짜 비활성화
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today
                        }}
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        선택한 날짜: {format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">시간 선택</h3>
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
                        <div className="flex items-center justify-center h-40 border rounded-md">
                          <p className="text-muted-foreground">이용 가능한 시간이 없습니다.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>예약 정보</CardTitle>
                  <CardDescription>선택한 예약 정보를 확인하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">시설</span>
                      <span className="font-medium">{facility.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">날짜</span>
                      <span className="font-medium">{format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">시간</span>
                      <span className="font-medium">{selectedTimeSlot || "선택 필요"}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full" disabled={!selectedTimeSlot || isSubmitting} onClick={handleReservation}>
                      {isSubmitting ? "예약 처리 중..." : "예약 확정하기"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      예약 확정 후 취소는 마이페이지에서 가능합니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

