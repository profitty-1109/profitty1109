"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Droplets, Users, Wind, Activity, Thermometer, Settings, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Facility {
  id: string
  name: string
  status: "active" | "inactive" | "maintenance"
  userCapacity: number
  currentUsers: number
  temperature: number
  humidity: number
  windSpeed: number
}

const FacilityStatus = () => {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [isManageFacilityOpen, setIsManageFacilityOpen] = useState(false)
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [isManageReservationOpen, setIsManageReservationOpen] = useState(false)
  const [showFacilityReservations, setShowFacilityReservations] = useState(false)
  const [facilityReservations, setFacilityReservations] = useState([])
  const [reservationDate, setReservationDate] = useState(new Date().toISOString().split("T")[0])
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false)

  useEffect(() => {
    // 가짜 데이터 생성
    const fakeFacilities: Facility[] = [
      {
        id: "1",
        name: "헬스장",
        status: "active",
        userCapacity: 30,
        currentUsers: 15,
        temperature: 24,
        humidity: 50,
        windSpeed: 5,
      },
      {
        id: "2",
        name: "수영장",
        status: "maintenance",
        userCapacity: 20,
        currentUsers: 8,
        temperature: 28,
        humidity: 60,
        windSpeed: 2,
      },
      {
        id: "3",
        name: "스터디룸",
        status: "active",
        userCapacity: 10,
        currentUsers: 7,
        temperature: 22,
        humidity: 45,
        windSpeed: 0,
      },
      {
        id: "4",
        name: "골프연습장",
        status: "inactive",
        userCapacity: 15,
        currentUsers: 3,
        temperature: 25,
        humidity: 55,
        windSpeed: 3,
      },
    ]
    setFacilities(fakeFacilities)
  }, [])

  const handleReportIssue = (facility: Facility) => {
    setSelectedFacility(facility)
    setIsReportIssueOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">시설 현황</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {facilities.map((facility) => (
          <Card key={facility.id}>
            <CardHeader>
              <CardTitle>{facility.name}</CardTitle>
              <CardDescription>
                <Badge
                  variant={
                    facility.status === "active"
                      ? "default"
                      : facility.status === "inactive"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {facility.status === "active"
                    ? "정상 운영"
                    : facility.status === "inactive"
                      ? "운영 중단"
                      : "점검 중"}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {facility.currentUsers} / {facility.userCapacity}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4" />
                  <span>{facility.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4" />
                  <span>{facility.humidity}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4" />
                  <span>{facility.windSpeed} m/s</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Activity className="mr-2 h-4 w-4" /> 상세 보기
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFacility(facility)
                    setShowFacilityReservations(true)
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" /> 예약 현황
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFacility(facility)
                    setIsManageFacilityOpen(true)
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" /> 관리
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleReportIssue(facility)}>
                  <AlertTriangle className="mr-2 h-4 w-4" /> 문제 보고
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* 시설 관리 다이얼로그 */}
      <Dialog open={isManageFacilityOpen} onOpenChange={setIsManageFacilityOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>시설 관리</DialogTitle>
            <DialogDescription>{selectedFacility?.name} 시설을 관리합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">시설 이름</Label>
              <Input id="name" defaultValue={selectedFacility?.name} className="col-span-3" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">상태</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={selectedFacility?.status}
              >
                <option value="active">정상 운영</option>
                <option value="inactive">운영 중단</option>
                <option value="maintenance">점검 중</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="userCapacity">최대 수용 인원</Label>
              <Input
                type="number"
                id="userCapacity"
                defaultValue={selectedFacility?.userCapacity}
                className="col-span-3"
              />
            </div>
            <div className="space-y-2">
              <Label>예약 관리 설정</Label>
              <div className="space-y-2 border rounded-md p-3">
                <div className="flex items-center space-x-2">
                  <Switch id="facility-allow-reservations" defaultChecked />
                  <Label htmlFor="facility-allow-reservations">예약 허용</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="facility-reservation-approval" />
                  <Label htmlFor="facility-reservation-approval">예약 승인 필요</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="facility-auto-cancel" defaultChecked />
                  <Label htmlFor="facility-auto-cancel">미사용 시 자동 취소</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>예약 시간대 관리</Label>
              <div className="border rounded-md p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">오전 (06:00-12:00)</span>
                  <div className="flex items-center space-x-2">
                    <Switch id="morning-availability" defaultChecked />
                    <Label htmlFor="morning-availability" className="text-sm">
                      예약 가능
                    </Label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">오후 (12:00-18:00)</span>
                  <div className="flex items-center space-x-2">
                    <Switch id="afternoon-availability" defaultChecked />
                    <Label htmlFor="afternoon-availability" className="text-sm">
                      예약 가능
                    </Label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">저녁 (18:00-22:00)</span>
                  <div className="flex items-center space-x-2">
                    <Switch id="evening-availability" defaultChecked />
                    <Label htmlFor="evening-availability" className="text-sm">
                      예약 가능
                    </Label>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  시간대별 상세 설정
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsManageFacilityOpen(false)}>
              취소
            </Button>
            <Button type="submit">저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 문제 보고 다이얼로그 */}
      <Dialog open={isReportIssueOpen} onOpenChange={setIsReportIssueOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>문제 보고</DialogTitle>
            <DialogDescription>{selectedFacility?.name} 시설의 문제점을 보고합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="issue">문제 내용</Label>
              <Input id="issue" placeholder="문제를 상세히 설명해주세요." className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsReportIssueOpen(false)}>
              취소
            </Button>
            <Button type="submit">보고</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 예약 관리 다이얼로그 */}
      <Dialog open={isManageReservationOpen} onOpenChange={setIsManageReservationOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>예약 관리</DialogTitle>
            <DialogDescription>
              예약 ID: {selectedReservation?.id} - {selectedReservation?.facilityName || selectedFacility?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>예약자</Label>
                <div className="p-2 border rounded-md">{selectedReservation?.userName}</div>
              </div>
              <div className="space-y-2">
                <Label>날짜 및 시간</Label>
                <div className="p-2 border rounded-md">
                  {selectedReservation?.date || reservationDate} {selectedReservation?.timeSlot}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reservation-status">예약 상태</Label>
              <Select defaultValue={selectedReservation?.status}>
                <SelectTrigger id="reservation-status">
                  <SelectValue placeholder="예약 상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">확정</SelectItem>
                  <SelectItem value="pending">대기 중</SelectItem>
                  <SelectItem value="cancelled">취소됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reservation-note">관리자 메모</Label>
              <Textarea id="reservation-note" placeholder="예약에 대한 메모를 입력하세요" rows={3} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="reservation-checkin" />
              <Label htmlFor="reservation-checkin">체크인 완료</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="reservation-notify" />
              <Label htmlFor="reservation-notify">상태 변경 시 사용자에게 알림</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" className="mr-auto">
              예약 취소
            </Button>
            <Button variant="outline" onClick={() => setIsManageReservationOpen(false)}>
              닫기
            </Button>
            <Button onClick={() => setIsManageReservationOpen(false)}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 시설별 예약 현황 다이얼로그 */}
      <Dialog open={showFacilityReservations} onOpenChange={setShowFacilityReservations}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedFacility?.name} 예약 현황</DialogTitle>
            <DialogDescription>
              {selectedFacility?.name} 시설의 예약 현황을 확인하고 관리할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="facility-reservation-date">날짜 선택</Label>
                <Input
                  id="facility-reservation-date"
                  type="date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                />
              </div>
              <Button onClick={() => console.log("예약 조회", selectedFacility?.id, reservationDate)}>조회</Button>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>시간</TableHead>
                    <TableHead>예약 현황</TableHead>
                    <TableHead>이용률</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* 실제 구현에서는 API에서 가져온 데이터를 사용 */}
                  {[
                    { time: "06:00-07:00", capacity: 10, booked: 6, available: 4, rate: 60 },
                    { time: "07:00-08:00", capacity: 10, booked: 8, available: 2, rate: 80 },
                    { time: "08:00-09:00", capacity: 10, booked: 7, available: 3, rate: 70 },
                    { time: "09:00-10:00", capacity: 10, booked: 5, available: 5, rate: 50 },
                    { time: "10:00-11:00", capacity: 10, booked: 4, available: 6, rate: 40 },
                    { time: "11:00-12:00", capacity: 10, booked: 3, available: 7, rate: 30 },
                    { time: "12:00-13:00", capacity: 10, booked: 6, available: 4, rate: 60 },
                    { time: "13:00-14:00", capacity: 10, booked: 5, available: 5, rate: 50 },
                    { time: "14:00-15:00", capacity: 10, booked: 7, available: 3, rate: 70 },
                    { time: "15:00-16:00", capacity: 10, booked: 8, available: 2, rate: 80 },
                    { time: "16:00-17:00", capacity: 10, booked: 9, available: 1, rate: 90 },
                    { time: "17:00-18:00", capacity: 10, booked: 10, available: 0, rate: 100 },
                    { time: "18:00-19:00", capacity: 10, booked: 10, available: 0, rate: 100 },
                    { time: "19:00-20:00", capacity: 10, booked: 9, available: 1, rate: 90 },
                    { time: "20:00-21:00", capacity: 10, booked: 7, available: 3, rate: 70 },
                    { time: "21:00-22:00", capacity: 10, booked: 5, available: 5, rate: 50 },
                  ].map((slot) => (
                    <TableRow key={slot.time}>
                      <TableCell>{slot.time}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-sm mr-2">
                            {slot.booked}/{slot.capacity}명
                          </span>
                          {slot.available === 0 ? (
                            <Badge variant="destructive">만석</Badge>
                          ) : slot.rate > 80 ? (
                            <Badge variant="default">혼잡</Badge>
                          ) : slot.rate > 50 ? (
                            <Badge variant="secondary">보통</Badge>
                          ) : (
                            <Badge variant="outline">여유</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={slot.rate} className="h-2 w-[100px]" />
                          <span className="text-sm">{slot.rate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // 해당 시간대의 예약 목록 보기
                            console.log("시간대 예약 관리", selectedFacility?.id, reservationDate, slot.time)
                          }}
                        >
                          예약 관리
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Tabs defaultValue="reservations">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reservations">예약 목록</TabsTrigger>
                <TabsTrigger value="stats">통계</TabsTrigger>
              </TabsList>
              <TabsContent value="reservations">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>시간</TableHead>
                        <TableHead>예약자</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>예약일</TableHead>
                        <TableHead>관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* 실제 구현에서는 API에서 가져온 데이터를 사용 */}
                      {[
                        {
                          id: "R001",
                          facilityId: "1",
                          timeSlot: "09:00-10:00",
                          userName: "홍길동",
                          status: "confirmed",
                          createdAt: "2025-03-10",
                        },
                        {
                          id: "R002",
                          facilityId: "1",
                          timeSlot: "10:00-11:00",
                          userName: "김철수",
                          status: "confirmed",
                          createdAt: "2025-03-11",
                        },
                        {
                          id: "R003",
                          facilityId: "1",
                          timeSlot: "14:00-15:00",
                          userName: "이영희",
                          status: "pending",
                          createdAt: "2025-03-12",
                        },
                        {
                          id: "R004",
                          facilityId: "1",
                          timeSlot: "18:00-19:00",
                          userName: "박지성",
                          status: "cancelled",
                          createdAt: "2025-03-13",
                        },
                      ]
                        .filter((res) => res.facilityId === String(selectedFacility?.id))
                        .map((reservation) => (
                          <TableRow key={reservation.id}>
                            <TableCell>{reservation.timeSlot}</TableCell>
                            <TableCell>{reservation.userName}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  reservation.status === "confirmed"
                                    ? "default"
                                    : reservation.status === "pending"
                                      ? "outline"
                                      : "destructive"
                                }
                              >
                                {reservation.status === "confirmed"
                                  ? "확정"
                                  : reservation.status === "pending"
                                    ? "대기 중"
                                    : "취소됨"}
                              </Badge>
                            </TableCell>
                            <TableCell>{reservation.createdAt}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedReservation(reservation)
                                    setIsManageReservationOpen(true)
                                  }}
                                >
                                  관리
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="stats">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">시간대별 예약 현황</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">오전 (06:00-12:00)</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={60} className="h-2 w-[100px]" />
                            <span className="text-sm">60%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">오후 (12:00-18:00)</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={80} className="h-2 w-[100px]" />
                            <span className="text-sm">80%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">저녁 (18:00-22:00)</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={90} className="h-2 w-[100px]" />
                            <span className="text-sm">90%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">예약 통계</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">오늘 총 예약</span>
                          <span className="text-sm font-medium">12건</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">평균 이용 시간</span>
                          <span className="text-sm font-medium">1시간 20분</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">인기 시간대</span>
                          <span className="text-sm font-medium">18:00-20:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">취소율</span>
                          <span className="text-sm font-medium">5%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFacilityReservations(false)}>
              닫기
            </Button>
            <Button
              onClick={() => {
                setIsAddReservationOpen(true)
              }}
            >
              새 예약 추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 새 예약 추가 다이얼로그 */}
      <Dialog open={isAddReservationOpen} onOpenChange={setIsAddReservationOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>새 예약 추가</DialogTitle>
            <DialogDescription>{selectedFacility?.name} 시설에 새 예약을 추가합니다.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-reservation-date">날짜</Label>
                <Input id="new-reservation-date" type="date" value={reservationDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-reservation-time">시간</Label>
                <Select>
                  <SelectTrigger id="new-reservation-time">
                    <SelectValue placeholder="시간 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="06:00-07:00">06:00-07:00</SelectItem>
                    <SelectItem value="07:00-08:00">07:00-08:00</SelectItem>
                    <SelectItem value="08:00-09:00">08:00-09:00</SelectItem>
                    <SelectItem value="09:00-10:00">09:00-10:00</SelectItem>
                    <SelectItem value="10:00-11:00">10:00-11:00</SelectItem>
                    <SelectItem value="11:00-12:00">11:00-12:00</SelectItem>
                    <SelectItem value="12:00-13:00">12:00-13:00</SelectItem>
                    <SelectItem value="13:00-14:00">13:00-14:00</SelectItem>
                    <SelectItem value="14:00-15:00">14:00-15:00</SelectItem>
                    <SelectItem value="15:00-16:00">15:00-16:00</SelectItem>
                    <SelectItem value="16:00-17:00">16:00-17:00</SelectItem>
                    <SelectItem value="17:00-18:00">17:00-18:00</SelectItem>
                    <SelectItem value="18:00-19:00">18:00-19:00</SelectItem>
                    <SelectItem value="19:00-20:00">19:00-20:00</SelectItem>
                    <SelectItem value="20:00-21:00">20:00-21:00</SelectItem>
                    <SelectItem value="21:00-22:00">21:00-22:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-reservation-user">예약자 선택</Label>
              <Select>
                <SelectTrigger id="new-reservation-user">
                  <SelectValue placeholder="예약자 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="U001">홍길동</SelectItem>
                  <SelectItem value="U002">김철수</SelectItem>
                  <SelectItem value="U003">이영희</SelectItem>
                  <SelectItem value="U004">박지성</SelectItem>
                  <SelectItem value="U005">최민수</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-reservation-status">예약 상태</Label>
              <Select defaultValue="confirmed">
                <SelectTrigger id="new-reservation-status">
                  <SelectValue placeholder="예약 상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">확정</SelectItem>
                  <SelectItem value="pending">대기 중</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-reservation-note">관리자 메모</Label>
              <Textarea id="new-reservation-note" placeholder="예약에 대한 메모를 입력하세요" rows={3} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="new-reservation-notify" defaultChecked />
              <Label htmlFor="new-reservation-notify">사용자에게 알림 전송</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddReservationOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsAddReservationOpen(false)}>예약 추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FacilityStatus

