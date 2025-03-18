"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react"

// 공지사항 타입 정의
interface Notice {
  id: string
  title: string
  content: string
  category: "일반" | "긴급" | "행사" | "시설" | "기타"
  author: string
  createdAt: string
  updatedAt: string
  isPinned: boolean
  viewCount: number
}

// 목업 데이터
const mockNotices: Notice[] = [
  {
    id: "1",
    title: "3월 정기 소독 안내",
    content:
      "안녕하세요. 3월 정기 소독이 다음 주 화요일에 진행될 예정입니다. 소독 시간은 오전 10시부터 오후 2시까지이며, 이 시간 동안에는 외출을 권장드립니다.",
    category: "일반",
    author: "관리사무소",
    createdAt: "2025-03-10T09:00:00",
    updatedAt: "2025-03-10T09:00:00",
    isPinned: true,
    viewCount: 245,
  },
  {
    id: "2",
    title: "엘리베이터 정기 점검 안내",
    content:
      "안녕하세요. 엘리베이터 정기 점검이 3월 15일(금)에 진행될 예정입니다. 점검 시간은 오전 9시부터 오후 12시까지이며, 이 시간 동안에는 엘리베이터 이용이 제한될 수 있습니다.",
    category: "시설",
    author: "관리사무소",
    createdAt: "2025-03-08T14:30:00",
    updatedAt: "2025-03-08T14:30:00",
    isPinned: false,
    viewCount: 187,
  },
  {
    id: "3",
    title: "주민 봄맞이 축제 개최 안내",
    content:
      "안녕하세요. 봄을 맞아 주민 화합을 위한 봄맞이 축제를 개최합니다. 일시: 3월 25일(토) 오후 2시부터 6시까지, 장소: 아파트 중앙 공원, 다양한 먹거리와 즐길거리가 준비되어 있으니 많은 참여 부탁드립니다.",
    category: "행사",
    author: "주민자치회",
    createdAt: "2025-03-05T10:15:00",
    updatedAt: "2025-03-07T11:20:00",
    isPinned: true,
    viewCount: 312,
  },
  {
    id: "4",
    title: "지하 주차장 청소 안내",
    content:
      "안녕하세요. 지하 주차장 청소가 3월 20일(수)에 진행될 예정입니다. 청소 시간은 오전 10시부터 오후 3시까지이며, 이 시간 동안에는 차량 이동이 필요합니다. 협조 부탁드립니다.",
    category: "일반",
    author: "관리사무소",
    createdAt: "2025-03-13T16:45:00",
    updatedAt: "2025-03-13T16:45:00",
    isPinned: false,
    viewCount: 156,
  },
  {
    id: "5",
    title: "긴급 수도 공사 안내",
    content:
      "안녕하세요. 단지 내 수도관 누수로 인해 긴급 수도 공사가 3월 14일(목) 오전 9시부터 오후 1시까지 진행될 예정입니다. 이 시간 동안에는 수도 사용이 제한되오니 양해 부탁드립니다.",
    category: "긴급",
    author: "관리사무소",
    createdAt: "2025-03-13T18:30:00",
    updatedAt: "2025-03-13T18:30:00",
    isPinned: true,
    viewCount: 289,
  },
]

export default function NoticeManagement() {
  const [notices, setNotices] = useState<Notice[]>(mockNotices)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)
  const [newNotice, setNewNotice] = useState<Omit<Notice, "id" | "createdAt" | "updatedAt" | "viewCount">>({
    title: "",
    content: "",
    category: "일반",
    author: "관리사무소",
    isPinned: false,
  })
  const { toast } = useToast()

  // 검색 기능
  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.includes(searchTerm) ||
      notice.content.includes(searchTerm) ||
      notice.category.includes(searchTerm) ||
      notice.author.includes(searchTerm),
  )

  // 공지사항 추가
  const handleAddNotice = () => {
    const id = (notices.length + 1).toString()
    const now = new Date().toISOString()
    const noticeToAdd = {
      id,
      ...newNotice,
      createdAt: now,
      updatedAt: now,
      viewCount: 0,
    }
    setNotices([...notices, noticeToAdd])
    setIsAddDialogOpen(false)
    setNewNotice({
      title: "",
      content: "",
      category: "일반",
      author: "관리사무소",
      isPinned: false,
    })
    toast({
      title: "공지사항 추가 완료",
      description: `"${noticeToAdd.title}" 공지사항이 추가되었습니다.`,
    })
  }

  // 공지사항 수정
  const handleEditNotice = () => {
    if (!selectedNotice) return

    const now = new Date().toISOString()
    const updatedNotice = {
      ...selectedNotice,
      updatedAt: now,
    }

    const updatedNotices = notices.map((notice) => (notice.id === selectedNotice.id ? updatedNotice : notice))

    setNotices(updatedNotices)
    setIsEditDialogOpen(false)
    setSelectedNotice(null)

    toast({
      title: "공지사항 수정 완료",
      description: `"${updatedNotice.title}" 공지사항이 수정되었습니다.`,
    })
  }

  // 공지사항 삭제
  const handleDeleteNotice = (id: string) => {
    const noticeToDelete = notices.find((notice) => notice.id === id)
    if (!noticeToDelete) return

    const updatedNotices = notices.filter((notice) => notice.id !== id)
    setNotices(updatedNotices)

    toast({
      title: "공지사항 삭제 완료",
      description: `"${noticeToDelete.title}" 공지사항이 삭제되었습니다.`,
      variant: "destructive",
    })
  }

  // 공지사항 상세 보기
  const handleViewNotice = (notice: Notice) => {
    setSelectedNotice(notice)
    setIsViewDialogOpen(true)
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>공지사항 관리</CardTitle>
            <CardDescription>아파트 공지사항 등록 및 관리</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                공지사항 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>새 공지사항 등록</DialogTitle>
                <DialogDescription>새로운 공지사항을 작성해주세요.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    제목
                  </Label>
                  <Input
                    id="title"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    카테고리
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setNewNotice({ ...newNotice, category: value as "일반" | "긴급" | "행사" | "시설" | "기타" })
                    }
                    defaultValue={newNotice.category}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="일반">일반</SelectItem>
                      <SelectItem value="긴급">긴급</SelectItem>
                      <SelectItem value="행사">행사</SelectItem>
                      <SelectItem value="시설">시설</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="author" className="text-right">
                    작성자
                  </Label>
                  <Input
                    id="author"
                    value={newNotice.author}
                    onChange={(e) => setNewNotice({ ...newNotice, author: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="content" className="text-right pt-2">
                    내용
                  </Label>
                  <Textarea
                    id="content"
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                    className="col-span-3"
                    rows={10}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isPinned" className="text-right">
                    상단 고정
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <input
                      type="checkbox"
                      id="isPinned"
                      checked={newNotice.isPinned}
                      onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="isPinned" className="text-sm font-normal">
                      이 공지사항을 상단에 고정합니다
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddNotice}>
                  등록하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="제목, 내용, 카테고리로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">상태</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>작성자</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead>조회수</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotices.map((notice) => (
                  <TableRow key={notice.id}>
                    <TableCell>
                      {notice.isPinned && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">고정</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <button className="hover:underline text-left" onClick={() => handleViewNotice(notice)}>
                        {notice.title}
                      </button>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notice.category === "긴급"
                            ? "bg-red-100 text-red-800"
                            : notice.category === "행사"
                              ? "bg-blue-100 text-blue-800"
                              : notice.category === "시설"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {notice.category}
                      </span>
                    </TableCell>
                    <TableCell>{notice.author}</TableCell>
                    <TableCell>{formatDate(notice.createdAt)}</TableCell>
                    <TableCell>{notice.viewCount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleViewNotice(notice)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">보기</span>
                      </Button>
                      <Dialog
                        open={isEditDialogOpen && selectedNotice?.id === notice.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open)
                          if (!open) setSelectedNotice(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedNotice(notice)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">수정</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>공지사항 수정</DialogTitle>
                            <DialogDescription>공지사항 내용을 수정해주세요.</DialogDescription>
                          </DialogHeader>
                          {selectedNotice && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-title" className="text-right">
                                  제목
                                </Label>
                                <Input
                                  id="edit-title"
                                  value={selectedNotice.title}
                                  onChange={(e) => setSelectedNotice({ ...selectedNotice, title: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-category" className="text-right">
                                  카테고리
                                </Label>
                                <Select
                                  onValueChange={(value) =>
                                    setSelectedNotice({
                                      ...selectedNotice,
                                      category: value as "일반" | "긴급" | "행사" | "시설" | "기타",
                                    })
                                  }
                                  defaultValue={selectedNotice.category}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="카테고리 선택" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="일반">일반</SelectItem>
                                    <SelectItem value="긴급">긴급</SelectItem>
                                    <SelectItem value="행사">행사</SelectItem>
                                    <SelectItem value="시설">시설</SelectItem>
                                    <SelectItem value="기타">기타</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-author" className="text-right">
                                  작성자
                                </Label>
                                <Input
                                  id="edit-author"
                                  value={selectedNotice.author}
                                  onChange={(e) => setSelectedNotice({ ...selectedNotice, author: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="edit-content" className="text-right pt-2">
                                  내용
                                </Label>
                                <Textarea
                                  id="edit-content"
                                  value={selectedNotice.content}
                                  onChange={(e) => setSelectedNotice({ ...selectedNotice, content: e.target.value })}
                                  className="col-span-3"
                                  rows={10}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-isPinned" className="text-right">
                                  상단 고정
                                </Label>
                                <div className="flex items-center space-x-2 col-span-3">
                                  <input
                                    type="checkbox"
                                    id="edit-isPinned"
                                    checked={selectedNotice.isPinned}
                                    onChange={(e) =>
                                      setSelectedNotice({ ...selectedNotice, isPinned: e.target.checked })
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                  <Label htmlFor="edit-isPinned" className="text-sm font-normal">
                                    이 공지사항을 상단에 고정합니다
                                  </Label>
                                </div>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button type="submit" onClick={handleEditNotice}>
                              저장하기
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteNotice(notice.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">삭제</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">총 {filteredNotices.length}개의 공지사항</div>
      </CardFooter>

      {/* 공지사항 상세 보기 다이얼로그 */}
      {selectedNotice && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedNotice.category === "긴급"
                      ? "bg-red-100 text-red-800"
                      : selectedNotice.category === "행사"
                        ? "bg-blue-100 text-blue-800"
                        : selectedNotice.category === "시설"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedNotice.category}
                </span>
                <DialogTitle className="text-xl">{selectedNotice.title}</DialogTitle>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>작성자: {selectedNotice.author}</span>
                <span>등록일: {formatDate(selectedNotice.createdAt)}</span>
              </div>
            </DialogHeader>
            <div className="py-4 border-t border-b my-4">
              <div className="whitespace-pre-line">{selectedNotice.content}</div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>조회수: {selectedNotice.viewCount}</span>
              {selectedNotice.updatedAt !== selectedNotice.createdAt && (
                <span>최종 수정일: {formatDate(selectedNotice.updatedAt)}</span>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}

