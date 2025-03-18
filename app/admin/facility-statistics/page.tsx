"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Clock, Users, Building, Download, CalendarIcon } from "lucide-react"

export default function AdminFacilityStatistics() {
  const [date, setDate] = useState(new Date())
  const [period, setPeriod] = useState("weekly")

  // 실제 구현에서는 서버에서 데이터를 가져옴
  const facilities = [
    {
      id: 1,
      name: "헬스장",
      totalVisits: 1250,
      averageDailyVisits: 42,
      peakHours: "18:00-20:00",
      leastBusyHours: "13:00-15:00",
      popularDays: "월, 수, 금",
      averageStayTime: 75,
      userSatisfaction: 4.2,
    },
    {
      id: 2,
      name: "수영장",
      totalVisits: 980,
      averageDailyVisits: 33,
      peakHours: "06:00-08:00",
      leastBusyHours: "14:00-16:00",
      popularDays: "화, 목, 토",
      averageStayTime: 60,
      userSatisfaction: 4.5,
    },
    {
      id: 3,
      name: "골프연습장",
      totalVisits: 450,
      averageDailyVisits: 15,
      peakHours: "19:00-21:00",
      leastBusyHours: "09:00-11:00",
      popularDays: "화, 목, 일",
      averageStayTime: 90,
      userSatisfaction: 4.0,
    },
    {
      id: 4,
      name: "탁구장",
      totalVisits: 620,
      averageDailyVisits: 21,
      peakHours: "18:00-20:00",
      leastBusyHours: "10:00-12:00",
      popularDays: "월, 수, 금",
      averageStayTime: 45,
      userSatisfaction: 4.3,
    },
  ]

  const hourlyData = [
    { hour: "06:00", 헬스장: 15, 수영장: 25, 골프연습장: 0, 탁구장: 0 },
    { hour: "08:00", 헬스장: 20, 수영장: 15, 골프연습장: 5, 탁구장: 5 },
    { hour: "10:00", 헬스장: 10, 수영장: 10, 골프연습장: 10, 탁구장: 15 },
    { hour: "12:00", 헬스장: 5, 수영장: 5, 골프연습장: 5, 탁구장: 10 },
    { hour: "14:00", 헬스장: 5, 수영장: 5, 골프연습장: 10, 탁구장: 5 },
    { hour: "16:00", 헬스장: 15, 수영장: 10, 골프연습장: 15, 탁구장: 10 },
    { hour: "18:00", 헬스장: 30, 수영장: 15, 골프연습장: 20, 탁구장: 25 },
    { hour: "20:00", 헬스장: 25, 수영장: 10, 골프연습장: 15, 탁구장: 15 },
    { hour: "22:00", 헬스장: 5, 수영장: 0, 골프연습장: 5, 탁구장: 0 },
  ]

  const dailyData = [
    { day: "월", 헬스장: 50, 수영장: 30, 골프연습장: 15, 탁구장: 25 },
    { day: "화", 헬스장: 45, 수영장: 35, 골프연습장: 20, 탁구장: 20 },
    { day: "수", 헬스장: 55, 수영장: 25, 골프연습장: 10, 탁구장: 30 },
    { day: "목", 헬스장: 40, 수영장: 40, 골프연습장: 25, 탁구장: 15 },
    { day: "금", 헬스장: 60, 수영장: 35, 골프연습장: 15, 탁구장: 25 },
    { day: "토", 헬스장: 35, 수영장: 45, 골프연습장: 20, 탁구장: 20 },
    { day: "일", 헬스장: 30, 수영장: 30, 골프연습장: 25, 탁구장: 15 },
  ]

  const monthlyData = [
    { month: "1월", 헬스장: 1100, 수영장: 850, 골프연습장: 400, 탁구장: 550 },
    { month: "2월", 헬스장: 1200, 수영장: 900, 골프연습장: 420, 탁구장: 580 },
    { month: "3월", 헬스장: 1250, 수영장: 980, 골프연습장: 450, 탁구장: 620 },
  ]

  const userDemographics = [
    { ageGroup: "20대 이하", 헬스장: 15, 수영장: 20, 골프연습장: 5, 탁구장: 10 },
    { ageGroup: "30대", 헬스장: 30, 수영장: 25, 골프연습장: 15, 탁구장: 20 },
    { ageGroup: "40대", 헬스장: 25, 수영장: 30, 골프연습장: 30, 탁구장: 30 },
    { ageGroup: "50대", 헬스장: 20, 수영장: 15, 골프연습장: 35, 탁구장: 25 },
    { ageGroup: "60대 이상", 헬스장: 10, 수영장: 10, 골프연습장: 15, 탁구장: 15 },
  ]

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
            <h1 className="text-2xl font-bold">시설 이용 통계</h1>
            <div className="flex space-x-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="기간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">일간</SelectItem>
                  <SelectItem value="weekly">주간</SelectItem>
                  <SelectItem value="monthly">월간</SelectItem>
                  <SelectItem value="yearly">연간</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" /> 날짜 선택
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> 보고서 다운로드
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">총 방문자 수</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,300</div>
                <p className="text-xs text-muted-foreground">지난 달 대비 +8%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">일 평균 방문자 수</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">110</div>
                <p className="text-xs text-muted-foreground">지난 주 대비 +5%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">평균 이용 시간</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68분</div>
                <p className="text-xs text-muted-foreground">지난 달 대비 +3분</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">가장 인기 있는 시설</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">헬스장</div>
                <p className="text-xs text-muted-foreground">전체 이용의 38%</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="usage">
            <TabsList>
              <TabsTrigger value="usage">이용률 분석</TabsTrigger>
              <TabsTrigger value="time">시간대별 분석</TabsTrigger>
              <TabsTrigger value="demographics">이용자 분석</TabsTrigger>
              <TabsTrigger value="comparison">시설별 비교</TabsTrigger>
            </TabsList>
            <TabsContent value="usage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>시설별 이용률</CardTitle>
                  <CardDescription>각 시설의 이용률 통계입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">시설별 이용률 그래프가 여기에 표시됩니다.</p>
                  </div>
                  <div className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>시설명</TableHead>
                          <TableHead>총 방문자 수</TableHead>
                          <TableHead>일 평균 방문자</TableHead>
                          <TableHead>평균 이용 시간</TableHead>
                          <TableHead>만족도</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {facilities.map((facility) => (
                          <TableRow key={facility.id}>
                            <TableCell className="font-medium">{facility.name}</TableCell>
                            <TableCell>{facility.totalVisits}</TableCell>
                            <TableCell>{facility.averageDailyVisits}</TableCell>
                            <TableCell>{facility.averageStayTime}분</TableCell>
                            <TableCell>{facility.userSatisfaction}/5.0</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>월별 이용 추이</CardTitle>
                    <CardDescription>최근 3개월 이용 추이입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">월별 이용 추이 그래프가 여기에 표시됩니다.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>요일별 이용 패턴</CardTitle>
                    <CardDescription>요일별 이용 패턴입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">요일별 이용 패턴 그래프가 여기에 표시됩니다.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="time" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>시간대별 이용 현황</CardTitle>
                  <CardDescription>시간대별 시설 이용 현황입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">시간대별 이용 현황 그래프가 여기에 표시됩니다.</p>
                  </div>
                  <div className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>시간</TableHead>
                          <TableHead>헬스장</TableHead>
                          <TableHead>수영장</TableHead>
                          <TableHead>골프연습장</TableHead>
                          <TableHead>탁구장</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hourlyData.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{data.hour}</TableCell>
                            <TableCell>{data.헬스장}명</TableCell>
                            <TableCell>{data.수영장}명</TableCell>
                            <TableCell>{data.골프연습장}명</TableCell>
                            <TableCell>{data.탁구장}명</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>피크 타임 분석</CardTitle>
                    <CardDescription>시설별 피크 타임 분석입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>시설명</TableHead>
                          <TableHead>피크 시간대</TableHead>
                          <TableHead>한가한 시간대</TableHead>
                          <TableHead>인기 요일</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {facilities.map((facility) => (
                          <TableRow key={facility.id}>
                            <TableCell className="font-medium">{facility.name}</TableCell>
                            <TableCell>{facility.peakHours}</TableCell>
                            <TableCell>{facility.leastBusyHours}</TableCell>
                            <TableCell>{facility.popularDays}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>시간대별 추천</CardTitle>
                    <CardDescription>혼잡도에 따른 시간대별 추천입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md">
                        <h3 className="font-semibold mb-2">한가한 시간대 추천</h3>
                        <p className="text-sm text-muted-foreground mb-2">헬스장: 13:00-15:00 (평일)</p>
                        <p className="text-sm text-muted-foreground mb-2">수영장: 14:00-16:00 (평일)</p>
                        <p className="text-sm text-muted-foreground mb-2">골프연습장: 09:00-11:00 (평일)</p>
                        <p className="text-sm text-muted-foreground">탁구장: 10:00-12:00 (평일)</p>
                      </div>
                      <div className="p-4 border rounded-md">
                        <h3 className="font-semibold mb-2">피해야 할 혼잡 시간대</h3>
                        <p className="text-sm text-muted-foreground mb-2">헬스장: 18:00-20:00 (평일)</p>
                        <p className="text-sm text-muted-foreground mb-2">수영장: 06:00-08:00 (평일)</p>
                        <p className="text-sm text-muted-foreground mb-2">골프연습장: 19:00-21:00 (평일)</p>
                        <p className="text-sm text-muted-foreground">탁구장: 18:00-20:00 (평일)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="demographics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>이용자 인구통계</CardTitle>
                  <CardDescription>시설별 이용자 인구통계입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">이용자 인구통계 그래프가 여기에 표시됩니다.</p>
                  </div>
                  <div className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>연령대</TableHead>
                          <TableHead>헬스장 (%)</TableHead>
                          <TableHead>수영장 (%)</TableHead>
                          <TableHead>골프연습장 (%)</TableHead>
                          <TableHead>탁구장 (%)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userDemographics.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{data.ageGroup}</TableCell>
                            <TableCell>{data.헬스장}%</TableCell>
                            <TableCell>{data.수영장}%</TableCell>
                            <TableCell>{data.골프연습장}%</TableCell>
                            <TableCell>{data.탁구장}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>성별 이용 비율</CardTitle>
                    <CardDescription>시설별 성별 이용 비율입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">성별 이용 비율 그래프가 여기에 표시됩니다.</p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span>헬스장</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                          </div>
                          <span className="ml-2 text-sm">남성 65% / 여성 35%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>수영장</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                          <span className="ml-2 text-sm">남성 45% / 여성 55%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>골프연습장</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "60%" }}></div>
                          </div>
                          <span className="ml-2 text-sm">남성 60% / 여성 40%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>탁구장</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "55%" }}></div>
                          </div>
                          <span className="ml-2 text-sm">남성 55% / 여성 45%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>회원 유형별 이용 현황</CardTitle>
                    <CardDescription>회원 유형별 시설 이용 현황입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">회원 유형별 이용 현황 그래프가 여기에 표시됩니다.</p>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">정기 회원</span>
                        <span>65%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">일일 이용권</span>
                        <span>20%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">체험 이용권</span>
                        <span>10%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">기타</span>
                        <span>5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>시설별 비교</CardTitle>
                  <CardDescription>시설별 이용 현황 비교입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">시설별 비교 그래프가 여기에 표시됩니다.</p>
                  </div>
                  <div className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>지표</TableHead>
                          <TableHead>헬스장</TableHead>
                          <TableHead>수영장</TableHead>
                          <TableHead>골프연습장</TableHead>
                          <TableHead>탁구장</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">이용률</TableCell>
                          <TableCell>38%</TableCell>
                          <TableCell>30%</TableCell>
                          <TableCell>14%</TableCell>
                          <TableCell>18%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">만족도</TableCell>
                          <TableCell>4.2/5.0</TableCell>
                          <TableCell>4.5/5.0</TableCell>
                          <TableCell>4.0/5.0</TableCell>
                          <TableCell>4.3/5.0</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">평균 이용 시간</TableCell>
                          <TableCell>75분</TableCell>
                          <TableCell>60분</TableCell>
                          <TableCell>90분</TableCell>
                          <TableCell>45분</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">재방문율</TableCell>
                          <TableCell>85%</TableCell>
                          <TableCell>80%</TableCell>
                          <TableCell>75%</TableCell>
                          <TableCell>70%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">운영 비용</TableCell>
                          <TableCell>높음</TableCell>
                          <TableCell>매우 높음</TableCell>
                          <TableCell>중간</TableCell>
                          <TableCell>낮음</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>월별 이용 추이 비교</CardTitle>
                    <CardDescription>시설별 월간 이용 추이 비교입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">월별 이용 추이 비교 그래프가 여기에 표시됩니다.</p>
                    </div>
                    <div className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>월</TableHead>
                            <TableHead>헬스장</TableHead>
                            <TableHead>수영장</TableHead>
                            <TableHead>골프연습장</TableHead>
                            <TableHead>탁구장</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {monthlyData.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{data.month}</TableCell>
                              <TableCell>{data.헬스장}</TableCell>
                              <TableCell>{data.수영장}</TableCell>
                              <TableCell>{data.골프연습장}</TableCell>
                              <TableCell>{data.탁구장}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>요일별 이용 패턴 비교</CardTitle>
                    <CardDescription>시설별 요일별 이용 패턴 비교입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">요일별 이용 패턴 비교 그래프가 여기에 표시됩니다.</p>
                    </div>
                    <div className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>요일</TableHead>
                            <TableHead>헬스장</TableHead>
                            <TableHead>수영장</TableHead>
                            <TableHead>골프연습장</TableHead>
                            <TableHead>탁구장</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dailyData.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{data.day}</TableCell>
                              <TableCell>{data.헬스장}</TableCell>
                              <TableCell>{data.수영장}</TableCell>
                              <TableCell>{data.골프연습장}</TableCell>
                              <TableCell>{data.탁구장}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

