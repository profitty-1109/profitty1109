import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Activity, Building, CalendarIcon, Clock, Dumbbell, Users } from "lucide-react"
import Link from "next/link"

export default function ResidentDashboard() {
  // 실제 구현에서는 서버에서 데이터를 가져옴
  const upcomingReservations = [
    { id: 1, facility: "헬스장", date: "2025-03-18", time: "18:00-19:00" },
    { id: 2, facility: "수영장", date: "2025-03-20", time: "10:00-11:00" },
  ]

  const upcomingLessons = [
    { id: 1, lesson: "요가 클래스", trainer: "김지연", date: "2025-03-19", time: "19:00-20:00" },
    { id: 2, lesson: "수영 레슨", trainer: "박태준", date: "2025-03-21", time: "15:00-16:00" },
  ]

  const recentExercises = [
    { id: 1, type: "헬스", duration: 60, date: "2025-03-15" },
    { id: 2, type: "수영", duration: 45, date: "2025-03-16" },
  ]

  const notices = [
    { id: 1, title: "3월 시설 점검 안내", date: "2025-03-10" },
    { id: 2, title: "커뮤니티 센터 운영 시간 변경", date: "2025-03-12" },
  ]

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
            <h1 className="text-2xl font-bold">천안 불당호반써밋플레이스센터시티 입주민 대시보드</h1>
            <p className="text-muted-foreground">2025년 3월 17일</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">예약된 시설</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingReservations.length}</div>
                <p className="text-xs text-muted-foreground">다음 7일 동안</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">예약된 레슨</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingLessons.length}</div>
                <p className="text-xs text-muted-foreground">다음 7일 동안</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">운동 시간</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">105분</div>
                <p className="text-xs text-muted-foreground">지난 7일 동안</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">활동 점수</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85점</div>
                <p className="text-xs text-muted-foreground">지난 30일 동안</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="calendar">캘린더</TabsTrigger>
              <TabsTrigger value="activity">활동</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>다가오는 시설 예약</CardTitle>
                    <CardDescription>예약된 시설 목록</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingReservations.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingReservations.map((reservation) => (
                          <div
                            key={reservation.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center space-x-4">
                              <Building className="h-6 w-6 text-primary" />
                              <div>
                                <p className="font-medium">{reservation.facility}</p>
                                <p className="text-sm text-muted-foreground">
                                  {reservation.date} | {reservation.time}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              취소
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">예약된 시설이 없습니다.</p>
                    )}
                    <div className="mt-4">
                      <Button asChild>
                        <Link href="/resident/facilities">시설 예약하기</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>다가오는 레슨</CardTitle>
                    <CardDescription>예약된 레슨 목록</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingLessons.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingLessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center space-x-4">
                              <Dumbbell className="h-6 w-6 text-primary" />
                              <div>
                                <p className="font-medium">{lesson.lesson}</p>
                                <p className="text-sm text-muted-foreground">
                                  {lesson.trainer} | {lesson.date} | {lesson.time}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              취소
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">예약된 레슨이 없습니다.</p>
                    )}
                    <div className="mt-4">
                      <Button asChild>
                        <Link href="/resident/lessons">레슨 예약하기</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>최근 운동 기록</CardTitle>
                    <CardDescription>최근 운동 활동 내역</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentExercises.length > 0 ? (
                      <div className="space-y-4">
                        {recentExercises.map((exercise) => (
                          <div
                            key={exercise.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center space-x-4">
                              <Dumbbell className="h-6 w-6 text-primary" />
                              <div>
                                <p className="font-medium">{exercise.type}</p>
                                <p className="text-sm text-muted-foreground">
                                  {exercise.date} | {exercise.duration}분
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              상세
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">최근 운동 기록이 없습니다.</p>
                    )}
                    <div className="mt-4">
                      <Button asChild>
                        <Link href="/resident/exercise-log">운동 기록 관리</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>공지사항</CardTitle>
                    <CardDescription>최근 공지사항</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {notices.length > 0 ? (
                      <div className="space-y-4">
                        {notices.map((notice) => (
                          <div
                            key={notice.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                          >
                            <div>
                              <p className="font-medium">{notice.title}</p>
                              <p className="text-sm text-muted-foreground">{notice.date}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              보기
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">공지사항이 없습니다.</p>
                    )}
                    <div className="mt-4">
                      <Button variant="outline" asChild>
                        <Link href="/resident/notices">모든 공지사항 보기</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="calendar">
              <Card>
                <CardHeader>
                  <CardTitle>일정 캘린더</CardTitle>
                  <CardDescription>시설 예약 및 레슨 일정</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <Calendar />
                    </div>
                    <div className="md:w-1/2 space-y-4">
                      <h3 className="font-semibold">2025년 3월 17일</h3>
                      <div className="space-y-2">
                        <div className="flex items-center p-2 rounded-md bg-blue-50">
                          <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm">헬스장 예약 (18:00-19:00)</span>
                        </div>
                      </div>
                      <h3 className="font-semibold mt-4">2025년 3월 19일</h3>
                      <div className="space-y-2">
                        <div className="flex items-center p-2 rounded-md bg-blue-50">
                          <Users className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm">요가 클래스 (19:00-20:00)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>활동 요약</CardTitle>
                  <CardDescription>지난 30일 동안의 활동 내역</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">활동 그래프가 여기에 표시됩니다.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="border rounded-md p-4">
                      <h3 className="font-semibold mb-2">시설 이용 통계</h3>
                      <p className="text-sm text-muted-foreground">헬스장: 8회</p>
                      <p className="text-sm text-muted-foreground">수영장: 4회</p>
                      <p className="text-sm text-muted-foreground">골프연습장: 2회</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="font-semibold mb-2">운동 유형 통계</h3>
                      <p className="text-sm text-muted-foreground">웨이트 트레이닝: 6시간</p>
                      <p className="text-sm text-muted-foreground">수영: 3시간</p>
                      <p className="text-sm text-muted-foreground">요가: 2시간</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

