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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Plus, Pencil, Trash2, Pin } from "lucide-react"

export default function AdminNotices() {
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false)
  const [isEditNoticeOpen, setIsEditNoticeOpen] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [date, setDate] = useState(new Date())

  // 실제 구현에서는 서버에서 데이터를 가져옴
  const notices = [
    {
      id: 1,
      title: "3월 시설 점검 안내",
      content:
        "3월 15일에 헬스장 시설 점검이 있을 예정입니다. 해당 일자에는 헬스장 이용이 제한되오니 양해 부탁드립니다.",
      author: "관리자",
      createdAt: "2025-03-10",
      status: "게시 중",
      important: true,
      views: 245,
      category: "시설",
      scheduledAt: null,
    },
    {
      id: 2,
      title: "커뮤니티 센터 운영 시간 변경",
      content: "4월부터 커뮤니티 센터 운영 시간이 변경됩니다. 변경된 시간은 06:00-22:00입니다.",
      author: "관리자",
      createdAt: "2025-03-12",
      status: "게시 중",
      important: false,
      views: 187,
      category: "운영",
      scheduledAt: null,
    },
    {
      id: 3,
      title: "수영장 안전 교육 안내",
      content: "4월 5일 오전 10시부터 수영장에서 안전 교육이 진행됩니다. 많은 참여 부탁드립니다.",
      author: "관리자",
      createdAt: "2025-03-15",
      status: "예약됨",
      important: false,
      views: 0,
      category: "교육",
      scheduledAt: "2025-04-01",
    },
    {
      id: 4,
      title: "주차장 도색 공사 안내",
      content:
        "4월 10일부터 12일까지 지하 주차장 도색 공사가 진행됩니다. 해당 기간 동안 지하 주차장 이용이 제한될 수 있습니다.",
      author: "관리자",
      createdAt: "2025-03-20",
      status: "예약됨",
      important: true,
      views: 0,
      category: "공사",
      scheduledAt: "2025-04-05",
    },
    {
      id: 5,
      title: "입주민 정기 총회 안내",
      content: "2025년 3월 입주민 정기 총회가 3월 25일 오후 7시에 커뮤니티 센터 대강당에서 개최됩니다.",
      author: "관리자",
      createdAt: "2025-03-01",
      status: "게시 중",
      important: true,
      views: 312,
      category: "행사",
      scheduledAt: null,
    },
  ]

  const handleEditNotice = (notice) => {
    setSelectedNotice(notice)
    setIsEditNoticeOpen(true)
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
            <h1 className="text-2xl font-bold">공지사항</h1>
            <Button onClick={() => setIsAddNoticeOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> 공지사항 작성
            </Button>
          </div>

          <Tabs defaultValue="published">
            <TabsList>
              <TabsTrigger value="published">게시 중</TabsTrigger>
              <TabsTrigger value="scheduled">예약됨</TabsTrigger>
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="calendar">캘린더</TabsTrigger>
            </TabsList>
            <TabsContent value="published" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>게시 중인 공지사항</CardTitle>
                  <CardDescription>현재 게시 중인 공지사항 목록입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>제목</TableHead>
                        <TableHead>카테고리</TableHead>
                        <TableHead>작성일</TableHead>
                        <TableHead>조회수</TableHead>
                        <TableHead>중요</TableHead>
                        <TableHead>관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notices
                        .filter((notice) => notice.status === "게시 중")
                        .map((notice) => (
                          <TableRow key={notice.id}>
                            <TableCell className="font-medium">
                              {notice.important && <Pin className="inline-block h-4 w-4 mr-1 text-red-500" />}
                              {notice.title}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{notice.category}</Badge>
                            </TableCell>
                            <TableCell>{notice.createdAt}</TableCell>
                            <TableCell>{notice.views}</TableCell>
                            <TableCell>{notice.important ? "예" : "아니오"}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditNotice(notice)}>
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
            </TabsContent>
            <TabsContent value="scheduled" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>예약된 공지사항</CardTitle>
                  <CardDescription>게시 예정인 공지사항 목록입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>제목</TableHead>
                        <TableHead>카테고리</TableHead>
                        <TableHead>작성일</TableHead>
                        <TableHead>게시 예정일</TableHead>
                        <TableHead>중요</TableHead>
                        <TableHead>관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notices
                        .filter((notice) => notice.status === "예약됨")
                        .map((notice) => (
                          <TableRow key={notice.id}>
                            <TableCell className="font-medium">
                              {notice.important && <Pin className="inline-block h-4 w-4 mr-1 text-red-500" />}
                              {notice.title}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{notice.category}</Badge>
                            </TableCell>
                            <TableCell>{notice.createdAt}</TableCell>
                            <TableCell>{notice.scheduledAt}</TableCell>
                            <TableCell>{notice.important ? "예" : "아니오"}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditNotice(notice)}>
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
            </TabsContent>
            <TabsContent value="all" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>전체 공지사항</CardTitle>
                  <CardDescription>모든 공지사항 목록입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>제목</TableHead>
                        <TableHead>카테고리</TableHead>
                        <TableHead>작성일</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>조회수</TableHead>
                        <TableHead>관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notices.map((notice) => (
                        <TableRow key={notice.id}>
                          <TableCell className="font-medium">
                            {notice.important && <Pin className="inline-block h-4 w-4 mr-1 text-red-500" />}
                            {notice.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{notice.category}</Badge>
                          </TableCell>
                          <TableCell>{notice.createdAt}</TableCell>
                          <TableCell>
                            <Badge variant={notice.status === "게시 중" ? "default" : "secondary"}>
                              {notice.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{notice.views}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditNotice(notice)}>
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
            </TabsContent>
            <TabsContent value="calendar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>공지사항 캘린더</CardTitle>
                  <CardDescription>공지사항 일정을 캘린더로 확인합니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                    </div>
                    <div className="md:w-1/2 space-y-4">
                      <h3 className="font-semibold">2025년 4월 5일 공지사항</h3>
                      <div className="space-y-2">
                        {notices
                          .filter((notice) => notice.scheduledAt === "2025-04-05")
                          .map((notice) => (
                            <div
                              key={notice.id}
                              className="flex items-center justify-between p-3 rounded-md bg-blue-50"
                            >
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                                <div>
                                  <p className="font-medium">{notice.title}</p>
                                  <p className="text-sm text-muted-foreground">게시 예정: {notice.scheduledAt}</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* 공지사항 작성 다이얼로그 */}
      <Dialog open={isAddNoticeOpen} onOpenChange={setIsAddNoticeOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>공지사항 작성</DialogTitle>
            <DialogDescription>새로운 공지사항을 작성하세요. 모든 필드는 필수입니다.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" placeholder="공지사항 제목을 입력하세요" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="시설">시설</option>
                <option value="운영">운영</option>
                <option value="교육">교육</option>
                <option value="공사">공사</option>
                <option value="행사">행사</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea id="content" placeholder="공지사항 내용을 입력하세요" rows={6} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="important" />
              <Label htmlFor="important">중요 공지사항으로 설정</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="schedule" />
              <Label htmlFor="schedule">게시 일정 예약</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledAt">게시 예정일</Label>
              <Input id="scheduledAt" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNoticeOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsAddNoticeOpen(false)}>게시</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 공지사항 수정 다이얼로그 */}
      <Dialog open={isEditNoticeOpen} onOpenChange={setIsEditNoticeOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>공지사항 수정</DialogTitle>
            <DialogDescription>공지사항 정보를 수정하세요.</DialogDescription>
          </DialogHeader>
          {selectedNotice && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">제목</Label>
                <Input id="edit-title" defaultValue={selectedNotice.title} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">카테고리</Label>
                <select
                  id="edit-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedNotice.category}
                >
                  <option value="시설">시설</option>
                  <option value="운영">운영</option>
                  <option value="교육">교육</option>
                  <option value="공사">공사</option>
                  <option value="행사">행사</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">내용</Label>
                <Textarea id="edit-content" defaultValue={selectedNotice.content} rows={6} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-important" defaultChecked={selectedNotice.important} />
                <Label htmlFor="edit-important">중요 공지사항으로 설정</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-schedule" defaultChecked={selectedNotice.scheduledAt !== null} />
                <Label htmlFor="edit-schedule">게시 일정 예약</Label>
              </div>
              {selectedNotice.scheduledAt && (
                <div className="space-y-2">
                  <Label htmlFor="edit-scheduledAt">게시 예정일</Label>
                  <Input id="edit-scheduledAt" type="date" defaultValue={selectedNotice.scheduledAt} />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditNoticeOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsEditNoticeOpen(false)}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

