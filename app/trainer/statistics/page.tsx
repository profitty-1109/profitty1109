"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/ui/user-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, BarChart3, Dumbbell, LineChart, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StatisticsData {
  totalMembers: number
  activeMembers: number
  averageAttendanceRate: number
  totalRevenue: number
  lessonTypeDistribution?: Record<string, number>
  memberAttendance?: Record<string, number>
  monthlyRevenue?: Record<string, number>
  memberProgress?: Record<string, number>
}

export default function StatisticsPage() {
  const { toast } = useToast()
  const [statistics, setStatistics] = useState<StatisticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("month")
  const [authToken, setAuthToken] = useState<string | null>(null)

  // 로컬 스토리지에서 인증 토큰 가져오기
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setAuthToken(token)
    }
  }, [])

  // 통계 데이터 가져오기
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true)

        // API 요청 URL 구성
        let url = `/api/trainer-stats?timeRange=${timeRange}`
        if (authToken) {
          url += `&token=${authToken}`
        }

        console.log("Fetching statistics from:", url)

        const response = await fetch(url, {
          headers: {
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
          },
          credentials: "include",
        })

        // 응답 상태 코드 확인 및 로깅
        console.log("API 응답 상태:", response.status)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("API 오류 응답:", errorData)

          // 401 오류인 경우 로그인 페이지로 리다이렉트
          if (response.status === 401) {
            toast({
              title: "로그인 필요",
              description: "로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.",
              variant: "destructive",
            })

            // 3초 후 로그인 페이지로 리다이렉트
            setTimeout(() => {
              window.location.href = "/login?redirect=/trainer/statistics"
            }, 3000)

            return
          }

          throw new Error(errorData.error || "통계 정보를 가져오는데 실패했습니다.")
        }

        const data = await response.json()
        console.log("가져온 통계 데이터:", data)
        setStatistics(data)
      } catch (error) {
        console.error("Error fetching statistics:", error)
        toast({
          title: "오류",
          description: error instanceof Error ? error.message : "통계 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        })
        // 오류 발생 시 기본 통계 데이터 설정
        setStatistics({
          totalMembers: 0,
          activeMembers: 0,
          averageAttendanceRate: 0,
          totalRevenue: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatistics()
  }, [toast, authToken, timeRange])

  // 차트 데이터 생성 함수
  const generateChartData = (data: Record<string, number> | undefined) => {
    if (!data) return []

    return Object.entries(data).map(([key, value]) => ({
      label: key,
      value: value,
    }))
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex flex-col w-64 border-r px-4 py-6">
        <MainNav userRole="trainer" />
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
              <UserNav userName="박트레이너" userEmail="trainer@example.com" userRole="trainer" />
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">통계 및 분석</h1>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="기간 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">최근 1주일</SelectItem>
                <SelectItem value="month">최근 1개월</SelectItem>
                <SelectItem value="quarter">최근 3개월</SelectItem>
                <SelectItem value="year">최근 1년</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>통계 정보를 불러오는 중...</p>
            </div>
          ) : statistics ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">총 회원 수</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.totalMembers}명</div>
                    <p className="text-xs text-muted-foreground">활성 회원: {statistics.activeMembers}명</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">평균 출석률</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.averageAttendanceRate}%</div>
                    <p className="text-xs text-muted-foreground">전체 회원 기준</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">총 수익</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.totalRevenue.toLocaleString()}원</div>
                    <p className="text-xs text-muted-foreground">
                      {timeRange === "week"
                        ? "최근 1주일"
                        : timeRange === "month"
                          ? "최근 1개월"
                          : timeRange === "quarter"
                            ? "최근 3개월"
                            : "최근 1년"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">레슨 유형</CardTitle>
                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statistics.lessonTypeDistribution ? Object.keys(statistics.lessonTypeDistribution).length : 0}개
                    </div>
                    <p className="text-xs text-muted-foreground">운영 중인 레슨 유형</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">개요</TabsTrigger>
                  <TabsTrigger value="members">회원 분석</TabsTrigger>
                  <TabsTrigger value="lessons">레슨 분석</TabsTrigger>
                  <TabsTrigger value="revenue">수익 분석</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>통계 개요</CardTitle>
                      <CardDescription>주요 통계 지표 요약</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center border rounded-md">
                        <p className="text-muted-foreground">통계 그래프가 여기에 표시됩니다.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2">레슨 유형 분포</h3>
                          {statistics.lessonTypeDistribution ? (
                            Object.entries(statistics.lessonTypeDistribution).map(([type, count], index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{type}:</span>
                                <span>{count}회</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>
                          )}
                        </div>
                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2">회원 출석률</h3>
                          <div className="flex items-center">
                            <div className="w-full bg-secondary h-2 rounded-full">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${statistics.averageAttendanceRate}%` }}
                              />
                            </div>
                            <span className="ml-2 text-sm">{statistics.averageAttendanceRate}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="members" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>회원 분석</CardTitle>
                      <CardDescription>회원 출석률 및 진행 상황 분석</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center border rounded-md">
                        <p className="text-muted-foreground">회원 분석 그래프가 여기에 표시됩니다.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2">회원 출석률 순위</h3>
                          {statistics.memberAttendance ? (
                            Object.entries(statistics.memberAttendance)
                              .sort(([, a], [, b]) => b - a)
                              .slice(0, 5)
                              .map(([name, rate], index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{name}:</span>
                                  <span>{rate}%</span>
                                </div>
                              ))
                          ) : (
                            <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>
                          )}
                        </div>
                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2">회원 진행 상황</h3>
                          {statistics.memberProgress ? (
                            Object.entries(statistics.memberProgress)
                              .sort(([, a], [, b]) => b - a)
                              .slice(0, 5)
                              .map(([name, progress], index) => (
                                <div key={index} className="flex flex-col text-sm mb-2">
                                  <div className="flex justify-between mb-1">
                                    <span>{name}:</span>
                                    <span>{progress}%</span>
                                  </div>
                                  <div className="w-full bg-secondary h-2 rounded-full">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }} />
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="lessons" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>레슨 분석</CardTitle>
                      <CardDescription>레슨 유형별 통계 및 인기 레슨 분석</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center border rounded-md">
                        <p className="text-muted-foreground">레슨 분석 그래프가 여기에 표시됩니다.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2">레슨 유형별 비율</h3>
                          {statistics.lessonTypeDistribution ? (
                            Object.entries(statistics.lessonTypeDistribution).map(([type, count], index) => (
                              <div key={index} className="flex flex-col text-sm mb-2">
                                <div className="flex justify-between mb-1">
                                  <span>{type}:</span>
                                  <span>{count}회</span>
                                </div>
                                <div className="w-full bg-secondary h-2 rounded-full">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{
                                      width: `${(count / Object.values(statistics.lessonTypeDistribution).reduce((a, b) => a + b, 0)) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>
                          )}
                        </div>
                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2">인기 레슨 시간대</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>오전 (06:00-12:00):</span>
                              <span>30%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>오후 (12:00-18:00):</span>
                              <span>25%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>저녁 (18:00-22:00):</span>
                              <span>45%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="revenue" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>수익 분석</CardTitle>
                      <CardDescription>월별 수익 및 레슨 유형별 수익 분석</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center border rounded-md">
                        <p className="text-muted-foreground">수익 분석 그래프가 여기에 표시됩니다.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2">월별 수익</h3>
                          {statistics.monthlyRevenue ? (
                            Object.entries(statistics.monthlyRevenue)
                              .sort(([a], [b]) => a.localeCompare(b))
                              .map(([month, revenue], index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{month}:</span>
                                  <span>{revenue.toLocaleString()}원</span>
                                </div>
                              ))
                          ) : (
                            <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>
                          )}
                        </div>
                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2">레슨 유형별 수익</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>개인 PT:</span>
                              <span>450,000원</span>
                            </div>
                            <div className="flex justify-between">
                              <span>그룹 PT:</span>
                              <span>320,000원</span>
                            </div>
                            <div className="flex justify-between">
                              <span>요가:</span>
                              <span>180,000원</span>
                            </div>
                            <div className="flex justify-between">
                              <span>필라테스:</span>
                              <span>150,000원</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="text-center py-10">
              <LineChart className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium text-lg mb-2">통계 데이터가 없습니다</h3>
              <p className="text-muted-foreground mb-4">레슨 및 회원 데이터가 쌓이면 통계가 생성됩니다.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

