"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CheckCircle, XCircle, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

interface Reservation {
  id: string
  facilityId: string
  residentName: string
  apartmentNumber: string
  date: string
  startTime: string
  endTime: string
  status: "confirmed" | "pending" | "cancelled"
}

// Mock data for reservations
const mockReservations: Reservation[] = [
  {
    id: "1",
    facilityId: "1",
    residentName: "김철수",
    apartmentNumber: "101동 1201호",
    date: "2025-03-18",
    startTime: "10:00",
    endTime: "12:00",
    status: "confirmed",
  },
  {
    id: "2",
    facilityId: "1",
    residentName: "이영희",
    apartmentNumber: "102동 302호",
    date: "2025-03-18",
    startTime: "14:00",
    endTime: "16:00",
    status: "pending",
  },
  {
    id: "3",
    facilityId: "1",
    residentName: "박지민",
    apartmentNumber: "103동 1503호",
    date: "2025-03-19",
    startTime: "09:00",
    endTime: "10:00",
    status: "confirmed",
  },
  {
    id: "4",
    facilityId: "2",
    residentName: "최민수",
    apartmentNumber: "101동 502호",
    date: "2025-03-18",
    startTime: "16:00",
    endTime: "18:00",
    status: "confirmed",
  },
  {
    id: "5",
    facilityId: "3",
    residentName: "정수진",
    apartmentNumber: "104동 1801호",
    date: "2025-03-20",
    startTime: "18:00",
    endTime: "20:00",
    status: "cancelled",
  },
]

interface FacilityReservationStatusProps {
  facilityId: string
}

export default function FacilityReservationStatus({ facilityId }: FacilityReservationStatusProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Filter reservations by facility and date
  useEffect(() => {
    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      const filteredReservations = mockReservations.filter(
        (res) =>
          res.facilityId === facilityId && (selectedDate ? res.date === format(selectedDate, "yyyy-MM-dd") : true),
      )
      setReservations(filteredReservations)
      setIsLoading(false)
    }, 500)
  }, [facilityId, selectedDate])

  // Handle reservation status update
  const handleStatusUpdate = (id: string, status: "confirmed" | "pending" | "cancelled") => {
    // In a real app, this would be an API call
    setReservations(reservations.map((res) => (res.id === id ? { ...res, status } : res)))

    toast({
      title: "예약 상태 업데이트",
      description: `예약 상태가 ${
        status === "confirmed" ? "확정" : status === "pending" ? "대기" : "취소"
      }(으)로 변경되었습니다.`,
    })
  }

  // Get facility name
  const getFacilityName = () => {
    const facilityNames = {
      "1": "헬스장",
      "2": "수영장",
      "3": "골프연습장",
      "4": "탁구장",
    }
    return facilityNames[facilityId as keyof typeof facilityNames] || "시설"
  }

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">확정</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">대기</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">취소</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{getFacilityName()} 예약 현황</CardTitle>
          <CardDescription>
            {selectedDate && `${format(selectedDate, "PPP", { locale: ko })} 예약 현황입니다.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">날짜 선택</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    locale={ko}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="md:w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">예약 목록</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-4">로딩 중...</div>
                  ) : reservations.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground">
                      <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
                      <p>선택한 날짜에 예약이 없습니다.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>입주민</TableHead>
                          <TableHead>호수</TableHead>
                          <TableHead>시간</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead>관리</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservations.map((reservation) => (
                          <TableRow key={reservation.id}>
                            <TableCell className="font-medium">{reservation.residentName}</TableCell>
                            <TableCell>{reservation.apartmentNumber}</TableCell>
                            <TableCell>{`${reservation.startTime} - ${reservation.endTime}`}</TableCell>
                            <TableCell>{renderStatusBadge(reservation.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {reservation.status !== "confirmed" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8"
                                    onClick={() => handleStatusUpdate(reservation.id, "confirmed")}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" /> 확정
                                  </Button>
                                )}
                                {reservation.status !== "cancelled" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8"
                                    onClick={() => handleStatusUpdate(reservation.id, "cancelled")}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" /> 취소
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

