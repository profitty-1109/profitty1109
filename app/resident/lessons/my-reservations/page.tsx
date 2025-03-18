"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, Dumbbell } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"

interface LessonReservation {
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

export default function MyLessonReservationsPage() {
  const { toast } = useToast()
  const [reservations, setReservations] = useState<LessonReservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)

  // 로그인 시 저장된 인증 토큰 가져오기
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setAuthToken(token)
    }
  }, [])

  // 예약 정보 가져오기
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true)

        // API 요청 URL 구성
        let url = "/api/reservations"
        if (authToken) {
          url += `?token=${authToken}`
        }

        const response = await fetch(url, {
          headers: {
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
          },
          credentials: "include",
        })

        // 응답 상태 코드 확인 및 로깅
        console.log("레슨 예약 API 응답 상태:", response.status)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("레슨 예약 API 오류 응답:", errorData)

          // 401 오류인 경우 로그인 페이지로 리다이렉트
          if (response.status === 401 && errorData.requireAuth) {
            toast({
              title: "로그인 필요",
              description: "로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.",
              variant: "destructive",
            })

            // 3초 후 로그인 페이지로 리다이렉트
            setTimeout(() => {
              window.location.href = "/login?redirect=/resident/lessons/my-reservations"
            }, 3000)

            return
          }

          throw new Error(errorData.error || "예약 정보를 가져오는데 실패했습니다.")
        }

        const data = await response.json()
        console.log("가져온 레슨 예약 데이터:", data)
        setReservations(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching lesson reservations:", error)
        toast({
          title: "오류",
          description: error instanceof Error ? error.message : "예약 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        })
        // 오류 발생 시 빈 배열로 설정하여 UI가 깨지지 않도록 함
        setReservations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [toast, authToken])

  // 예약 취소 처리
  const handleCancelReservation = async (id: string) => {
    try {
      setCancelingId(id)

      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("예약 취소에 실패했습니다.")
      }

      // 취소된 예약 상태 업데이트
      setReservations((prev) => prev.map((res) => (res.id === id ? { ...res, status: "cancelled" } : res)))

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
    } finally {
      setCancelingId(null)
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "yyyy년 MM월 dd일", { locale: ko })
    } catch (error) {
      return dateString
    }
  }

  // 예약 상태에 따른 배지 렌더링
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">예약 확정</Badge>
      case "cancelled":
        return <Badge variant="destructive">취소됨</Badge>
      case "pending":
        return <Badge variant="outline">대기 중</Badge>
      default:
        return <Badge variant="outline">상태 미확인</Badge>
    }
  }

  // 현재 날짜 기준으로 예약 필터링
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingReservations = reservations.filter((res) => res.status === "confirmed" && new Date(res.date) >= today)

  const pastReservations = reservations.filter(
    (res) => (res.status === "confirmed" && new Date(res.date) < today) || res.status === "cancelled",
  )

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
            <h1 className="text-2xl font-bold">내 레슨 예약</h1>
            <Button asChild>
              <Link href="/resident/lessons">레슨 예약하기</Link>
            </Button>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">예정된 예약</TabsTrigger>
              <TabsTrigger value="past">지난 예약</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>예약 정보를 불러오는 중...</p>
                </div>
              ) : upcomingReservations.length > 0 ? (
                upcomingReservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Dumbbell className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{reservation.lessonTitle}</h3>
                              {getStatusBadge(reservation.status)}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(reservation.date)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{reservation.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end md:self-auto">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="sm" disabled={cancelingId === reservation.id}>
                                {cancelingId === reservation.id ? "취소 중..." : "예약 취소"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>예약 취소</DialogTitle>
                                <DialogDescription>
                                  정말로 이 예약을 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">레슨</span>
                                    <span className="font-medium">{reservation.lessonTitle}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">날짜</span>
                                    <span className="font-medium">{formatDate(reservation.date)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">시간</span>
                                    <span className="font-medium">{reservation.time}</span>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => {}}>
                                  취소
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleCancelReservation(reservation.id)}
                                  disabled={cancelingId === reservation.id}
                                >
                                  {cancelingId === reservation.id ? "취소 중..." : "예약 취소 확인"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <Dumbbell className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg mb-2">예정된 레슨 예약이 없습니다</h3>
                  <p className="text-muted-foreground mb-4">새로운 레슨을 예약해보세요!</p>
                  <Button asChild>
                    <Link href="/resident/lessons">레슨 예약하기</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="past" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>예약 정보를 불러오는 중...</p>
                </div>
              ) : pastReservations.length > 0 ? (
                pastReservations.map((reservation) => (
                  <Card key={reservation.id} className="opacity-80">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-muted rounded-full">
                            <Dumbbell className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{reservation.lessonTitle}</h3>
                              {getStatusBadge(reservation.status)}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(reservation.date)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{reservation.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <Dumbbell className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg mb-2">지난 레슨 예약이 없습니다</h3>
                  <p className="text-muted-foreground mb-4">새로운 레슨을 예약해보세요!</p>
                  <Button asChild>
                    <Link href="/resident/lessons">레슨 예약하기</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

