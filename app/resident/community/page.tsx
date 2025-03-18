"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, ThumbsUp, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Post {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  category: string
  createdAt: string
  comments: Comment[]
}

interface Comment {
  id: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
}

export default function CommunityPage() {
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "일반",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/community/posts")
        if (!response.ok) {
          throw new Error("게시글을 가져오는데 실패했습니다.")
        }
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error("Error fetching posts:", error)
        toast({
          title: "오류",
          description: "게시글을 가져오는데 실패했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [toast])

  // 새 게시글 작성 처리
  const handleSubmitPost = async () => {
    if (!newPost.title || !newPost.content) {
      toast({
        title: "오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      })

      if (!response.ok) {
        throw new Error("게시글 작성에 실패했습니다.")
      }

      const newPostData = await response.json()
      setPosts((prev) => [newPostData, ...prev])

      toast({
        title: "게시글 작성 완료",
        description: "게시글이 성공적으로 작성되었습니다.",
      })

      // 폼 초기화
      setNewPost({
        title: "",
        content: "",
        category: "일반",
      })
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "게시글 작성 실패",
        description: error instanceof Error ? error.message : "게시글 작성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 게시글 필터링
  const filteredPosts = activeTab === "all" ? posts : posts.filter((post) => post.category === activeTab)

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
            <h1 className="text-2xl font-bold">커뮤니티</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>글쓰기</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>새 게시글 작성</DialogTitle>
                  <DialogDescription>
                    커뮤니티에 새 게시글을 작성합니다. 모든 입주민이 볼 수 있습니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-category">카테고리</Label>
                    <select
                      id="post-category"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    >
                      <option value="일반">일반</option>
                      <option value="질문">질문</option>
                      <option value="정보공유">정보공유</option>
                      <option value="중고거래">중고거래</option>
                      <option value="모임">모임</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="post-title">제목</Label>
                    <Input
                      id="post-title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="제목을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="post-content">내용</Label>
                    <Textarea
                      id="post-content"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="내용을 입력하세요"
                      rows={8}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSubmitPost} disabled={isSubmitting}>
                    {isSubmitting ? "게시 중..." : "게시하기"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="일반">일반</TabsTrigger>
              <TabsTrigger value="질문">질문</TabsTrigger>
              <TabsTrigger value="정보공유">정보공유</TabsTrigger>
              <TabsTrigger value="중고거래">중고거래</TabsTrigger>
              <TabsTrigger value="모임">모임</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>게시글을 불러오는 중...</p>
                </div>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                              {post.category}
                            </span>
                            <CardTitle className="text-lg">{post.title}</CardTitle>
                          </div>
                          <CardDescription className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{post.authorName}</span>
                            <span className="mx-1">•</span>
                            <span>{formatDate(post.createdAt)}</span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{post.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>좋아요</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>댓글 {post.comments.length}</span>
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">
                        자세히 보기
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg mb-2">게시글이 없습니다</h3>
                  <p className="text-muted-foreground mb-4">이 카테고리에 첫 번째 게시글을 작성해보세요!</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>글쓰기</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      {/* 글쓰기 다이얼로그 내용 (위와 동일) */}
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

