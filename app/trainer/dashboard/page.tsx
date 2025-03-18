import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Clock, Dumbbell, Users } from "lucide-react"
import Link from "next/link"

export default function TrainerDashboard() {
  // 실제 구현에서는 서버에서 데이터를 가져옴
  const upcomingLessons = [
    { id: 1, lesson: "요가 클래스", member: "홍길동", date: "2025-03-19", time: "19:00-20:00" },
    { id: 2, lesson: "개인 PT", member: "김철수", date: "2025-03-18", time: "15:00-16:00" },
    { id: 3, lesson: "수영 레슨", member: "이영희", date: "2025-03-21", time: "15:00-16:00" },
  ]

  const members = [
    { id: 1, name: "홍길동", program: "요가", lastVisit: "2025-03-15" },
    { id: 2, name: "김철수", program: "개인 PT", lastVisit: "2025-03-16" },
    { id: 3, name: "이영희", program: "수영", lastVisit: "2025-03-14" },
  ]

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
            <h1 className="text-2xl font-bold">천안 불당호반써밋플레이스센터시티 트레이너 대시보드</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">예약된 레슨</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingLessons.length}</div>
                <p className="text-xs text-muted-foreground">다음 7일 동안</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">회원 수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{members.length}</div>
                <p className="text-xs text-muted-foreground">활성 회원</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">레슨 시간</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24시간</div>
                <p className="text-xs text-muted-foreground">지난 7일 동안</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">회원 만족도</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8/5</div>
                <p className="text-xs text-muted-foreground">평균 평점</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="schedule">
            <TabsList>
              <TabsTrigger value="schedule">일정</TabsTrigger>
              <TabsTrigger value="members">회원</TabsTrigger>
              <TabsTrigger value="statistics">통계</TabsTrigger>
            </TabsList>
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>다가오는 레슨</CardTitle>
                  <CardDescription>예약된 레슨 일정</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <Calendar />
                    </div>
                    <div className="md:w-1/2 space-y-4">
                      <h3 className="font-semibold">오늘의 레슨</h3>
                      <div className="space-y-2">
                        {upcomingLessons
                          .filter((lesson) => lesson.date === "2025-03-18")
                          .map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 rounded-md bg-blue-50"
                            >
                              <div className="flex items-center">
                                <Dumbbell className="h-4 w-4 mr-2 text-primary" />
                                <div>
                                  <p className="font-medium">{lesson.lesson}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {lesson.member} | {lesson.time}
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                상세
                              </Button>
                            </div>
                          ))}
                      </div>

                      <h3 className="font-semibold mt-4">다가오는 레슨</h3>
                      <div className="space-y-2">
                        {upcomingLessons
                          .filter((lesson) => lesson.date !== "2025-03-18")
                          .map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 rounded-md border">
                              <div className="flex items-center">
                                <Dumbbell className="h-4 w-4 mr-2 text-primary" />
                                <div>
                                  <p className="font-medium">{lesson.lesson}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {lesson.member} | {lesson.date} | {lesson.time}
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                상세
                              </Button>
                            </div>
                          ))}
                      </div>

                      <div className="mt-4">
                        <Button asChild>
                          <Link href="/trainer/lessons">레슨 관리</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle>회원 관리</CardTitle>
                  <CardDescription>활성 회원 목록</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {member.program} | 마지막 방문: {member.lastVisit}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            루틴 관리
                          </Button>
                          <Button variant="outline" size="sm">
                            상세 정보
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button asChild>
                      <Link href="/trainer/members">모든 회원 보기</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="statistics">
              <Card>
                <CardHeader>
                  <CardTitle>통계 및 분석</CardTitle>
                  <CardDescription>레슨 및 회원 통계</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">통계 그래프가 여기에 표시됩니다.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="border rounded-md p-4">
                      <h3 className="font-semibold mb-2">레슨 유형 통계</h3>
                      <p className="text-sm text-muted-foreground">요가 클래스: 45%</p>
                      <p className="text-sm text-muted-foreground">개인 PT: 30%</p>
                      <p className="text-sm text-muted-foreground">수영 레슨: 25%</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="font-semibold mb-2">회원 참여도</h3>
                      <p className="text-sm text-muted-foreground">높음: 60%</p>
                      <p className="text-sm text-muted-foreground">중간: 30%</p>
                      <p className="text-sm text-muted-foreground">낮음: 10%</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button asChild>
                      <Link href="/trainer/statistics">상세 통계 보기</Link>
                    </Button>
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

