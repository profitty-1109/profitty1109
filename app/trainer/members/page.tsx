"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Edit, MoreHorizontal, Search, Trash2, User, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  age: number
  gender: string
  joinDate: string
  membershipType: string
  membershipExpiry: string
  trainerId: string
  goals: string
  healthInfo: {
    height: number
    weight: number
    bodyFatPercentage: number
    medicalConditions: string
    injuries: string
  }
  notes: string
  attendanceRate: number
  progressRate: number
}

export default function MembersPage() {
  const { toast } = useToast()
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(null)

  // 새 회원 폼 상태
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    age: 30,
    gender: "남성",
    membershipType: "1개월 회원권",
    membershipExpiry: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), "yyyy-MM-dd"),
    goals: "",
    healthInfo: {
      height: 170,
      weight: 70,
      bodyFatPercentage: 20,
      medicalConditions: "",
      injuries: "",
    },
    notes: "",
  })

  // 로컬 스토리지에서 인증 토큰 가져오기
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setAuthToken(token)
    }
  }, [])

  // 회원 데이터 가져오기
  const fetchMembers = async () => {
    try {
      setIsLoading(true)

      // API 요청 URL 구성
      let url = "/api/members"
      if (authToken) {
        url += `?token=${authToken}`
      }

      console.log("Fetching members from:", url)

      const response = await fetch(url, {
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        // 쿠키를 포함하도록 설정
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
            window.location.href = "/login?redirect=/trainer/members"
          }, 3000)

          return
        }

        throw new Error(errorData.error || "회원 정보를 가져오는데 실패했습니다.")
      }

      const data = await response.json()
      console.log("가져온 회원 데이터:", data)
      setMembers(data)
      setFilteredMembers(data)
    } catch (error) {
      console.error("Error fetching members:", error)
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "회원 정보를 가져오는데 실패했습니다.",
        variant: "destructive",
      })
      // 오류 발생 시 빈 배열로 설정하여 UI가 깨지지 않도록 함
      setMembers([])
      setFilteredMembers([])
    } finally {
      setIsLoading(false)
    }
  }

  // 회원 데이터 가져오기
  useEffect(() => {
    fetchMembers()
  }, [toast, authToken]) // authToken을 의존성 배열에 추가

  // 검색 필터링
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMembers(members)
    } else {
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.phone.includes(searchQuery),
      )
      setFilteredMembers(filtered)
    }
  }, [searchQuery, members])

  // 회원 추가 처리
  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "오류",
        description: "이름과 이메일은 필수 입력 항목입니다.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
        body: JSON.stringify(newMember),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "회원 추가에 실패했습니다.")
      }

      const createdMember = await response.json()
      setMembers((prev) => [...prev, createdMember])

      toast({
        title: "회원 추가 완료",
        description: `${newMember.name} 회원이 추가되었습니다.`,
      })

      // 폼 초기화 및 다이얼로그 닫기
      setNewMember({
        name: "",
        email: "",
        phone: "",
        age: 30,
        gender: "남성",
        membershipType: "1개월 회원권",
        membershipExpiry: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), "yyyy-MM-dd"),
        goals: "",
        healthInfo: {
          height: 170,
          weight: 70,
          bodyFatPercentage: 20,
          medicalConditions: "",
          injuries: "",
        },
        notes: "",
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding member:", error)
      toast({
        title: "회원 추가 실패",
        description: error instanceof Error ? error.message : "회원 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 회원 수정 처리
  const handleEditMember = async () => {
    if (!selectedMember) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/members", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
        body: JSON.stringify(selectedMember),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "회원 정보 수정에 실패했습니다.")
      }

      const updatedMember = await response.json()
      setMembers((prev) => prev.map((member) => (member.id === updatedMember.id ? updatedMember : member)))

      toast({
        title: "회원 정보 수정 완료",
        description: `${updatedMember.name} 회원 정보가 수정되었습니다.`,
      })

      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating member:", error)
      toast({
        title: "회원 정보 수정 실패",
        description: error instanceof Error ? error.message : "회원 정보 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 회원 삭제 처리
  const handleDeleteMember = async () => {
    if (!selectedMember) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/members?id=${selectedMember.id}`, {
        method: "DELETE",
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "회원 삭제에 실패했습니다.")
      }

      setMembers((prev) => prev.filter((member) => member.id !== selectedMember.id))

      toast({
        title: "회원 삭제 완료",
        description: `${selectedMember.name} 회원이 삭제되었습니다.`,
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting member:", error)
      toast({
        title: "회원 삭제 실패",
        description: error instanceof Error ? error.message : "회원 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "yyyy년 MM월 dd일", { locale: ko })
    } catch (error) {
      return dateString
    }
  }

  // 회원권 만료 상태 확인
  const getMembershipStatus = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)

    if (expiry < today) {
      return <Badge variant="destructive">만료됨</Badge>
    }

    const diffTime = Math.abs(expiry.getTime() - today.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 7) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          만료 임박 ({diffDays}일)
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
        유효
      </Badge>
    )
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
            <h1 className="text-2xl font-bold">회원 관리</h1>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              회원 추가
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="회원 검색..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  정렬
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>정렬 기준</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setMembers([...members].sort((a, b) => a.name.localeCompare(b.name)))}>
                  이름 (오름차순)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMembers([...members].sort((a, b) => b.name.localeCompare(a.name)))}>
                  이름 (내림차순)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setMembers(
                      [...members].sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()),
                    )
                  }
                >
                  최근 가입순
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setMembers(
                      [...members].sort((a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()),
                    )
                  }
                >
                  오래된 가입순
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setMembers([...members].sort((a, b) => b.attendanceRate - a.attendanceRate))}
                >
                  출석률 높은순
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">전체 회원</TabsTrigger>
              <TabsTrigger value="active">활성 회원</TabsTrigger>
              <TabsTrigger value="expired">만료 회원</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>회원 정보를 불러오는 중...</p>
                </div>
              ) : filteredMembers.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMembers.map((member) => (
                    <Card key={member.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <User className="h-5 w-5 mr-2 text-primary" />
                              {member.name}
                            </CardTitle>
                            <CardDescription>{member.email}</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>회원 관리</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMember(member)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                정보 수정
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMember(member)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                회원 삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">연락처:</span>
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">가입일:</span>
                            <span>{formatDate(member.joinDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">회원권:</span>
                            <span>{member.membershipType}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">만료일:</span>
                            <div className="flex items-center">
                              <span className="mr-2">{formatDate(member.membershipExpiry)}</span>
                              {getMembershipStatus(member.membershipExpiry)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">출석률</span>
                          <span className="font-medium">{member.attendanceRate}%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">진행률</span>
                          <span className="font-medium">{member.progressRate}%</span>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          상세 정보
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <User className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg mb-2">회원이 없습니다</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "검색 결과가 없습니다. 다른 검색어를 입력해보세요." : "새 회원을 추가해보세요!"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      회원 추가
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="active">
              {/* 활성 회원 필터링 */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMembers
                  .filter((member) => new Date(member.membershipExpiry) >= new Date())
                  .map((member) => (
                    <Card key={member.id} className="overflow-hidden">
                      {/* 카드 내용은 위와 동일 */}
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <User className="h-5 w-5 mr-2 text-primary" />
                              {member.name}
                            </CardTitle>
                            <CardDescription>{member.email}</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>회원 관리</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMember(member)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                정보 수정
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMember(member)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                회원 삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">연락처:</span>
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">가입일:</span>
                            <span>{formatDate(member.joinDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">회원권:</span>
                            <span>{member.membershipType}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">만료일:</span>
                            <div className="flex items-center">
                              <span className="mr-2">{formatDate(member.membershipExpiry)}</span>
                              {getMembershipStatus(member.membershipExpiry)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">출석률</span>
                          <span className="font-medium">{member.attendanceRate}%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">진행률</span>
                          <span className="font-medium">{member.progressRate}%</span>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          상세 정보
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="expired">
              {/* 만료 회원 필터링 */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMembers
                  .filter((member) => new Date(member.membershipExpiry) < new Date())
                  .map((member) => (
                    <Card key={member.id} className="overflow-hidden">
                      {/* 카드 내용은 위와 동일 */}
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <User className="h-5 w-5 mr-2 text-primary" />
                              {member.name}
                            </CardTitle>
                            <CardDescription>{member.email}</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>회원 관리</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMember(member)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                정보 수정
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMember(member)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                회원 삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">연락처:</span>
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">가입일:</span>
                            <span>{formatDate(member.joinDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">회원권:</span>
                            <span>{member.membershipType}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">만료일:</span>
                            <div className="flex items-center">
                              <span className="mr-2">{formatDate(member.membershipExpiry)}</span>
                              {getMembershipStatus(member.membershipExpiry)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">출석률</span>
                          <span className="font-medium">{member.attendanceRate}%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">진행률</span>
                          <span className="font-medium">{member.progressRate}%</span>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          상세 정보
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* 회원 추가 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>새 회원 추가</DialogTitle>
            <DialogDescription>
              새로운 회원 정보를 입력하세요. 별표(*)가 표시된 항목은 필수 입력 사항입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="이메일을 입력하세요"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input
                  id="phone"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  placeholder="연락처를 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">나이</Label>
                <Input
                  id="age"
                  type="number"
                  value={newMember.age}
                  onChange={(e) => setNewMember({ ...newMember, age: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">성별</Label>
                <select
                  id="gender"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newMember.gender}
                  onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
                >
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="membershipType">회원권 종류</Label>
                <select
                  id="membershipType"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newMember.membershipType}
                  onChange={(e) => setNewMember({ ...newMember, membershipType: e.target.value })}
                >
                  <option value="1개월 회원권">1개월 회원권</option>
                  <option value="3개월 회원권">3개월 회원권</option>
                  <option value="6개월 회원권">6개월 회원권</option>
                  <option value="1년 회원권">1년 회원권</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="membershipExpiry">회원권 만료일</Label>
              <Input
                id="membershipExpiry"
                type="date"
                value={newMember.membershipExpiry}
                onChange={(e) => setNewMember({ ...newMember, membershipExpiry: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">키 (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={newMember.healthInfo.height}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      healthInfo: { ...newMember.healthInfo, height: Number(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">체중 (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={newMember.healthInfo.weight}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      healthInfo: { ...newMember.healthInfo, weight: Number(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyFatPercentage">체지방률 (%)</Label>
                <Input
                  id="bodyFatPercentage"
                  type="number"
                  value={newMember.healthInfo.bodyFatPercentage}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      healthInfo: { ...newMember.healthInfo, bodyFatPercentage: Number(e.target.value) },
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">운동 목표</Label>
              <Textarea
                id="goals"
                value={newMember.goals}
                onChange={(e) => setNewMember({ ...newMember, goals: e.target.value })}
                placeholder="회원의 운동 목표를 입력하세요"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicalConditions">건강 상태</Label>
                <Textarea
                  id="medicalConditions"
                  value={newMember.healthInfo.medicalConditions}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      healthInfo: { ...newMember.healthInfo, medicalConditions: e.target.value },
                    })
                  }
                  placeholder="특이사항이 있으면 입력하세요"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="injuries">부상 이력</Label>
                <Textarea
                  id="injuries"
                  value={newMember.healthInfo.injuries}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      healthInfo: { ...newMember.healthInfo, injuries: e.target.value },
                    })
                  }
                  placeholder="부상 이력이 있으면 입력하세요"
                  rows={3}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">메모</Label>
              <Textarea
                id="notes"
                value={newMember.notes}
                onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
                placeholder="추가 메모 사항을 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddMember} disabled={isSubmitting}>
              {isSubmitting ? "추가 중..." : "회원 추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 회원 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>회원 정보 수정</DialogTitle>
            <DialogDescription>회원 정보를 수정하세요. 별표(*)가 표시된 항목은 필수 입력 사항입니다.</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">이름 *</Label>
                  <Input
                    id="edit-name"
                    value={selectedMember.name}
                    onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">이메일 *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedMember.email}
                    onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })}
                    placeholder="이메일을 입력하세요"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">연락처</Label>
                  <Input
                    id="edit-phone"
                    value={selectedMember.phone}
                    onChange={(e) => setSelectedMember({ ...selectedMember, phone: e.target.value })}
                    placeholder="연락처를 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-age">나이</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={selectedMember.age}
                    onChange={(e) => setSelectedMember({ ...selectedMember, age: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">성별</Label>
                  <select
                    id="edit-gender"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedMember.gender}
                    onChange={(e) => setSelectedMember({ ...selectedMember, gender: e.target.value })}
                  >
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-membershipType">회원권 종류</Label>
                  <select
                    id="edit-membershipType"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedMember.membershipType}
                    onChange={(e) => setSelectedMember({ ...selectedMember, membershipType: e.target.value })}
                  >
                    <option value="1개월 회원권">1개월 회원권</option>
                    <option value="3개월 회원권">3개월 회원권</option>
                    <option value="6개월 회원권">6개월 회원권</option>
                    <option value="1년 회원권">1년 회원권</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-membershipExpiry">회원권 만료일</Label>
                <Input
                  id="edit-membershipExpiry"
                  type="date"
                  value={selectedMember.membershipExpiry.split("T")[0]}
                  onChange={(e) => setSelectedMember({ ...selectedMember, membershipExpiry: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-height">키 (cm)</Label>
                  <Input
                    id="edit-height"
                    type="number"
                    value={selectedMember.healthInfo.height}
                    onChange={(e) =>
                      setSelectedMember({
                        ...selectedMember,
                        healthInfo: { ...selectedMember.healthInfo, height: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-weight">체중 (kg)</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    value={selectedMember.healthInfo.weight}
                    onChange={(e) =>
                      setSelectedMember({
                        ...selectedMember,
                        healthInfo: { ...selectedMember.healthInfo, weight: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-bodyFatPercentage">체지방률 (%)</Label>
                  <Input
                    id="edit-bodyFatPercentage"
                    type="number"
                    value={selectedMember.healthInfo.bodyFatPercentage}
                    onChange={(e) =>
                      setSelectedMember({
                        ...selectedMember,
                        healthInfo: { ...selectedMember.healthInfo, bodyFatPercentage: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-goals">운동 목표</Label>
                <Textarea
                  id="edit-goals"
                  value={selectedMember.goals}
                  onChange={(e) => setSelectedMember({ ...selectedMember, goals: e.target.value })}
                  placeholder="회원의 운동 목표를 입력하세요"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-medicalConditions">건강 상태</Label>
                  <Textarea
                    id="edit-medicalConditions"
                    value={selectedMember.healthInfo.medicalConditions}
                    onChange={(e) =>
                      setSelectedMember({
                        ...selectedMember,
                        healthInfo: { ...selectedMember.healthInfo, medicalConditions: e.target.value },
                      })
                    }
                    placeholder="특이사항이 있으면 입력하세요"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-injuries">부상 이력</Label>
                  <Textarea
                    id="edit-injuries"
                    value={selectedMember.healthInfo.injuries}
                    onChange={(e) =>
                      setSelectedMember({
                        ...selectedMember,
                        healthInfo: { ...selectedMember.healthInfo, injuries: e.target.value },
                      })
                    }
                    placeholder="부상 이력이 있으면 입력하세요"
                    rows={3}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">메모</Label>
                <Textarea
                  id="edit-notes"
                  value={selectedMember.notes}
                  onChange={(e) => setSelectedMember({ ...selectedMember, notes: e.target.value })}
                  placeholder="추가 메모 사항을 입력하세요"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEditMember} disabled={isSubmitting}>
              {isSubmitting ? "수정 중..." : "저장하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 회원 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>회원 삭제</DialogTitle>
            <DialogDescription>정말로 이 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="py-4">
              <p className="mb-2">
                <span className="font-medium">{selectedMember.name}</span> 회원을 삭제합니다.
              </p>
              <p className="text-sm text-muted-foreground">
                이 회원과 관련된 모든 데이터(운동 기록, 루틴 할당 등)가 함께 삭제됩니다.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember} disabled={isSubmitting}>
              {isSubmitting ? "삭제 중..." : "삭제 확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

