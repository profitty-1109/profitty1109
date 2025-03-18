"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart, ClipboardList, Calendar, Plus, Pencil, Eye, Send } from "lucide-react"

export default function AdminSurveys() {
  const [isAddSurveyOpen, setIsAddSurveyOpen] = useState(false)
  const [isViewResultsOpen, setIsViewResultsOpen] = useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState(null)

  // 실제 구현에서는   = useState(false)

  // 실제 구현에서는 서버에서 데이터를 가져옴
  const surveys = [
    {
      id: 1,
      title: "커뮤니티 시설 만족도 조사",
      description: "아파트 커뮤니티 시설에 대한 만족도를 조사합니다.",
      status: "진행 중",
      startDate: "2025-03-01",
      endDate: "2025-03-31",
      respondents: 45,
      targetRespondents: 100,
      questions: [
        {
          id: 1,
          type: "radio",
          question: "헬스장 시설에 대해 얼마나 만족하십니까?",
          options: ["매우 불만족", "불만족", "보통", "만족", "매우 만족"],
        },
        {
          id: 2,
          type: "radio",
          question: "수영장 시설에 대해 얼마나 만족하십니까?",
          options: ["매우 불만족", "불만족", "보통", "만족", "매우 만족"],
        },
        {
          id: 3,
          type: "checkbox",
          question: "가장 자주 이용하는 시설을 모두 선택해주세요.",
          options: ["헬스장", "수영장", "골프연습장", "탁구장", "독서실"],
        },
        {
          id: 4,
          type: "text",
          question: "커뮤니티 시설 개선을 위한 제안사항이 있으시면 자유롭게 작성해주세요.",
        },
      ],
    },
    {
      id: 2,
      title: "신규 시설 수요 조사",
      description: "입주민들이 원하는 신규 시설에 대한 수요를 조사합니다.",
      status: "예정",
      startDate: "2025-04-01",
      endDate: "2025-04-15",
      respondents: 0,
      targetRespondents: 100,
      questions: [
        {
          id: 1,
          type: "checkbox",
          question: "다음 중 추가되었으면 하는 시설을 모두 선택해주세요.",
          options: ["실내 농구장", "요가 스튜디오", "사우나", "카페", "키즈룸"],
        },
        {
          id: 2,
          type: "radio",
          question: "신규 시설이 추가된다면 이용 의향이 있으십니까?",
          options: ["전혀 없음", "없음", "보통", "있음", "매우 있음"],
        },
        {
          id: 3,
          type: "text",
          question: "원하는 신규 시설이 있다면 자유롭게 작성해주세요.",
        },
      ],
    },
    {
      id: 3,
      title: "커뮤니티 앱 사용성 평가",
      description: "커뮤니티 앱의 사용성에 대한 평가를 수집합니다.",
      status: "종료",
      startDate: "2025-02-01",
      endDate: "2025-02-28",
      respondents: 78,
      targetRespondents: 100,
      questions: [
        {
          id: 1,
          type: "radio",
          question: "앱 사용이 얼마나 편리하다고 생각하십니까?",
          options: ["매우 불편함", "불편함", "보통", "편리함", "매우 편리함"],
        },
        {
          id: 2,
          type: "checkbox",
          question: "가장 자주 사용하는 기능을 모두 선택해주세요.",
          options: ["시설 예약", "공지사항 확인", "커뮤니티 게시판", "민원 신청", "운동 기록"],
        },
      ],
    },
  ]

  const handleViewResults = (survey) => {
    setSelectedSurvey(survey)
    setIsViewResultsOpen(true)
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
            <h1 className="text-2xl font-bold">수요 조사</h1>
            <Button onClick={() => setIsAddSurveyOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> 수요 조사 추가
            </Button>
          </div>

          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">진행 중인 조사</TabsTrigger>
              <TabsTrigger value="scheduled">예정된 조사</TabsTrigger>
              <TabsTrigger value="completed">종료된 조사</TabsTrigger>
              <TabsTrigger value="analytics">통계 분석</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {surveys
                  .filter((survey) => survey.status === "진행 중")
                  .map((survey) => (
                    <Card key={survey.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{survey.title}</CardTitle>
                          <Badge>{survey.status}</Badge>
                        </div>
                        <CardDescription>{survey.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">기간:</span>
                            <span>
                              {survey.startDate} ~ {survey.endDate}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">응답자:</span>
                            <span>
                              {survey.respondents}/{survey.targetRespondents}명
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">질문 수:</span>
                            <span>{survey.questions.length}개</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${(survey.respondents / survey.targetRespondents) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => handleViewResults(survey)}>
                          <Eye className="mr-2 h-4 w-4" /> 결과 보기
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="mr-2 h-4 w-4" /> 알림 발송
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="scheduled" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {surveys
                  .filter((survey) => survey.status === "예정")
                  .map((survey) => (
                    <Card key={survey.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{survey.title}</CardTitle>
                          <Badge variant="outline">{survey.status}</Badge>
                        </div>
                        <CardDescription>{survey.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">기간:</span>
                            <span>
                              {survey.startDate} ~ {survey.endDate}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">목표 응답자:</span>
                            <span>{survey.targetRespondents}명</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">질문 수:</span>
                            <span>{survey.questions.length}개</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          <Pencil className="mr-2 h-4 w-4" /> 수정
                        </Button>
                        <Button variant="outline" size="sm">
                          <Calendar className="mr-2 h-4 w-4" /> 일정 변경
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {surveys
                  .filter((survey) => survey.status === "종료")
                  .map((survey) => (
                    <Card key={survey.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{survey.title}</CardTitle>
                          <Badge variant="secondary">{survey.status}</Badge>
                        </div>
                        <CardDescription>{survey.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">기간:</span>
                            <span>
                              {survey.startDate} ~ {survey.endDate}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">응답자:</span>
                            <span>
                              {survey.respondents}/{survey.targetRespondents}명
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">참여율:</span>
                            <span>{Math.round((survey.respondents / survey.targetRespondents) * 100)}%</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => handleViewResults(survey)}>
                          <BarChart className="mr-2 h-4 w-4" /> 결과 분석
                        </Button>
                        <Button variant="outline" size="sm">
                          <ClipboardList className="mr-2 h-4 w-4" /> 보고서
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>수요 조사 참여 통계</CardTitle>
                  <CardDescription>기간별 수요 조사 참여율 통계입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">수요 조사 참여율 그래프가 여기에 표시됩니다.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">평균 참여율</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">78%</div>
                        <p className="text-xs text-muted-foreground">전년 대비 +12%</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">총 조사 수</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">올해 진행된 조사</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">총 응답자 수</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">856</div>
                        <p className="text-xs text-muted-foreground">전년 대비 +203명</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>인기 시설 수요 분석</CardTitle>
                  <CardDescription>입주민들이 가장 원하는 시설 분석입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">인기 시설 수요 그래프가 여기에 표시됩니다.</p>
                  </div>
                  <div className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>시설명</TableHead>
                          <TableHead>선호도</TableHead>
                          <TableHead>연령대</TableHead>
                          <TableHead>성별</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">실내 농구장</TableCell>
                          <TableCell>78%</TableCell>
                          <TableCell>20-30대</TableCell>
                          <TableCell>남성</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">요가 스튜디오</TableCell>
                          <TableCell>65%</TableCell>
                          <TableCell>30-40대</TableCell>
                          <TableCell>여성</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">사우나</TableCell>
                          <TableCell>62%</TableCell>
                          <TableCell>40-50대</TableCell>
                          <TableCell>남성/여성</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">카페</TableCell>
                          <TableCell>58%</TableCell>
                          <TableCell>전 연령대</TableCell>
                          <TableCell>남성/여성</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">키즈룸</TableCell>
                          <TableCell>45%</TableCell>
                          <TableCell>30-40대</TableCell>
                          <TableCell>여성</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* 수요 조사 추가 다이얼로그 */}
      <Dialog open={isAddSurveyOpen} onOpenChange={setIsAddSurveyOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>수요 조사 추가</DialogTitle>
            <DialogDescription>새로운 수요 조사 정보를 입력하세요. 모든 필드는 필수입니다.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" placeholder="수요 조사 제목을 입력하세요" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea id="description" placeholder="수요 조사에 대한 설명을 입력하세요" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">시작일</Label>
                <Input id="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">종료일</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetRespondents">목표 응답자 수</Label>
              <Input id="targetRespondents" type="number" placeholder="목표 응답자 수를 입력하세요" />
            </div>
            <div className="space-y-2">
              <Label>질문 추가</Label>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> 질문 추가
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSurveyOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsAddSurveyOpen(false)}>추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 결과 보기 다이얼로그 */}
      <Dialog open={isViewResultsOpen} onOpenChange={setIsViewResultsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedSurvey?.title} 결과</DialogTitle>
            <DialogDescription>{selectedSurvey?.description}</DialogDescription>
          </DialogHeader>
          {selectedSurvey && (
            <div className="space-y-6 py-4 max-h-[600px] overflow-y-auto">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    기간: {selectedSurvey.startDate} ~ {selectedSurvey.endDate}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    응답자: {selectedSurvey.respondents}/{selectedSurvey.targetRespondents}명
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <ClipboardList className="mr-2 h-4 w-4" /> 보고서 다운로드
                </Button>
              </div>

              {selectedSurvey.questions.map((question) => (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{question.question}</CardTitle>
                    <CardDescription>
                      질문 유형:{" "}
                      {question.type === "radio"
                        ? "객관식 (단일 선택)"
                        : question.type === "checkbox"
                          ? "객관식 (다중 선택)"
                          : "주관식"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {question.type === "text" ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">주요 키워드: 시설, 개선, 청결, 운영시간, 예약</p>
                        <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                          <p className="text-sm mb-2">- 헬스장 운영 시간을 좀 더 늘려주세요.</p>
                          <p className="text-sm mb-2">- 수영장 물 온도가 너무 차가워요.</p>
                          <p className="text-sm mb-2">- 골프연습장 매트를 교체해주세요.</p>
                          <p className="text-sm mb-2">- 시설 예약 시스템이 더 편리했으면 좋겠습니다.</p>
                          <p className="text-sm">- 탁구장 청결 상태가 좋지 않습니다.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="h-[200px] flex items-center justify-center border rounded-md">
                          <p className="text-muted-foreground">응답 결과 그래프가 여기에 표시됩니다.</p>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>옵션</TableHead>
                              <TableHead>응답 수</TableHead>
                              <TableHead>비율</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {question.options.map((option, index) => (
                              <TableRow key={index}>
                                <TableCell>{option}</TableCell>
                                <TableCell>{Math.floor(Math.random() * 30)}</TableCell>
                                <TableCell>{Math.floor(Math.random() * 100)}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

