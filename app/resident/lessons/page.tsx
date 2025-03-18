"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, Clock, Dumbbell, Users } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface Lesson {
  id: string
  title: string
  description: string
  trainerId: string
  trainerName: string
  capacity: number
  duration: number
  location: string
  schedule: { day: string; time: string }[]
}

interface Reservation {
  id: string
  lessonId: string
  lessonTitle: string
  userId: string
  userName: string
  date: string
  time: string
  status: "confirmed" | "cancelled" | "pending"
  createdAt: string
}

export default function LessonsPage() {
  const { toast } = useToast()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [myReservations, setMyReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [isReserving, setIsReserving] = useState(false)
  const [isLessonSelectDialogOpen, setIsLessonSelectDialogOpen] = useState(false)
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false)

  // 레슨 데이터 가져오기
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch("/api/lessons")
        if (!response.ok) {
          throw new Error("레슨 정보를 가져오는데 실패했습니다.")
        }
        const data = await response.json()
        setLessons(data)
      } catch (error) {
        console.error("Error fetching lessons:", error)
        toast({
          title: "오류",
          description: "레슨 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        })
      }
    }

    const fetchReservations = async () => {
      try {
        const response = await fetch("/api/reservations")
        if (!response.ok) {
          throw new Error("예약 정보를 가져오는데 실패했습니다.")
        }
        const data = await response.json()
        setMyReservations(data)
      } catch (error) {
        console.error("Error fetching reservations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLessons()
    fetchReservations()
  }, [toast])

  // 레슨 예약 처리
  const handleReservation = async () => {
    if (!selectedLesson || !selectedDate || !selectedTime) {
      toast({
        title: "오류",
        description: "레슨, 날짜, 시간을 모두 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsReserving(true)

    try {
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          lessonTitle: selectedLesson.title,
          date: selectedDate.toISOString().split("T")[0],
          time: selectedTime,
        }),
      })

      if (!response.ok) {
        throw new Error("레슨 예약에 실패했습니다.")
      }

      const newReservation = await response.json()
      setMyReservations((prev) => [...prev, newReservation])

      toast({
        title: "예약 완료",
        description: `${selectedLesson.title} 레슨이 예약되었습니다.`,
      })

      // 예약 후 선택 초기화
      setSelectedLesson(null)
      setSelectedTime("")
    } catch (error) {
      console.error("Error making reservation:", error)
      toast({
        title: "예약 실패",
        description: error instanceof Error ? error.message : "레슨 예약 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsReserving(false)
    }
  }

  // 예약 취소 처리
  const handleCancelReservation = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("예약 취소에 실패했습니다.")
      }

      // 취소된 예약 상태 업데이트
      setMyReservations((prev) => prev.map((res) => (res.id === reservationId ? { ...res, status: "cancelled" } : res)))

      toast({
        title: "예약 취소 완료",
        description: "레슨 예약이 취소되었습니다.",
      })
    } catch (error) {
      console.error("Error cancelling reservation:", error)
      toast({
        title: "예약 취소 실패",
        description: error instanceof Error ? error.message : "예약 취소 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 요일 변환 함수 (영어 -> 한글)
  const getDayInKorean = (date: Date): string => {
    const days = ["일", "월", "화", "수", "목", "금", "토"]
    return days[date.getDay()]
  }

  // 선택한 날짜의 요일에 해당하는 시간 옵션 가져오기
  const getTimeOptionsForSelectedDay = (): string[] => {
    if (!selectedLesson || !selectedDate) return []

    const dayOfWeek = getDayInKorean(selectedDate)
    return selectedLesson.schedule.filter((s) => s.day === dayOfWeek).map((s) => s.time)
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
            <h1 className="text-2xl font-bold">레슨 예약</h1>
            <Button asChild>
              <Link href="/resident/lessons/my-reservations">내 예약 보기</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>레슨 정보를 불러오는 중...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lessons.map((lesson) => (
                  <Card key={lesson.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{lesson.title}</CardTitle>
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <CardDescription>{lesson.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>트레이너: {lesson.trainerName}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>시간: {lesson.duration}분</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {lesson.schedule.map((s, idx) => (
                              <Badge key={idx} variant="outline">
                                {s.day} {s.time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" onClick={() => setSelectedLesson(lesson)}>
                            예약하기
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>{lesson.title} 예약</DialogTitle>
                            <DialogDescription>원하시는 날짜와 시간을 선택하여 레슨을 예약하세요.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">날짜 선택</h4>
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                              />
                            </div>
                            {selectedDate && (
                              <div className="space-y-2">
                                <h4 className="font-medium">시간 선택</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {getTimeOptionsForSelectedDay().length > 0 ? (
                                    getTimeOptionsForSelectedDay().map((time) => (
                                      <Button
                                        key={time}
                                        variant={selectedTime === time ? "default" : "outline"}
                                        onClick={() => setSelectedTime(time)}
                                        className="h-auto py-2"
                                      >
                                        {time}
                                      </Button>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground col-span-2">
                                      선택한 날짜에 이용 가능한 시간이 없습니다.
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handleReservation}
                              disabled={!selectedDate || !selectedTime || isReserving}
                            >
                              {isReserving ? "예약 중..." : "예약 확정"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>레슨 예약 캘린더</CardTitle>
                  <CardDescription>날짜를 클릭하여 해당 일자에 레슨을 예약하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date)
                          if (date) {
                            // 날짜 클릭 시 레슨 선택 다이얼로그 표시
                            setIsLessonSelectDialogOpen(true)
                          }
                        }}
                        className="rounded-md border"
                        disabled={{ before: new Date() }}
                      />
                    </div>
                    <div className="md:w-1/2">
                      <h3 className="font-semibold mb-4">
                        {selectedDate ? format(selectedDate, "yyyy년 MM월 dd일", { locale: ko }) : "날짜를 선택하세요"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        날짜를 선택하면 해당 날짜에 예약 가능한 레슨 목록이 표시됩니다.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 레슨 선택 다이얼로그 */}
              <Dialog open={isLessonSelectDialogOpen} onOpenChange={setIsLessonSelectDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>레슨 예약</DialogTitle>
                    <DialogDescription>
                      {selectedDate && format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}에 예약할 레슨을
                      선택하세요
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                      {lessons.map((lesson) => {
                        // 선택한 날짜의 요일 가져오기
                        const dayOfWeek = selectedDate ? getDayInKorean(selectedDate) : ""
                        // 해당 요일에 가능한 레슨인지 확인
                        const isAvailableOnDay = lesson.schedule.some((s) => s.day === dayOfWeek)

                        return (
                          <div key={lesson.id} className="flex items-center justify-between border p-3 rounded-md">
                            <div>
                              <h4 className="font-medium">{lesson.title}</h4>
                              <p className="text-sm text-muted-foreground">{lesson.description}</p>
                            </div>
                            {isAvailableOnDay ? (
                              <Button
                                onClick={() => {
                                  setSelectedLesson(lesson)
                                  setIsLessonSelectDialogOpen(false)

                                  // 해당 요일의 시간 옵션 가져오기
                                  const timeOptions = lesson.schedule
                                    .filter((s) => s.day === dayOfWeek)
                                    .map((s) => s.time)

                                  if (timeOptions.length > 0) {
                                    setSelectedTime(timeOptions[0])
                                  }

                                  setIsReservationDialogOpen(true)
                                }}
                              >
                                선택
                              </Button>
                            ) : (
                              <Button variant="outline" disabled>
                                불가능
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsLessonSelectDialogOpen(false)}>
                      닫기
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Card>
                <CardHeader>
                  <CardTitle>내 예약 현황</CardTitle>
                  <CardDescription>예약된 레슨 목록</CardDescription>
                </CardHeader>
                <CardContent>
                  {myReservations.length > 0 ? (
                    <div className="space-y-4">
                      {myReservations
                        .filter((res) => res.status === "confirmed")
                        .map((reservation) => (
                          <div
                            key={reservation.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center space-x-4">
                              <Dumbbell className="h-6 w-6 text-primary" />
                              <div>
                                <p className="font-medium">{reservation.lessonTitle}</p>
                                <p className="text-sm text-muted-foreground">
                                  {reservation.date} | {reservation.time}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleCancelReservation(reservation.id)}>
                              취소
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">예약된 레슨이 없습니다.</p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

