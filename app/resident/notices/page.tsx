"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, FileText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface Notice {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
  important: boolean
}

export default function NoticesPage() {
  const { toast } = useToast()
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // 공지사항 데이터 가져오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch("/api/notices")
        if (!response.ok) {
          throw new Error("공지사항을 가져오는데 실패했습니다.")
        }
        const data = await response.json()
        setNotices(data)
      } catch (error) {
        console.error("Error fetching notices:", error)
        toast({
          title: "오류",
          description: "공지사항을 가져오는데 실패했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotices()
  }, [toast])

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // 검색 필터링
  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // 중요 공지사항을 상단에 표시
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.important && !b.important) return -1
    if (!a.important && b.important) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

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
            <h1 className="text-2xl font-bold">공지사항</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="공지사항 검색..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>공지사항을 불러오는 중...</p>
              </div>
            ) : sortedNotices.length > 0 ? (
              sortedNotices.map((notice) => (
                <Card key={notice.id} className={notice.important ? "border-2 border-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {notice.important && <Badge className="bg-primary">중요</Badge>}
                          <CardTitle>{notice.title}</CardTitle>
                        </div>
                        <CardDescription>
                          {notice.authorName} • {formatDate(notice.createdAt)}
                        </CardDescription>
                      </div>
                      {notice.important && <Bell className="h-5 w-5 text-primary" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{notice.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg mb-2">공지사항이 없습니다</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "검색 결과가 없습니다. 다른 검색어를 입력해보세요."
                    : "아직 등록된 공지사항이 없습니다."}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

