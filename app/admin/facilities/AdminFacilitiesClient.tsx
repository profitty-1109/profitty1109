"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, AlertTriangle, Plus, Pencil, Trash2 } from "lucide-react"

export default function AdminFacilitiesClient() {
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false)
  const [isEditFacilityOpen, setIsEditFacilityOpen] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState(null)

  // 실제 구현에서는 서버에서 데이터를 가져옴
  const facilities = [
    {
      id: 1,
      name: "헬스장",
      location: "커뮤니티 센터 1층",
      status: "운영 중",
      capacity: 30,
      openTime: "06:00",
      closeTime: "22:00",
      description: "최신 운동 기구를 갖춘 헬스장입니다.",
      maintenanceSchedule: "매월 첫째 주 월요일",
      lastMaintenance: "2025-03-01",
    },
    {
      id: 2,
      name: "수영장",
      location: "커뮤니티 센터 지하 1층",
      status: "운영 중",
      capacity: 20,
      openTime: "06:00",
      closeTime: "21:00",
      description: "25m 길이의 실내 수영장입니다.",
      maintenanceSchedule: "매월 둘째 주 월요일",
      lastMaintenance: "2025-03-08",
    },
    {
      id: 3,
      name: "골프연습장",
      location: "커뮤니티 센터 옥상",
      status: "점검 중",
      capacity: 10,
      openTime: "08:00",
      closeTime: "22:00",
      description: "10타석 규모의 실내 골프연습장입니다.",
      maintenanceSchedule: "매월 셋째 주 월요일",
      lastMaintenance: "2025-03-15",
    },
    {
      id: 4,
      name: "탁구장",
      location: "커뮤니티 센터 2층",
      status: "운영 중",
      capacity: 8,
      openTime: "09:00",
      closeTime: "21:00",
      description: "4개의 탁구대를 갖춘 탁구장입니다.",
      maintenanceSchedule: "매월 넷째 주 월요일",
      lastMaintenance: "2025-02-22",
    },
  ]

  const maintenanceRecords = [
    {
      id: 1,
      facilityId: 1,
      date: "2025-03-01",
      type: "정기 점검",
      description: "기구 점검 및 청소",
      performedBy: "김기술",
    },
    {
      id: 2,
      facilityId: 2,
      date: "2025-03-08",
      type: "정기 점검",
      description: "수질 검사 및 필터 교체",
      performedBy: "박수리",
    },
    {
      id: 3,
      facilityId: 3,
      date: "2025-03-15",
      type: "긴급 수리",
      description: "타석 매트 교체",
      performedBy: "이정비",
    },
    {
      id: 4,
      facilityId: 4,
      date: "2025-02-22",
      type: "정기 점검",
      description: "탁구대 및 네트 점검",
      performedBy: "김기술",
    },
  ]

  const handleEditFacility = (facility) => {
    setSelectedFacility(facility)
    setIsEditFacilityOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex flex-col w-64 border-r px-4 py-6">
        <MainNav userRole="admin" />
      </div>
      <div className="flex-1">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 md:px-6">
            <div className="md:hidden mr-4">
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
              <UserNav userName="관리자" userEmail="admin@example.com" userRole="admin" />
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">시설 관리</h1>
            <Button onClick={() => setIsAddFacilityOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> 시설 추가
            </Button>
          </div>

          <Tabs defaultValue="facilities">
            <TabsList>
              <TabsTrigger value="facilities">시설 목록</TabsTrigger>
              <TabsTrigger value="maintenance">점검 기록</TabsTrigger>
              <TabsTrigger value="settings">설정</TabsTrigger>
            </TabsList>
            <TabsContent value="facilities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>시설 목록</CardTitle>
                  <CardDescription>아파트 내 모든 시설 목록입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>시설명</TableHead>
                        <TableHead>위치</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>수용 인원</TableHead>
                        <TableHead>운영 시간</TableHead>
                        <TableHead>관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {facilities.map((facility) => (
                        <TableRow key={facility.id}>
                          <TableCell className="font-medium">{facility.name}</TableCell>
                          <TableCell>{facility.location}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div
                                className={`h-2 w-2 rounded-full mr-2 ${
                                  facility.status === "운영 중"
                                    ? "bg-green-500"
                                    : facility.status === "점검 중"
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                }`}
                              ></div>
                              {facility.status}
                            </div>
                          </TableCell>
                          <TableCell>{facility.capacity}명</TableCell>
                          <TableCell>
                            {facility.openTime} - {facility.closeTime}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditFacility(facility)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {facilities.map((facility) => (
                  <Card key={facility.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{facility.name}</CardTitle>
                        <div
                          className={`px-2 py-1 text-xs rounded-full ${
                            facility.status === "운영 중"
                              ? "bg-green-100 text-green-800"
                              : facility.status === "점검 중"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {facility.status}
                        </div>
                      </div>
                      <CardDescription>{facility.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">운영 시간:</span>
                          <span>
                            {facility.openTime} - {facility.closeTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">수용 인원:</span>
                          <span>{facility.capacity}명</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">점검 일정:</span>
                          <span>{facility.maintenanceSchedule}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">마지막 점검일:</span>
                          <span>{facility.lastMaintenance}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Clock className="mr-2 h-4 w-4" /> 운영 시간 변경
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <AlertTriangle className="mr-2 h-4 w-4" /> 점검 예약
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle>점검 기록</CardTitle>
                  <CardDescription>시설 점검 및 유지보수 기록입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>시설명</TableHead>
                        <TableHead>점검일</TableHead>
                        <TableHead>점검 유형</TableHead>
                        <TableHead>점검 내용</TableHead>
                        <TableHead>담당자</TableHead>
                        <TableHead>관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {maintenanceRecords.map((record) => {
                        const facility = facilities.find((f) => f.id === record.facilityId)
                        return (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{facility?.name}</TableCell>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.type}</TableCell>
                            <TableCell>{record.description}</TableCell>
                            <TableCell>{record.performedBy}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  <div className="mt-4">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> 점검 기록 추가
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>시설 관리 설정</CardTitle>
                  <CardDescription>시설 관리에 대한 전반적인 설정입니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">알림 설정</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">점검 예정 알림</p>
                        <p className="text-sm text-muted-foreground">점검 일정 3일 전에 알림을 보냅니다.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">시설 상태 변경 알림</p>
                        <p className="text-sm text-muted-foreground">시설 상태가 변경되면 알림을 보냅니다.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">수용 인원 초과 알림</p>
                        <p className="text-sm text-muted-foreground">시설 수용 인원이 90% 이상이면 알림을 보냅니다.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">예약 설정</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="max-reservation">최대 예약 가능 일수</Label>
                        <Select defaultValue="7">
                          <SelectTrigger id="max-reservation">
                            <SelectValue placeholder="선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3일</SelectItem>
                            <SelectItem value="5">5일</SelectItem>
                            <SelectItem value="7">7일</SelectItem>
                            <SelectItem value="14">14일</SelectItem>
                            <SelectItem value="30">30일</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reservation-limit">1인당 최대 예약 횟수 (주간)</Label>
                        <Select defaultValue="3">
                          <SelectTrigger id="reservation-limit">
                            <SelectValue placeholder="선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1회</SelectItem>
                            <SelectItem value="2">2회</SelectItem>
                            <SelectItem value="3">3회</SelectItem>
                            <SelectItem value="5">5회</SelectItem>
                            <SelectItem value="7">7회</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">점검 설정</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-interval">정기 점검 주기</Label>
                        <Select defaultValue="monthly">
                          <SelectTrigger id="maintenance-interval">
                            <SelectValue placeholder="선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">주간</SelectItem>
                            <SelectItem value="biweekly">격주</SelectItem>
                            <SelectItem value="monthly">월간</SelectItem>
                            <SelectItem value="quarterly">분기</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-day">정기 점검 요일</Label>
                        <Select defaultValue="monday">
                          <SelectTrigger id="maintenance-day">
                            <SelectValue placeholder="선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday">월요일</SelectItem>
                            <SelectItem value="tuesday">화요일</SelectItem>
                            <SelectItem value="wednesday">수요일</SelectItem>
                            <SelectItem value="thursday">목요일</SelectItem>
                            <SelectItem value="friday">금요일</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* 시설 추가 다이얼로그 */}
      <Dialog open={isAddFacilityOpen} onOpenChange={setIsAddFacilityOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>시설 추가</DialogTitle>
            <DialogDescription>새로운 시설 정보를 입력하세요. 모든 필드는 필수입니다.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">시설명</Label>
                <Input id="name" placeholder="시설명을 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">위치</Label>
                <Input id="location" placeholder="위치를 입력하세요" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">수용 인원</Label>
                <Input id="capacity" type="number" placeholder="수용 인원을 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">상태</Label>
                <Select defaultValue="운영 중">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="상태를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="운영 중">운영 중</SelectItem>
                    <SelectItem value="점검 중">점검 중</SelectItem>
                    <SelectItem value="운영 중단">운영 중단</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openTime">개장 시간</Label>
                <Input id="openTime" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closeTime">폐장 시간</Label>
                <Input id="closeTime" type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea id="description" placeholder="시설에 대한 설명을 입력하세요" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceSchedule">점검 일정</Label>
              <Input id="maintenanceSchedule" placeholder="예: 매월 첫째 주 월요일" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFacilityOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsAddFacilityOpen(false)}>추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 시설 수정 다이얼로그 */}
      <Dialog open={isEditFacilityOpen} onOpenChange={setIsEditFacilityOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>시설 수정</DialogTitle>
            <DialogDescription>시설 정보를 수정하세요. 모든 필드는 필수입니다.</DialogDescription>
          </DialogHeader>
          {selectedFacility && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">시설명</Label>
                  <Input id="edit-name" defaultValue={selectedFacility.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">위치</Label>
                  <Input id="edit-location" defaultValue={selectedFacility.location} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">수용 인원</Label>
                  <Input id="edit-capacity" type="number" defaultValue={selectedFacility.capacity} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">상태</Label>
                  <Select defaultValue={selectedFacility.status}>
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="상태를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="운영 중">운영 중</SelectItem>
                      <SelectItem value="점검 중">점검 중</SelectItem>
                      <SelectItem value="운영 중단">운영 중단</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-openTime">개장 시간</Label>
                  <Input id="edit-openTime" type="time" defaultValue={selectedFacility.openTime} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-closeTime">폐장 시간</Label>
                  <Input id="edit-closeTime" type="time" defaultValue={selectedFacility.closeTime} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">설명</Label>
                <Textarea id="edit-description" defaultValue={selectedFacility.description} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maintenanceSchedule">점검 일정</Label>
                <Input id="edit-maintenanceSchedule" defaultValue={selectedFacility.maintenanceSchedule} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditFacilityOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsEditFacilityOpen(false)}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

