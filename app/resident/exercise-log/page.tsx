"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon, Clock, Dumbbell, Flame, LineChart, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export type Mood = "great" | "good" | "neutral" | "bad" | "terrible"

interface ExerciseSet {
  exercise: string
  weight?: number
  reps?: number
  sets?: number
  duration?: number
  distance?: number
}

interface ExerciseLog {
  id: string
  userId: string
  date: string
  exerciseType: string
  duration: number
  caloriesBurned?: number
  distance?: number
  sets?: ExerciseSet[]
  notes?: string
  mood?: Mood
}

interface ExerciseStats {
  totalWorkouts: number
  totalDuration: number
  totalCalories: number
  exerciseTypes: Record<string, number>
  recentDuration: number
  monthlyStats: Record<string, { workouts: number; duration: number; calories: number }>
}

export default function ExerciseLogPage() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<ExerciseLog[]>([])
  const [stats, setStats] = useState<ExerciseStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedLog, setSelectedLog] = useState<ExerciseLog | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(null)

  // 새 운동 일지 폼 상태
  const [newLog, setNewLog] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    exerciseType: "헬스",
    duration: 60,
    caloriesBurned: 300,
    distance: 0,
    notes: "",
    mood: "good",
    sets: [] as ExerciseSet[],
  })

  // 새 세트 폼 상태
  const [newSet, setNewSet] = useState<ExerciseSet>({
    exercise: "",
    weight: 0,
    reps: 0,
    sets: 0,
  })

  // 로그인 시 저장된 인증 토큰 가져오기
  useEffect(() => {
    // 로컬 스토리지에서 인증 토큰 가져오기
    const token = localStorage.getItem("authToken")
    if (token) {
      setAuthToken(token)
    }
  }, [])

  // 운동 일지 데이터 가져오기
  const fetchLogs = useCallback(async () => {
    try {
      // 로딩 상태 표시
      setIsLoading(true)

      // API 요청 URL 구성 (토큰이 있으면 쿼리 파라미터로 추가)
      let url = "/api/exercise-logs"
      if (authToken) {
        url += `?token=${authToken}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
        if (response.status === 401 && errorData.requireAuth) {
          toast({
            title: "로그인 필요",
            description: "로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.",
            variant: "destructive",
          })

          // 3초 후 로그인 페이지로 리다이렉트
          setTimeout(() => {
            window.location.href = "/login?redirect=/resident/exercise-log"
          }, 3000)

          return
        }

        throw new Error(errorData.error || "운동 일지를 가져오는데 실패했습니다.")
      }

      const data = await response.json()
      console.log("가져온 운동 일지 데이터:", data)
      setLogs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching exercise logs:", error)
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "운동 일지를 가져오는데 실패했습니다.",
        variant: "destructive",
      })
      // 오류 발생 시 빈 배열로 설정하여 UI가 깨지지 않도록 함
      setLogs([])
    } finally {
      setIsLoading(false)
    }
  }, [authToken, toast])

  // 운동 통계 데이터 가져오기
  const fetchStats = useCallback(async () => {
    try {
      // API 요청 URL 구성 (토큰이 있으면 쿼리 파라미터로 추가)
      let url = "/api/exercise-logs/stats"
      if (authToken) {
        url += `?token=${authToken}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        // 쿠키를 포함하도록 설정
        credentials: "include",
      })

      // 응답 상태 코드 확인 및 로깅
      console.log("통계 API 응답 상태:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("통계 API 오류 응답:", errorData)

        // 401 오류는 이미 위에서 처리했으므로 여기서는 무시
        if (response.status !== 401 || !errorData.requireAuth) {
          console.warn("통계 데이터를 가져오는데 실패했습니다. 기본값 사용:", errorData.error)
        }

        // 오류 발생 시 기본 통계 데이터 설정
        setStats({
          totalWorkouts: 0,
          totalDuration: 0,
          totalCalories: 0,
          exerciseTypes: {},
          recentDuration: 0,
          monthlyStats: {},
        })
        return
      }

      const data = await response.json()
      console.log("가져온 통계 데이터:", data)
      setStats(data)
    } catch (error) {
      console.error("Error fetching exercise stats:", error)
      // 통계 데이터 오류 시 기본값 설정
      setStats({
        totalWorkouts: 0,
        totalDuration: 0,
        totalCalories: 0,
        exerciseTypes: {},
        recentDuration: 0,
        monthlyStats: {},
      })
    } finally {
      setIsLoading(false)
    }
  }, [authToken])

  useEffect(() => {
    // 데이터 가져오기
    fetchLogs()
    fetchStats()
  }, [fetchLogs, fetchStats])

  // 운동 일지 추가 처리
  const handleSubmitLog = async () => {
    if (!newLog.exerciseType || !newLog.duration) {
      toast({
        title: "오류",
        description: "운동 종류와 시간은 필수 입력 항목입니다.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // API 요청 URL 구성 (토큰이 있으면 쿼리 파라미터로 추가)
      let url = "/api/exercise-logs"
      if (authToken) {
        url += `?token=${authToken}`
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        // 쿠키를 포함하도록 설정
        credentials: "include",
        body: JSON.stringify(newLog),
      })

      if (!response.ok) {
        throw new Error("운동 일지 작성에 실패했습니다.")
      }

      const createdLog = await response.json()
      setLogs((prev) => [...prev, createdLog])

      toast({
        title: "운동 일지 작성 완료",
        description: "운동 일지가 성공적으로 작성되었습니다.",
      })

      // 폼 초기화
      setNewLog({
        date: format(new Date(), "yyyy-MM-dd"),
        exerciseType: "헬스",
        duration: 60,
        caloriesBurned: 300,
        distance: 0,
        notes: "",
        mood: "good" as const,
        sets: [],
      })

      // 통계 다시 가져오기
      let statsUrl = "/api/exercise-logs/stats"
      if (authToken) {
        statsUrl += `?token=${authToken}`
      }

      const statsResponse = await fetch(statsUrl, {
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("Error creating exercise log:", error)
      toast({
        title: "운동 일지 작성 실패",
        description: error instanceof Error ? error.message : "운동 일지 작성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 운동 일지 삭제 처리
  const handleDeleteLog = async (id: string) => {
    try {
      // API 요청 URL 구성 (토큰이 있으면 쿼리 파라미터로 추가)
      let url = `/api/exercise-logs/${id}`
      if (authToken) {
        url += `?token=${authToken}`
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        // 쿠키를 포함하도록 설정
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("운동 일지 삭제에 실패했습니다.")
      }

      setLogs((prev) => prev.filter((log) => log.id !== id))

      toast({
        title: "운동 일지 삭제 완료",
        description: "운동 일지가 삭제되었습니다.",
      })

      // 통계 다시 가져오기
      let statsUrl = "/api/exercise-logs/stats"
      if (authToken) {
        statsUrl += `?token=${authToken}`
      }

      const statsResponse = await fetch(statsUrl, {
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("Error deleting exercise log:", error)
      toast({
        title: "운동 일지 삭제 실패",
        description: error instanceof Error ? error.message : "운동 일지 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 세트 추가 처리
  const handleAddSet = () => {
    if (!newSet.exercise) {
      toast({
        title: "오류",
        description: "운동 이름은 필수 입력 항목입니다.",
        variant: "destructive",
      })
      return
    }

    setNewLog((prev) => ({
      ...prev,
      sets: [...(prev.sets || []), newSet],
    }))

    // 세트 폼 초기화
    setNewSet({
      exercise: "",
      weight: 0,
      reps: 0,
      sets: 0,
    })
  }

  // 세트 삭제 처리
  const handleRemoveSet = (index: number) => {
    setNewLog((prev) => ({
      ...prev,
      sets: prev.sets?.filter((_, i) => i !== index) || [],
    }))
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "yyyy년 MM월 dd일", { locale: ko })
  }

  // 운동 종류에 따른 아이콘 선택
  const getExerciseIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "헬스":
      case "웨이트":
        return <Dumbbell className="h-5 w-5 text-primary" />
      case "수영":
      case "달리기":
      case "조깅":
      case "사이클":
        return <Clock className="h-5 w-5 text-primary" />
      default:
        return <Dumbbell className="h-5 w-5 text-primary" />
    }
  }

  // 기분에 따른 이모지 선택
  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case "great":
        return "😁"
      case "good":
        return "🙂"
      case "neutral":
        return "😐"
      case "bad":
        return "😕"
      case "terrible":
        return "😫"
      default:
        return ""
    }
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
            <h1 className="text-2xl font-bold">운동 일지</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  운동 기록하기
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>새 운동 기록</DialogTitle>
                  <DialogDescription>
                    오늘의 운동 활동을 기록하세요. 운동 종류, 시간, 세트 등을 입력할 수 있습니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exercise-date">날짜</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date)
                              if (date) {
                                setNewLog((prev) => ({
                                  ...prev,
                                  date: format(date, "yyyy-MM-dd"),
                                }))
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exercise-type">운동 종류</Label>
                      <select
                        id="exercise-type"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newLog.exerciseType}
                        onChange={(e) => setNewLog({ ...newLog, exerciseType: e.target.value })}
                      >
                        <option value="헬스">헬스</option>
                        <option value="수영">수영</option>
                        <option value="요가">요가</option>
                        <option value="필라테스">필라테스</option>
                        <option value="달리기">달리기</option>
                        <option value="사이클">사이클</option>
                        <option value="기타">기타</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exercise-duration">운동 시간 (분)</Label>
                      <Input
                        id="exercise-duration"
                        type="number"
                        value={newLog.duration}
                        onChange={(e) => setNewLog({ ...newLog, duration: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exercise-calories">소모 칼로리</Label>
                      <Input
                        id="exercise-calories"
                        type="number"
                        value={newLog.caloriesBurned}
                        onChange={(e) => setNewLog({ ...newLog, caloriesBurned: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exercise-distance">거리 (km)</Label>
                      <Input
                        id="exercise-distance"
                        type="number"
                        step="0.1"
                        value={newLog.distance}
                        onChange={(e) => setNewLog({ ...newLog, distance: Number.parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  {/* 세트 추가 섹션 */}
                  {(newLog.exerciseType === "헬스" || newLog.exerciseType === "웨이트") && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>세트 기록</Label>
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        <div className="col-span-2">
                          <Input
                            placeholder="운동 이름"
                            value={newSet.exercise}
                            onChange={(e) => setNewSet({ ...newSet, exercise: e.target.value })}
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            placeholder="무게(kg)"
                            value={newSet.weight}
                            onChange={(e) => setNewSet({ ...newSet, weight: Number.parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            placeholder="횟수"
                            value={newSet.reps}
                            onChange={(e) => setNewSet({ ...newSet, reps: Number.parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            placeholder="세트"
                            value={newSet.sets}
                            onChange={(e) => setNewSet({ ...newSet, sets: Number.parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>

                      <Button type="button" variant="outline" onClick={handleAddSet}>
                        세트 추가
                      </Button>

                      {newLog.sets && newLog.sets.length > 0 && (
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium mb-2">추가된 세트</h4>
                          <div className="space-y-2">
                            {newLog.sets.map((set, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-secondary/20 p-2 rounded-md"
                              >
                                <div>
                                  <span className="font-medium">{set.exercise}</span>
                                  <span className="text-sm text-muted-foreground ml-2">
                                    {set.weight}kg × {set.reps}회 × {set.sets}세트
                                  </span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveSet(index)}>
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="exercise-mood">오늘의 컨디션</Label>
                    <select
                      id="exercise-mood"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newLog.mood}
                      onChange={(e) => setNewLog({ ...newLog, mood: e.target.value as Mood })}
                    >
                      <option value="great">아주 좋음 😁</option>
                      <option value="good">좋음 🙂</option>
                      <option value="neutral">보통 😐</option>
                      <option value="bad">나쁨 😕</option>
                      <option value="terrible">매우 나쁨 😫</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exercise-notes">메모</Label>
                    <Textarea
                      id="exercise-notes"
                      placeholder="오늘의 운동에 대한 메모를 남겨보세요."
                      value={newLog.notes}
                      onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSubmitLog} disabled={isSubmitting}>
                    {isSubmitting ? "저장 중..." : "저장하기"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="logs">
            <TabsList>
              <TabsTrigger value="logs">운동 기록</TabsTrigger>
              <TabsTrigger value="stats">통계</TabsTrigger>
            </TabsList>
            <TabsContent value="logs" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>운동 일지를 불러오는 중...</p>
                </div>
              ) : logs.length > 0 ? (
                <div className="space-y-4">
                  {logs
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((log) => (
                      <Card key={log.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getExerciseIcon(log.exerciseType)}
                              <CardTitle>{log.exerciseType}</CardTitle>
                              {log.mood && <span className="text-xl">{getMoodEmoji(log.mood)}</span>}
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteLog(log.id)}>
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                          <CardDescription>{formatDate(log.date)}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center p-2 bg-secondary/20 rounded-md">
                              <Clock className="h-5 w-5 text-muted-foreground mb-1" />
                              <span className="text-sm font-medium">{log.duration}분</span>
                              <span className="text-xs text-muted-foreground">운동 시간</span>
                            </div>
                            {log.caloriesBurned && (
                              <div className="flex flex-col items-center p-2 bg-secondary/20 rounded-md">
                                <Flame className="h-5 w-5 text-muted-foreground mb-1" />
                                <span className="text-sm font-medium">{log.caloriesBurned}kcal</span>
                                <span className="text-xs text-muted-foreground">소모 칼로리</span>
                              </div>
                            )}
                            {log.distance && log.distance > 0 && (
                              <div className="flex flex-col items-center p-2 bg-secondary/20 rounded-md">
                                <LineChart className="h-5 w-5 text-muted-foreground mb-1" />
                                <span className="text-sm font-medium">{log.distance}km</span>
                                <span className="text-xs text-muted-foreground">이동 거리</span>
                              </div>
                            )}
                          </div>

                          {log.sets && log.sets.length > 0 && (
                            <div className="border rounded-md p-3">
                              <h4 className="font-medium mb-2">세트 기록</h4>
                              <div className="space-y-2">
                                {log.sets.map((set, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between bg-secondary/10 p-2 rounded-md"
                                  >
                                    <div>
                                      <span className="font-medium">{set.exercise}</span>
                                      <span className="text-sm text-muted-foreground ml-2">
                                        {set.weight}kg × {set.reps}회 × {set.sets}세트
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {log.notes && (
                            <div className="border-t pt-3">
                              <h4 className="font-medium mb-1">메모</h4>
                              <p className="text-sm text-muted-foreground whitespace-pre-line">{log.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Dumbbell className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg mb-2">운동 기록이 없습니다</h3>
                  <p className="text-muted-foreground mb-4">첫 번째 운동 기록을 작성해보세요!</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        운동 기록하기
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      {/* 운동 기록 다이얼로그 내용 (위와 동일) */}
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </TabsContent>
            <TabsContent value="stats">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>통계를 불러오는 중...</p>
                </div>
              ) : stats ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">총 운동 횟수</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.totalWorkouts}회</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">총 운동 시간</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.totalDuration}분</div>
                        <p className="text-xs text-muted-foreground">
                          약 {Math.floor(stats.totalDuration / 60)}시간 {stats.totalDuration % 60}분
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">총 소모 칼로리</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCalories}kcal</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">최근 7일 운동 시간</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.recentDuration}분</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>운동 유형 분석</CardTitle>
                        <CardDescription>운동 종류별 횟수</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(stats.exerciseTypes).map(([type, count]) => (
                            <div key={type} className="flex items-center">
                              <div className="w-1/3 font-medium">{type}</div>
                              <div className="w-2/3 flex items-center gap-2">
                                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary"
                                    style={{
                                      width: `${(count / stats.totalWorkouts) * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm">{count}회</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>월별 통계</CardTitle>
                        <CardDescription>월별 운동 횟수 및 시간</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(stats.monthlyStats)
                            .sort((a, b) => b[0].localeCompare(a[0])) // 최신 월이 위로 오도록 정렬
                            .map(([month, data]) => {
                              const [year, monthNum] = month.split("-")
                              return (
                                <div key={month} className="border-b pb-3 last:border-0 last:pb-0">
                                  <h4 className="font-medium mb-2">
                                    {year}년 {Number.parseInt(monthNum)}월
                                  </h4>
                                  <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="bg-secondary/20 p-2 rounded-md text-center">
                                      <div className="font-medium">{data.workouts}회</div>
                                      <div className="text-xs text-muted-foreground">운동 횟수</div>
                                    </div>
                                    <div className="bg-secondary/20 p-2 rounded-md text-center">
                                      <div className="font-medium">{data.duration}분</div>
                                      <div className="text-xs text-muted-foreground">운동 시간</div>
                                    </div>
                                    <div className="bg-secondary/20 p-2 rounded-md text-center">
                                      <div className="font-medium">{data.calories}kcal</div>
                                      <div className="text-xs text-muted-foreground">소모 칼로리</div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <LineChart className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg mb-2">통계 데이터가 없습니다</h3>
                  <p className="text-muted-foreground mb-4">운동 기록을 작성하면 통계 데이터가 생성됩니다.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

