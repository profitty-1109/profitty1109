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
import { ChevronDown, Dumbbell, Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"

interface Exercise {
  name: string
  sets?: number
  reps?: string
  description?: string
}

interface Routine {
  id: string
  name: string
  trainerId: string
  targetGroup: string
  description: string
  duration: number
  difficulty: string
  category: string
  exercises: Exercise[]
  notes: string
  createdAt: string
  updatedAt: string
}

export default function RoutinesPage() {
  const { toast } = useToast()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 새 운동 루틴 폼 상태
  const [newRoutine, setNewRoutine] = useState({
    name: "",
    targetGroup: "초보자",
    description: "",
    duration: 60,
    difficulty: "쉬움",
    category: "전신",
    exercises: [] as Exercise[],
    notes: "",
  })

  // 새 운동 폼 상태
  const [newExercise, setNewExercise] = useState<Exercise>({
    name: "",
    sets: 3,
    reps: "10회",
    description: "",
  })

  // 로그인 시 저장된 인증 토큰 가져오기
  const [authToken, setAuthToken] = useState<string | null>(null)

  // 루틴 데이터 가져오기
  const fetchRoutines = async () => {
    try {
      setIsLoading(true)

      // 로컬 스토리지에서 인증 토큰 가져오기
      const authToken = localStorage.getItem("authToken")

      // API 요청 URL 구성
      let url = "/api/routines"
      if (authToken) {
        url += `?token=${authToken}`
      }

      console.log("Fetching routines from:", url)

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
            window.location.href = "/login?redirect=/trainer/routines"
          }, 3000)

          return
        }

        throw new Error(errorData.error || "운동 루틴 정보를 가져오는데 실패했습니다.")
      }

      const data = await response.json()
      console.log("가져온 루틴 데이터:", data)
      setRoutines(data)
      setFilteredRoutines(data)
    } catch (error) {
      console.error("Error fetching routines:", error)
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "운동 루틴 정보를 가져오는데 실패했습니다.",
        variant: "destructive",
      })
      // 오류 발생 시 빈 배열로 설정하여 UI가 깨지지 않도록 함
      setRoutines([])
      setFilteredRoutines([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // 로컬 스토리지에서 인증 토큰 가져오기
    const token = localStorage.getItem("authToken")
    if (token) {
      setAuthToken(token)
    }
  }, [])

  // 루틴 데이터 가져오기
  useEffect(() => {
    fetchRoutines()
  }, [toast, authToken]) // authToken을 의존성 배열에 추가

  // 검색 필터링
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRoutines(routines)
    } else {
      const filtered = routines.filter(
        (routine) =>
          routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          routine.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          routine.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredRoutines(filtered)
    }
  }, [searchQuery, routines])

  // 운동 추가 처리
  const handleAddExercise = () => {
    if (!newExercise.name) {
      toast({
        title: "오류",
        description: "운동 이름은 필수 입력 항목입니다.",
        variant: "destructive",
      })
      return
    }

    if (isEditDialogOpen && selectedRoutine) {
      setSelectedRoutine({
        ...selectedRoutine,
        exercises: [...selectedRoutine.exercises, newExercise],
      })
    } else {
      setNewRoutine({
        ...newRoutine,
        exercises: [...newRoutine.exercises, newExercise],
      })
    }

    // 운동 폼 초기화
    setNewExercise({
      name: "",
      sets: 3,
      reps: "10회",
      description: "",
    })
  }

  // 운동 삭제 처리
  const handleRemoveExercise = (index: number) => {
    if (isEditDialogOpen && selectedRoutine) {
      const updatedExercises = [...selectedRoutine.exercises]
      updatedExercises.splice(index, 1)
      setSelectedRoutine({
        ...selectedRoutine,
        exercises: updatedExercises,
      })
    } else {
      const updatedExercises = [...newRoutine.exercises]
      updatedExercises.splice(index, 1)
      setNewRoutine({
        ...newRoutine,
        exercises: updatedExercises,
      })
    }
  }

  // 루틴 추가 처리
  const handleAddRoutine = async () => {
    if (!newRoutine.name || newRoutine.exercises.length === 0) {
      toast({
        title: "오류",
        description: "루틴 이름과 최소 1개 이상의 운동이 필요합니다.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/routines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoutine),
      })

      if (!response.ok) {
        throw new Error("운동 루틴 추가에 실패했습니다.")
      }

      const createdRoutine = await response.json()
      setRoutines((prev) => [...prev, createdRoutine])

      toast({
        title: "루틴 추가 완료",
        description: `${newRoutine.name} 루틴이 추가되었습니다.`,
      })

      // 폼 초기화 및 다이얼로그 닫기
      setNewRoutine({
        name: "",
        targetGroup: "초보자",
        description: "",
        duration: 60,
        difficulty: "쉬움",
        category: "전신",
        exercises: [],
        notes: "",
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding routine:", error)
      toast({
        title: "루틴 추가 실패",
        description: error instanceof Error ? error.message : "운동 루틴 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 루틴 수정 처리
  const handleEditRoutine = async () => {
    if (!selectedRoutine) return

    if (!selectedRoutine.name || selectedRoutine.exercises.length === 0) {
      toast({
        title: "오류",
        description: "루틴 이름과 최소 1개 이상의 운동이 필요합니다.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/routines", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedRoutine),
      })

      if (!response.ok) {
        throw new Error("운동 루틴 수정에 실패했습니다.")
      }

      const updatedRoutine = await response.json()
      setRoutines((prev) => prev.map((routine) => (routine.id === updatedRoutine.id ? updatedRoutine : routine)))

      toast({
        title: "루틴 수정 완료",
        description: `${updatedRoutine.name} 루틴이 수정되었습니다.`,
      })

      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating routine:", error)
      toast({
        title: "루틴 수정 실패",
        description: error instanceof Error ? error.message : "운동 루틴 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 루틴 삭제 처리
  const handleDeleteRoutine = async () => {
    if (!selectedRoutine) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/routines?id=${selectedRoutine.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("운동 루틴 삭제에 실패했습니다.")
      }

      setRoutines((prev) => prev.filter((routine) => routine.id !== selectedRoutine.id))

      toast({
        title: "루틴 삭제 완료",
        description: `${selectedRoutine.name} 루틴이 삭제되었습니다.`,
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting routine:", error)
      toast({
        title: "루틴 삭제 실패",
        description: error instanceof Error ? error.message : "운동 루틴 삭제 중 오류가 발생했습니다.",
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

  // 난이도에 따른 배지 색상
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "쉬움":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            쉬움
          </Badge>
        )
      case "중간":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            중간
          </Badge>
        )
      case "어려움":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            어려움
          </Badge>
        )
      case "매우 어려움":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            매우 어려움
          </Badge>
        )
      default:
        return <Badge variant="outline">{difficulty}</Badge>
    }
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
            <h1 className="text-2xl font-bold">운동 루틴 관리</h1>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              루틴 추가
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="루틴 검색..."
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
                <DropdownMenuItem
                  onClick={() => setRoutines([...routines].sort((a, b) => a.name.localeCompare(b.name)))}
                >
                  이름 (오름차순)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setRoutines([...routines].sort((a, b) => b.name.localeCompare(a.name)))}
                >
                  이름 (내림차순)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setRoutines(
                      [...routines].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
                    )
                  }
                >
                  최근 수정순
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoutines([...routines].sort((a, b) => a.duration - b.duration))}>
                  소요 시간 (짧은순)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoutines([...routines].sort((a, b) => b.duration - a.duration))}>
                  소요 시간 (긴순)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">전체 루틴</TabsTrigger>
              <TabsTrigger value="beginner">초보자</TabsTrigger>
              <TabsTrigger value="intermediate">중급자</TabsTrigger>
              <TabsTrigger value="advanced">고급자</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>루틴 정보를 불러오는 중...</p>
                </div>
              ) : filteredRoutines.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredRoutines.map((routine) => (
                    <Card key={routine.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <Dumbbell className="h-5 w-5 mr-2 text-primary" />
                              {routine.name}
                            </CardTitle>
                            <CardDescription>{routine.targetGroup} 대상</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>루틴 관리</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRoutine(routine)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                루틴 수정
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRoutine(routine)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                루틴 삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <p className="line-clamp-2 text-muted-foreground">{routine.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">난이도:</span>
                            <div>{getDifficultyBadge(routine.difficulty)}</div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">카테고리:</span>
                            <span>{routine.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">소요 시간:</span>
                            <span>{routine.duration}분</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">운동 수:</span>
                            <span>{routine.exercises.length}개</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="text-xs text-muted-foreground">
                          마지막 수정: {formatDate(routine.updatedAt)}
                        </div>
                        <Button variant="outline" size="sm">
                          상세 보기
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Dumbbell className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg mb-2">루틴이 없습니다</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "검색 결과가 없습니다. 다른 검색어를 입력해보세요." : "새 운동 루틴을 추가해보세요!"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      루틴 추가
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="beginner">
              {/* 초보자 루틴 필터링 */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRoutines
                  .filter((routine) => routine.targetGroup === "초보자")
                  .map((routine) => (
                    <Card key={routine.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <Dumbbell className="h-5 w-5 mr-2 text-primary" />
                              {routine.name}
                            </CardTitle>
                            <CardDescription>{routine.targetGroup} 대상</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>루틴 관리</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRoutine(routine)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                루틴 수정
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRoutine(routine)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                루틴 삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <p className="line-clamp-2 text-muted-foreground">{routine.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">난이도:</span>
                            <div>{getDifficultyBadge(routine.difficulty)}</div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">카테고리:</span>
                            <span>{routine.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">소요 시간:</span>
                            <span>{routine.duration}분</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">운동 수:</span>
                            <span>{routine.exercises.length}개</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="text-xs text-muted-foreground">
                          마지막 수정: {formatDate(routine.updatedAt)}
                        </div>
                        <Button variant="outline" size="sm">
                          상세 보기
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="intermediate">
              {/* 중급자 루틴 필터링 */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRoutines
                  .filter((routine) => routine.targetGroup === "중급자")
                  .map((routine) => (
                    <Card key={routine.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <Dumbbell className="h-5 w-5 mr-2 text-primary" />
                              {routine.name}
                            </CardTitle>
                            <CardDescription>{routine.targetGroup} 대상</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>루틴 관리</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRoutine(routine)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                루틴 수정
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRoutine(routine)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                루틴 삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <p className="line-clamp-2 text-muted-foreground">{routine.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">난이도:</span>
                            <div>{getDifficultyBadge(routine.difficulty)}</div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">카테고리:</span>
                            <span>{routine.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">소요 시간:</span>
                            <span>{routine.duration}분</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">운동 수:</span>
                            <span>{routine.exercises.length}개</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="text-xs text-muted-foreground">
                          마지막 수정: {formatDate(routine.updatedAt)}
                        </div>
                        <Button variant="outline" size="sm">
                          상세 보기
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="advanced">
              {/* 고급자 루틴 필터링 */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRoutines
                  .filter((routine) => routine.targetGroup === "고급자")
                  .map((routine) => (
                    <Card key={routine.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <Dumbbell className="h-5 w-5 mr-2 text-primary" />
                              {routine.name}
                            </CardTitle>
                            <CardDescription>{routine.targetGroup} 대상</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>루틴 관리</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRoutine(routine)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                루틴 수정
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRoutine(routine)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                루틴 삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <p className="line-clamp-2 text-muted-foreground">{routine.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">난이도:</span>
                            <div>{getDifficultyBadge(routine.difficulty)}</div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">카테고리:</span>
                            <span>{routine.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">소요 시간:</span>
                            <span>{routine.duration}분</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">운동 수:</span>
                            <span>{routine.exercises.length}개</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="text-xs text-muted-foreground">
                          마지막 수정: {formatDate(routine.updatedAt)}
                        </div>
                        <Button variant="outline" size="sm">
                          상세 보기
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* 루틴 추가 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>새 운동 루틴 추가</DialogTitle>
            <DialogDescription>
              새로운 운동 루틴 정보를 입력하세요. 별표(*)가 표시된 항목은 필수 입력 사항입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">루틴 이름 *</Label>
              <Input
                id="name"
                value={newRoutine.name}
                onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                placeholder="루틴 이름을 입력하세요"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetGroup">대상 그룹</Label>
                <select
                  id="targetGroup"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newRoutine.targetGroup}
                  onChange={(e) => setNewRoutine({ ...newRoutine, targetGroup: e.target.value })}
                >
                  <option value="초보자">초보자</option>
                  <option value="중급자">중급자</option>
                  <option value="고급자">고급자</option>
                  <option value="모든 수준">모든 수준</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">난이도</Label>
                <select
                  id="difficulty"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newRoutine.difficulty}
                  onChange={(e) => setNewRoutine({ ...newRoutine, difficulty: e.target.value })}
                >
                  <option value="쉬움">쉬움</option>
                  <option value="중간">중간</option>
                  <option value="어려움">어려움</option>
                  <option value="매우 어려움">매우 어려움</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <select
                  id="category"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newRoutine.category}
                  onChange={(e) => setNewRoutine({ ...newRoutine, category: e.target.value })}
                >
                  <option value="전신">전신</option>
                  <option value="상체">상체</option>
                  <option value="하체">하체</option>
                  <option value="코어">코어</option>
                  <option value="유산소">유산소</option>
                  <option value="근력">근력</option>
                  <option value="유연성">유연성</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">소요 시간 (분)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newRoutine.duration}
                  onChange={(e) => setNewRoutine({ ...newRoutine, duration: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">루틴 설명</Label>
              <Textarea
                id="description"
                value={newRoutine.description}
                onChange={(e) => setNewRoutine({ ...newRoutine, description: e.target.value })}
                placeholder="루틴에 대한 설명을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>운동 목록 *</Label>
                <span className="text-xs text-muted-foreground">최소 1개 이상의 운동이 필요합니다</span>
              </div>

              <div className="border rounded-md p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exercise-name">운동 이름</Label>
                    <Input
                      id="exercise-name"
                      value={newExercise.name}
                      onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                      placeholder="운동 이름"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="exercise-sets">세트</Label>
                      <Input
                        id="exercise-sets"
                        type="number"
                        value={newExercise.sets}
                        onChange={(e) => setNewExercise({ ...newExercise, sets: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exercise-reps">횟수/시간</Label>
                      <Input
                        id="exercise-reps"
                        value={newExercise.reps}
                        onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                        placeholder="예: 10회, 30초"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exercise-description">운동 설명</Label>
                  <Textarea
                    id="exercise-description"
                    value={newExercise.description}
                    onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                    placeholder="운동 방법에 대한 설명"
                    rows={2}
                  />
                </div>
                <Button type="button" onClick={handleAddExercise} className="w-full">
                  운동 추가
                </Button>
              </div>

              {newRoutine.exercises.length > 0 && (
                <div className="border rounded-md p-4 mt-4">
                  <h4 className="font-medium mb-2">추가된 운동 ({newRoutine.exercises.length}개)</h4>
                  <div className="space-y-2">
                    {newRoutine.exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between bg-secondary/20 p-2 rounded-md">
                        <div>
                          <span className="font-medium">{exercise.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {exercise.sets}세트 × {exercise.reps}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveExercise(index)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">메모</Label>
              <Textarea
                id="notes"
                value={newRoutine.notes}
                onChange={(e) => setNewRoutine({ ...newRoutine, notes: e.target.value })}
                placeholder="추가 메모 사항을 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddRoutine} disabled={isSubmitting}>
              {isSubmitting ? "추가 중..." : "루틴 추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 루틴 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>운동 루틴 수정</DialogTitle>
            <DialogDescription>
              운동 루틴 정보를 수정하세요. 별표(*)가 표시된 항목은 필수 입력 사항입니다.
            </DialogDescription>
          </DialogHeader>
          {selectedRoutine && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">루틴 이름 *</Label>
                <Input
                  id="edit-name"
                  value={selectedRoutine.name}
                  onChange={(e) => setSelectedRoutine({ ...selectedRoutine, name: e.target.value })}
                  placeholder="루틴 이름을 입력하세요"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-targetGroup">대상 그룹</Label>
                  <select
                    id="edit-targetGroup"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedRoutine.targetGroup}
                    onChange={(e) => setSelectedRoutine({ ...selectedRoutine, targetGroup: e.target.value })}
                  >
                    <option value="초보자">초보자</option>
                    <option value="중급자">중급자</option>
                    <option value="고급자">고급자</option>
                    <option value="모든 수준">모든 수준</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-difficulty">난이도</Label>
                  <select
                    id="edit-difficulty"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedRoutine.difficulty}
                    onChange={(e) => setSelectedRoutine({ ...selectedRoutine, difficulty: e.target.value })}
                  >
                    <option value="쉬움">쉬움</option>
                    <option value="중간">중간</option>
                    <option value="어려움">어려움</option>
                    <option value="매우 어려움">매우 어려움</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">카테고리</Label>
                  <select
                    id="edit-category"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedRoutine.category}
                    onChange={(e) => setSelectedRoutine({ ...selectedRoutine, category: e.target.value })}
                  >
                    <option value="전신">전신</option>
                    <option value="상체">상체</option>
                    <option value="하체">하체</option>
                    <option value="코어">코어</option>
                    <option value="유산소">유산소</option>
                    <option value="근력">근력</option>
                    <option value="유연성">유연성</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">소요 시간 (분)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={selectedRoutine.duration}
                    onChange={(e) => setSelectedRoutine({ ...selectedRoutine, duration: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">루틴 설명</Label>
                <Textarea
                  id="edit-description"
                  value={selectedRoutine.description}
                  onChange={(e) => setSelectedRoutine({ ...selectedRoutine, description: e.target.value })}
                  placeholder="루틴에 대한 설명을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>운동 목록 *</Label>
                  <span className="text-xs text-muted-foreground">최소 1개 이상의 운동이 필요합니다</span>
                </div>

                <div className="border rounded-md p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-exercise-name">운동 이름</Label>
                      <Input
                        id="edit-exercise-name"
                        value={newExercise.name}
                        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                        placeholder="운동 이름"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="edit-exercise-sets">세트</Label>
                        <Input
                          id="edit-exercise-sets"
                          type="number"
                          value={newExercise.sets}
                          onChange={(e) => setNewExercise({ ...newExercise, sets: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-exercise-reps">횟수/시간</Label>
                        <Input
                          id="edit-exercise-reps"
                          value={newExercise.reps}
                          onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                          placeholder="예: 10회, 30초"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-exercise-description">운동 설명</Label>
                    <Textarea
                      id="edit-exercise-description"
                      value={newExercise.description}
                      onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                      placeholder="운동 방법에 대한 설명"
                      rows={2}
                    />
                  </div>
                  <Button type="button" onClick={handleAddExercise} className="w-full">
                    운동 추가
                  </Button>
                </div>

                {selectedRoutine.exercises.length > 0 && (
                  <div className="border rounded-md p-4 mt-4">
                    <h4 className="font-medium mb-2">추가된 운동 ({selectedRoutine.exercises.length}개)</h4>
                    <div className="space-y-2">
                      {selectedRoutine.exercises.map((exercise, index) => (
                        <div key={index} className="flex items-center justify-between bg-secondary/20 p-2 rounded-md">
                          <div>
                            <span className="font-medium">{exercise.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {exercise.sets}세트 × {exercise.reps}
                            </span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveExercise(index)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">메모</Label>
                <Textarea
                  id="edit-notes"
                  value={selectedRoutine.notes}
                  onChange={(e) => setSelectedRoutine({ ...selectedRoutine, notes: e.target.value })}
                  placeholder="추가 메모 사항을 입력하세요"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEditRoutine} disabled={isSubmitting}>
              {isSubmitting ? "수정 중..." : "저장하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 루틴 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>루틴 삭제</DialogTitle>
            <DialogDescription>정말로 이 루틴을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          {selectedRoutine && (
            <div className="py-4">
              <p className="mb-2">
                <span className="font-medium">{selectedRoutine.name}</span> 루틴을 삭제합니다.
              </p>
              <p className="text-sm text-muted-foreground">이 루틴과 관련된 모든 데이터가 함께 삭제됩니다.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteRoutine} disabled={isSubmitting}>
              {isSubmitting ? "삭제 중..." : "삭제 확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

