"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/ui/user-nav"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon, ChevronDown, Clock, Edit, MoreHorizontal, Plus, Search, Trash2, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Member {
  id: string
  name: string
  email: string
}

interface Lesson {
  id: string
  title: string
  type: string
  description?: string
  duration: number
  capacity: number
  trainerId: string
  schedule: {
    day: string
    time: string
  }[]
  members?: Member[]
}

interface LessonSession {
  id: string
  lessonId: string
  lessonTitle: string
  date: string
  time: string
  trainerId: string
  memberIds: string[]
  memberNames: string[]
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
}

export default function LessonsPage() {
  const { toast } = useToast()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [lessonSessions, setLessonSessions] = useState<LessonSession[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [selectedSession, setSelectedSession] = useState<LessonSession | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  // 새 레슨 폼 상태
  const [newLesson, setNewLesson] = useState({
    title: "",
    type: "개인 PT",
    description: "",
    duration: 60,
    capacity: 1,
    schedule: [] as { day: string; time: string }[],
  })

  // 새 일정 폼 상태
  const [newSchedule, setNewSchedule] = useState({
    day: "월",
    time: "10:00-11:00",
  })

  // 새 세션 폼 상태
  const [newSession, setNewSession] = useState({
    lessonId: "",
    lessonTitle: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00-11:00",
    memberIds: [] as string[],
    memberNames: [] as string[],
    status: "scheduled" as const,
    notes: "",
  })

  // 로컬 스토리지에서 인증 토큰 가져오기
  useEffect(() => {
    const checkLoginStatus = async () => {
      // 로컬 스토리지에서 인증 토큰 가져오기
      const token = localStorage.getItem("authToken")
      const userSession = localStorage.getItem("user-session")

      // 세션 쿠키 확인
      const cookies = document.cookie.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=")
          acc[key] = value
          return acc
        },
        {} as Record<string, string>,
      )

      const hasSessionCookie = cookies["user-session"] !== undefined

      if (!token && !userSession && !hasSessionCookie) {
        toast({
          title: "로그인 필요",
          description: "로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.",
          variant: "destructive",
        })

        // 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          window.location.href = "/login?redirect=/trainer/lessons"
        }, 3000)
        return
      }

      if (token) {
        setAuthToken(token)
      }
    }

    checkLoginStatus()
  }, [toast])

  // 레슨 데이터 가져오기
  const fetchLessons = async () => {
    try {
      setIsLoading(true)

      // 로컬 스토리지에서 사용자 세션 정보 가져오기
      const userSession = localStorage.getItem("user-session")
      const token = localStorage.getItem("authToken")

      // API 요청 URL 구성
      const url = "/api/trainer-lessons"

      console.log("Fetching lessons from:", url)

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(userSession && { "X-User-Session": userSession }),
        },
        credentials: "include", // 중요: 쿠키를 포함하여 요청
      })

      // 응답 상태 코드 확인 및 로깅
      console.log("API 응답 상태:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "응답을 파싱할 수 없습니다." }))
        console.error("API 오류 응답:", errorData)

        // 401 오류인 경우 로그인 페이지로 리다이렉트
        if (response.status === 401) {
          toast({
            title: "로그인 필요",
            description: "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
            variant: "destructive",
          })

          // 로컬 스토리지에서 만료된 토큰 제거
          localStorage.removeItem("authToken")
          localStorage.removeItem("user-session")

          // 3초 후 로그인 페이지로 리다이렉트
          setTimeout(() => {
            window.location.href = "/login?redirect=/trainer/lessons"
          }, 3000)

          return
        }

        throw new Error(errorData.error || "레슨 정보를 가져오는데 실패했습니다.")
      }

      const data = await response.json()
      console.log("가져온 레슨 데이터:", data)

      // 데이터가 배열인지 확인
      if (Array.isArray(data)) {
        setLessons(data)
        setFilteredLessons(data)
      } else {
        console.error("예상치 못한 데이터 형식:", data)
        setLessons([])
        setFilteredLessons([])
        toast({
          title: "데이터 형식 오류",
          description: "서버에서 예상치 못한 형식의 데이터를 반환했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching lessons:", error)
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "레슨 정보를 가져오는데 실패했습니다.",
        variant: "destructive",
      })
      // 오류 발생 시 빈 배열로 설정하여 UI가 깨지지 않도록 함
      setLessons([])
      setFilteredLessons([])
    } finally {
      setIsLoading(false)
    }
  }

  // 레슨 세션 데이터 가져오기
  const fetchLessonSessions = async () => {
    try {
      // 로컬 스토리지에서 사용자 세션 정보 가져오기
      const userSession = localStorage.getItem("user-session")
      const token = localStorage.getItem("authToken")

      // API 요청 URL 구성
      const url = "/api/trainer-lessons/sessions"

      console.log("Fetching lesson sessions from:", url)

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(userSession && { "X-User-Session": userSession }),
        },
        credentials: "include", // 중요: 쿠키를 포함하여 요청
      })

      console.log("세션 API 응답 상태:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "응답을 파싱할 수 없습니다." }))
        console.error("세션 API 오류 응답:", errorData)
        throw new Error(errorData.error || "레슨 세션 정보를 가져오는데 실패했습니다.")
      }

      const data = await response.json()
      console.log("가져온 레슨 세션 데이터:", data)

      // 데이터가 배열인지 확인
      if (Array.isArray(data)) {
        setLessonSessions(data)
      } else {
        console.error("예상치 못한 세션 데이터 형식:", data)
        setLessonSessions([])
      }
    } catch (error) {
      console.error("Error fetching lesson sessions:", error)
      toast({
        title: "세션 데이터 오류",
        description: error instanceof Error ? error.message : "레슨 세션 정보를 가져오는데 실패했습니다.",
        variant: "destructive",
      })
      // 오류 발생 시 빈 배열로 설정
      setLessonSessions([])
    }
  }

  // 회원 데이터 가져오기
  const fetchMembers = async () => {
    try {
      // 로컬 스토리지에서 사용자 세션 정보 가져오기
      const userSession = localStorage.getItem("user-session")
      const token = localStorage.getItem("authToken")

      // API 요청 URL 구성
      const url = "/api/members"

      console.log("Fetching members from:", url)

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(userSession && { "X-User-Session": userSession }),
        },
        credentials: "include",
      })

      console.log("회원 API 응답 상태:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "응답을 파싱할 수 없습니다." }))
        console.error("회원 API 오류 응답:", errorData)
        throw new Error(errorData.error || "회원 정보를 가져오는데 실패했습니다.")
      }

      const data = await response.json()
      console.log("가져온 회원 데이터:", data)

      // 데이터가 배열인지 확인
      if (Array.isArray(data)) {
        setMembers(data)
      } else {
        console.error("예상치 못한 회원 데이터 형식:", data)
        setMembers([])
      }
    } catch (error) {
      console.error("Error fetching members:", error)
      toast({
        title: "회원 데이터 오류",
        description: error instanceof Error ? error.message : "회원 정보를 가져오는데 실패했습니다.",
        variant: "destructive",
      })
      // 오류 발생 시 빈 배열로 설정
      setMembers([])
    }
  }

  // 데이터 가져오기
  useEffect(() => {
    fetchLessons()
    fetchLessonSessions()
    fetchMembers()
  }, [toast, authToken])

  // 검색 필터링
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLessons(lessons)
    } else {
      const filtered = lessons.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredLessons(filtered)
    }
  }, [searchQuery, lessons])

  // 일정 추가 처리
  const handleAddSchedule = () => {
    if (!newSchedule.day || !newSchedule.time) {
      toast({
        title: "오류",
        description: "요일과 시간은 필수 입력 항목입니다.",
        variant: "destructive",
      })
      return
    }

    if (isEditDialogOpen && selectedLesson) {
      setSelectedLesson({
        ...selectedLesson,
        schedule: [...selectedLesson.schedule, newSchedule],
      })
    } else {
      setNewLesson({
        ...newLesson,
        schedule: [...newLesson.schedule, newSchedule],
      })
    }

    // 일정 폼 초기화
    setNewSchedule({
      day: "월",
      time: "10:00-11:00",
    })
  }

  // 일정 삭제 처리
  const handleRemoveSchedule = (index: number) => {
    if (isEditDialogOpen && selectedLesson) {
      const updatedSchedule = [...selectedLesson.schedule]
      updatedSchedule.splice(index, 1)
      setSelectedLesson({
        ...selectedLesson,
        schedule: updatedSchedule,
      })
    } else {
      const updatedSchedule = [...newLesson.schedule]
      updatedSchedule.splice(index, 1)
      setNewLesson({
        ...newLesson,
        schedule: updatedSchedule,
      })
    }
  }

  // 레슨 추가 처리
  const handleAddLesson = async () => {
    if (!newLesson.title || newLesson.schedule.length === 0) {
      toast({
        title: "오류",
        description: "레슨 이름과 최소 1개 이상의 일정이 필요합니다.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/trainer-lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
        body: JSON.stringify(newLesson),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "레슨 추가에 실패했습니다.")
      }

      const createdLesson = await response.json()
      setLessons((prev) => [...prev, createdLesson])

      toast({
        title: "레슨 추가 완료",
        description: `${newLesson.title} 레슨이 추가되었습니다.`,
      })

      // 폼 초기화 및 다이얼로그 닫기
      setNewLesson({
        title: "",
        type: "개인 PT",
        description: "",
        duration: 60,
        capacity: 1,
        schedule: [],
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding lesson:", error)
      toast({
        title: "레슨 추가 실패",
        description: error instanceof Error ? error.message : "레슨 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 레슨 수정 처리
  const handleEditLesson = async () => {
    if (!selectedLesson) return

    if (!selectedLesson.title || selectedLesson.schedule.length === 0) {
      toast({
        title: "오류",
        description: "레슨 이름과 최소 1개 이상의 일정이 필요합니다.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/trainer-lessons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
        body: JSON.stringify(selectedLesson),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "레슨 수정에 실패했습니다.")
      }

      const updatedLesson = await response.json()
      setLessons((prev) => prev.map((lesson) => (lesson.id === updatedLesson.id ? updatedLesson : lesson)))

      toast({
        title: "레슨 수정 완료",
        description: `${updatedLesson.title} 레슨이 수정되었습니다.`,
      })

      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating lesson:", error)
      toast({
        title: "레슨 수정 실패",
        description: error instanceof Error ? error.message : "레슨 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 레슨 삭제 처리
  const handleDeleteLesson = async () => {
    if (!selectedLesson) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/trainer-lessons?id=${selectedLesson.id}`, {
        method: "DELETE",
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "레슨 삭제에 실패했습니다.")
      }

      setLessons((prev) => prev.filter((lesson) => lesson.id !== selectedLesson.id))

      toast({
        title: "레슨 삭제 완료",
        description: `${selectedLesson.title} 레슨이 삭제되었습니다.`,
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting lesson:", error)
      toast({
        title: "레슨 삭제 실패",
        description: error instanceof Error ? error.message : "레슨 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 레슨 세션 생성 처리
  const handleCreateSession = async () => {
    if (!selectedLesson || !selectedDate) {
      toast({
        title: "오류",
        description: "레슨과 날짜를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    if (selectedMembers.length === 0) {
      toast({
        title: "오류",
        description: "최소 1명 이상의 회원을 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 선택된 회원 이름 가져오기
      const memberNames = members.filter((member) => selectedMembers.includes(member.id)).map((member) => member.name)

      const sessionData = {
        ...(selectedSession?.id && { id: selectedSession.id }),
        lessonId: selectedLesson.id,
        lessonTitle: selectedLesson.title,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: newSession.time,
        memberIds: selectedMembers,
        memberNames: memberNames,
        status: selectedSession ? selectedSession.status : ("scheduled" as const),
        notes: newSession.notes,
      }

      // 수정 또는 생성 API 호출
      const method = selectedSession ? "PUT" : "POST"
      const url = selectedSession
        ? `/api/trainer-lessons/sessions/${selectedSession.id}`
        : "/api/trainer-lessons/sessions"

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
        body: JSON.stringify(sessionData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `레슨 세션 ${selectedSession ? "수정" : "생성"}에 실패했습니다.`)
      }

      const resultSession = await response.json()

      if (selectedSession) {
        // 세션 수정 시 목록 업데이트
        setLessonSessions((prev) => prev.map((session) => (session.id === resultSession.id ? resultSession : session)))

        toast({
          title: "레슨 세션 수정 완료",
          description: `${selectedLesson.title} 레슨 세션이 수정되었습니다.`,
        })
      } else {
        // 세션 생성 시 목록에 추가
        setLessonSessions((prev) => [...prev, resultSession])

        toast({
          title: "레슨 세션 생성 완료",
          description: `${selectedLesson.title} 레슨 세션이 생성되었습니다.`,
        })
      }

      // 폼 초기화 및 다이얼로그 닫기
      setNewSession({
        lessonId: "",
        lessonTitle: "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "10:00-11:00",
        memberIds: [],
        memberNames: [],
        status: "scheduled",
        notes: "",
      })
      setSelectedMembers([])
      setSelectedSession(null)
      setIsSessionDialogOpen(false)
    } catch (error) {
      console.error(`Error ${selectedSession ? "updating" : "creating"} lesson session:`, error)
      toast({
        title: `레슨 세션 ${selectedSession ? "수정" : "생성"} 실패`,
        description:
          error instanceof Error
            ? error.message
            : `레슨 세션 ${selectedSession ? "수정" : "생성"} 중 오류가 발생했습니다.`,
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

  // 요일 변환
  const getDayInKorean = (day: string) => {
    const days: Record<string, string> = {
      월: "월요일",
      화: "화요일",
      수: "수요일",
      목: "목요일",
      금: "금요일",
      토: "토요일",
      일: "일요일",
    }
    return days[day] || day
  }

  // 회원 선택 토글
  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  // 선택된 날짜의 세션 가져오기
  const getSessionsForSelectedDate = () => {
    if (!selectedDate) return []

    const dateString = format(selectedDate, "yyyy-MM-dd")
    return lessonSessions.filter((session) => session.date === dateString)
  }

  // 세션 수정 처리
  const handleEditSession = (session: LessonSession) => {
    setSelectedSession(session)
    // 세션 정보로 폼 초기화
    const lesson = lessons.find((l) => l.id === session.lessonId)
    if (lesson) {
      setSelectedLesson(lesson)
    }
    setSelectedDate(parseISO(session.date))
    setNewSession({
      ...newSession,
      lessonId: session.lessonId,
      lessonTitle: session.lessonTitle,
      date: session.date,
      time: session.time,
      memberIds: session.memberIds,
      memberNames: session.memberNames,
      status: session.status,
      notes: session.notes || "",
    })
    setSelectedMembers(session.memberIds)
    setIsSessionDialogOpen(true)
  }

  // 세션 취소 처리
  const handleCancelSession = (session: LessonSession) => {
    if (window.confirm(`"${session.lessonTitle}" 세션을 취소하시겠습니까?`)) {
      setIsSubmitting(true)

      // 세션 상태를 "cancelled"로 변경
      const updatedSession = { ...session, status: "cancelled" as const }

      // API 호출 (실제 구현에서는 API 엔드포인트 필요)
      fetch(`/api/trainer-lessons/sessions/${session.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
        body: JSON.stringify(updatedSession),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("세션 취소에 실패했습니다.")
          }
          return response.json()
        })
        .then((data) => {
          // 세션 목록 업데이트
          setLessonSessions((prev) => prev.map((s) => (s.id === session.id ? { ...s, status: "cancelled" } : s)))

          toast({
            title: "세션 취소 완료",
            description: `${session.lessonTitle} 세션이 취소되었습니다.`,
          })
        })
        .catch((error) => {
          console.error("Error cancelling session:", error)
          toast({
            title: "세션 취소 실패",
            description: error instanceof Error ? error.message : "세션 취소 중 오류가 발생했습니다.",
            variant: "destructive",
          })
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    }
  }

  // 특정 날짜의 세션 데이터를 가져오는 함수
  const fetchSessionsForDate = async (dateString: string) => {
    try {
      setIsLoading(true)

      // 로컬 스토리지에서 사용자 세션 정보 가져오기
      const userSession = localStorage.getItem("user-session")
      const token = localStorage.getItem("authToken")

      // API 요청 URL 구성
      const url = `/api/trainer-lessons/sessions?date=${dateString}`

      console.log("Fetching sessions for date:", dateString)

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(userSession && { "X-User-Session": userSession }),
        },
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "응답을 파싱할 수 없습니다." }))
        throw new Error(errorData.error || "세션 정보를 가져오는데 실패했습니다.")
      }

      const data = await response.json()
      console.log("가져온 날짜별 세션 데이터:", data)

      // 데이터가 배열인지 확인
      if (Array.isArray(data)) {
        // 기존 세션 데이터를 유지하면서 해당 날짜의 세션만 업데이트
        setLessonSessions((prev) => {
          const filteredPrev = prev.filter((session) => session.date !== dateString)
          return [...filteredPrev, ...data]
        })
      }
    } catch (error) {
      console.error("Error fetching sessions for date:", error)
      toast({
        title: "날짜별 세션 데이터 오류",
        description: error instanceof Error ? error.message : "세션 정보를 가져오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
            <h1 className="text-2xl font-bold">레슨 관리</h1>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                레슨 추가
              </Button>
              <Button variant="outline" onClick={() => setIsSessionDialogOpen(true)}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                세션 예약
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="레슨 검색..."
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
                  onClick={() => setLessons([...lessons].sort((a, b) => a.title.localeCompare(b.title)))}
                >
                  이름 (오름차순)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLessons([...lessons].sort((a, b) => b.title.localeCompare(a.title)))}
                >
                  이름 (내림차순)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLessons([...lessons].sort((a, b) => a.duration - b.duration))}>
                  시간 (짧은순)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLessons([...lessons].sort((a, b) => b.duration - a.duration))}>
                  시간 (긴순)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLessons([...lessons].sort((a, b) => a.capacity - b.capacity))}>
                  정원 (적은순)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLessons([...lessons].sort((a, b) => b.capacity - a.capacity))}>
                  정원 (많은순)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="lessons">
            <TabsList>
              <TabsTrigger value="lessons">레슨 목록</TabsTrigger>
              <TabsTrigger value="calendar">일정 캘린더</TabsTrigger>
            </TabsList>
            <TabsContent value="lessons" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>레슨 정보를 불러오는 중...</p>
                </div>
              ) : filteredLessons.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredLessons.map((lesson) => (
                    <Card key={lesson.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">{lesson.title}</CardTitle>
                            <CardDescription>{lesson.type}</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>레슨 관리</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedLesson(lesson)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                레슨 수정
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedLesson(lesson)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                레슨 삭제
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedLesson(lesson)
                                  setIsSessionDialogOpen(true)
                                }}
                              >
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                세션 예약
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">소요 시간:</span>
                            <span>{lesson.duration}분</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">정원:</span>
                            <span>{lesson.capacity}명</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-muted-foreground block mb-1">일정:</span>
                            <div className="space-y-1">
                              {lesson.schedule.map((schedule, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-secondary/20 p-1.5 rounded-md text-xs"
                                >
                                  <span>{getDayInKorean(schedule.day)}</span>
                                  <span>{schedule.time}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {lesson.description && (
                            <div className="mt-2">
                              <span className="text-muted-foreground">설명:</span>
                              <p className="text-xs mt-1">{lesson.description}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">{lesson.members?.length || 0}명 등록</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedLesson(lesson)
                            setIsSessionDialogOpen(true)
                          }}
                        >
                          세션 예약
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg mb-2">레슨이 없습니다</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "검색 결과가 없습니다. 다른 검색어를 입력해보세요." : "새 레슨을 추가해보세요!"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      레슨 추가
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="calendar">
              <Card>
                <CardHeader>
                  <CardTitle>레슨 일정 캘린더</CardTitle>
                  <CardDescription>날짜를 선택하여 해당 일자의 레슨 일정을 확인하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date)
                          // 날짜 클릭 시 해당 날짜의 세션 데이터를 가져오는 함수 호출
                          if (date) {
                            fetchSessionsForDate(format(date, "yyyy-MM-dd"))
                          }
                        }}
                        className="rounded-md border"
                        locale={ko}
                        modifiers={{
                          hasSession: (date) => {
                            const dateString = format(date, "yyyy-MM-dd")
                            return lessonSessions.some((session) => session.date === dateString)
                          },
                        }}
                        modifiersClassNames={{
                          hasSession: "bg-primary/20 font-bold text-primary",
                        }}
                      />
                    </div>
                    <div className="md:w-1/2">
                      <h3 className="font-semibold mb-4">
                        {selectedDate ? format(selectedDate, "yyyy년 MM월 dd일", { locale: ko }) : "날짜를 선택하세요"}
                      </h3>

                      {selectedDate && (
                        <>
                          {getSessionsForSelectedDate().length > 0 ? (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">예약 현황</h4>
                                <Badge variant="outline">{getSessionsForSelectedDate().length}개 세션</Badge>
                              </div>
                              {getSessionsForSelectedDate().map((session) => (
                                <div key={session.id} className="border rounded-md p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h4 className="font-medium">{session.lessonTitle}</h4>
                                      <p className="text-sm text-muted-foreground">{session.time}</p>
                                    </div>
                                    <Badge
                                      className={cn(
                                        session.status === "completed"
                                          ? "bg-green-100 text-green-800"
                                          : session.status === "cancelled"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-blue-100 text-blue-800",
                                      )}
                                    >
                                      {session.status === "completed"
                                        ? "완료"
                                        : session.status === "cancelled"
                                          ? "취소됨"
                                          : "예정됨"}
                                    </Badge>
                                  </div>
                                  <div className="text-sm">
                                    <p className="font-medium">참여 회원:</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {session.memberNames.map((name, idx) => (
                                        <Badge key={idx} variant="outline">
                                          {name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  {session.notes && (
                                    <div className="mt-2 text-sm">
                                      <p className="font-medium">메모:</p>
                                      <p className="text-muted-foreground">{session.notes}</p>
                                    </div>
                                  )}
                                  <div className="mt-2 flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEditSession(session)}>
                                      <Edit className="h-3 w-3 mr-1" />
                                      수정
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-500 hover:text-red-700"
                                      onClick={() => handleCancelSession(session)}
                                    >
                                      취소
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-40 border rounded-md">
                              <p className="text-muted-foreground mb-2">예정된 레슨이 없습니다</p>
                              <Button variant="outline" size="sm" onClick={() => setIsSessionDialogOpen(true)}>
                                세션 예약하기
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* 레슨 추가 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>새 레슨 추가</DialogTitle>
            <DialogDescription>
              새로운 레슨 정보를 입력하세요. 별표(*)가 표시된 항목은 필수 입력 사항입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">레슨 이름 *</Label>
                <Input
                  id="title"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  placeholder="레슨 이름을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">레슨 유형</Label>
                <select
                  id="type"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newLesson.type}
                  onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}
                >
                  <option value="개인 PT">개인 PT</option>
                  <option value="그룹 PT">그룹 PT</option>
                  <option value="요가">요가</option>
                  <option value="필라테스">필라테스</option>
                  <option value="수영">수영</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">소요 시간 (분)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newLesson.duration}
                  onChange={(e) => setNewLesson({ ...newLesson, duration: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">정원</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newLesson.capacity}
                  onChange={(e) => setNewLesson({ ...newLesson, capacity: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">레슨 설명</Label>
              <Textarea
                id="description"
                value={newLesson.description}
                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                placeholder="레슨에 대한 설명을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>레슨 일정 *</Label>
                <span className="text-xs text-muted-foreground">최소 1개 이상의 일정이 필요합니다</span>
              </div>

              <div className="border rounded-md p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-day">요일</Label>
                    <select
                      id="schedule-day"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newSchedule.day}
                      onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })}
                    >
                      <option value="월">월요일</option>
                      <option value="화">화요일</option>
                      <option value="수">수요일</option>
                      <option value="목">목요일</option>
                      <option value="금">금요일</option>
                      <option value="토">토요일</option>
                      <option value="일">일요일</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time">시간</Label>
                    <Input
                      id="schedule-time"
                      value={newSchedule.time}
                      onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                      placeholder="예: 10:00-11:00"
                    />
                  </div>
                </div>
                <Button type="button" onClick={handleAddSchedule} className="w-full">
                  일정 추가
                </Button>
              </div>

              {newLesson.schedule.length > 0 && (
                <div className="border rounded-md p-4 mt-4">
                  <h4 className="font-medium mb-2">추가된 일정 ({newLesson.schedule.length}개)</h4>
                  <div className="space-y-2">
                    {newLesson.schedule.map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between bg-secondary/20 p-2 rounded-md">
                        <div>
                          <span className="font-medium">{getDayInKorean(schedule.day)}</span>
                          <span className="text-sm text-muted-foreground ml-2">{schedule.time}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveSchedule(index)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddLesson} disabled={isSubmitting}>
              {isSubmitting ? "추가 중..." : "레슨 추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 레슨 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>레슨 수정</DialogTitle>
            <DialogDescription>레슨 정보를 수정하세요. 별표(*)가 표시된 항목은 필수 입력 사항입니다.</DialogDescription>
          </DialogHeader>
          {selectedLesson && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">레슨 이름 *</Label>
                  <Input
                    id="edit-title"
                    value={selectedLesson.title}
                    onChange={(e) => setSelectedLesson({ ...selectedLesson, title: e.target.value })}
                    placeholder="레슨 이름을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">레슨 유형</Label>
                  <select
                    id="edit-type"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedLesson.type}
                    onChange={(e) => setSelectedLesson({ ...selectedLesson, type: e.target.value })}
                  >
                    <option value="개인 PT">개인 PT</option>
                    <option value="그룹 PT">그룹 PT</option>
                    <option value="요가">요가</option>
                    <option value="필라테스">필라테스</option>
                    <option value="수영">수영</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">소요 시간 (분)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={selectedLesson.duration}
                    onChange={(e) => setSelectedLesson({ ...selectedLesson, duration: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">정원</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    value={selectedLesson.capacity}
                    onChange={(e) => setSelectedLesson({ ...selectedLesson, capacity: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">레슨 설명</Label>
                <Textarea
                  id="edit-description"
                  value={selectedLesson.description || ""}
                  onChange={(e) => setSelectedLesson({ ...selectedLesson, description: e.target.value })}
                  placeholder="레슨에 대한 설명을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>레슨 일정 *</Label>
                  <span className="text-xs text-muted-foreground">최소 1개 이상의 일정이 필요합니다</span>
                </div>

                <div className="border rounded-md p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-schedule-day">요일</Label>
                      <select
                        id="edit-schedule-day"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newSchedule.day}
                        onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })}
                      >
                        <option value="월">월요일</option>
                        <option value="화">화요일</option>
                        <option value="수">수요일</option>
                        <option value="목">목요일</option>
                        <option value="금">금요일</option>
                        <option value="토">토요일</option>
                        <option value="일">일요일</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-schedule-time">시간</Label>
                      <Input
                        id="edit-schedule-time"
                        value={newSchedule.time}
                        onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                        placeholder="예: 10:00-11:00"
                      />
                    </div>
                  </div>
                  <Button type="button" onClick={handleAddSchedule} className="w-full">
                    일정 추가
                  </Button>
                </div>

                {selectedLesson.schedule.length > 0 && (
                  <div className="border rounded-md p-4 mt-4">
                    <h4 className="font-medium mb-2">추가된 일정 ({selectedLesson.schedule.length}개)</h4>
                    <div className="space-y-2">
                      {selectedLesson.schedule.map((schedule, index) => (
                        <div key={index} className="flex items-center justify-between bg-secondary/20 p-2 rounded-md">
                          <div>
                            <span className="font-medium">{getDayInKorean(schedule.day)}</span>
                            <span className="text-sm text-muted-foreground ml-2">{schedule.time}</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveSchedule(index)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEditLesson} disabled={isSubmitting}>
              {isSubmitting ? "수정 중..." : "저장하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 레슨 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>레슨 삭제</DialogTitle>
            <DialogDescription>정말로 이 레슨을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          {selectedLesson && (
            <div className="py-4">
              <p className="mb-2">
                <span className="font-medium">{selectedLesson.title}</span> 레슨을 삭제합니다.
              </p>
              <p className="text-sm text-muted-foreground">이 레슨과 관련된 모든 세션 데이터가 함께 삭제됩니다.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteLesson} disabled={isSubmitting}>
              {isSubmitting ? "삭제 중..." : "삭제 확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 세션 예약 다이얼로그 */}
      <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedSession ? "레슨 세션 수정" : "레슨 세션 예약"}</DialogTitle>
            <DialogDescription>
              {selectedSession
                ? "레슨 세션 정보를 수정하세요. 레슨, 날짜, 시간, 참여 회원을 변경할 수 있습니다."
                : "레슨 세션을 예약하세요. 레슨, 날짜, 시간, 참여 회원을 선택해주세요."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="session-lesson">레슨 선택 *</Label>
              <select
                id="session-lesson"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedLesson?.id || ""}
                onChange={(e) => {
                  const lesson = lessons.find((l) => l.id === e.target.value)
                  setSelectedLesson(lesson || null)
                  if (lesson && lesson.schedule.length > 0) {
                    setNewSession({
                      ...newSession,
                      lessonId: lesson.id,
                      lessonTitle: lesson.title,
                      time: lesson.schedule[0].time,
                    })
                  }
                }}
              >
                <option value="" disabled>
                  레슨을 선택하세요
                </option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title} ({lesson.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-date">날짜 선택 *</Label>
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
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus locale={ko} />
                </PopoverContent>
              </Popover>
            </div>

            {selectedLesson && (
              <div className="space-y-2">
                <Label htmlFor="session-time">시간 선택 *</Label>
                <select
                  id="session-time"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newSession.time}
                  onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                >
                  {selectedLesson.schedule.map((schedule, index) => (
                    <option key={index} value={schedule.time}>
                      {schedule.time} ({getDayInKorean(schedule.day)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label>참여 회원 선택 *</Label>
              <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                {members.length > 0 ? (
                  <div className="space-y-2">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`member-${member.id}`}
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => toggleMemberSelection(member.id)}
                          className="mr-2"
                        />
                        <label htmlFor={`member-${member.id}`} className="text-sm">
                          {member.name} ({member.email})
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    등록된 회원이 없습니다. 먼저 회원을 등록해주세요.
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">선택된 회원: {selectedMembers.length}명</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-notes">메모</Label>
              <Textarea
                id="session-notes"
                value={newSession.notes}
                onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                placeholder="세션에 대한 메모를 입력하세요"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsSessionDialogOpen(false)
                setSelectedMembers([])
                setSelectedSession(null)
              }}
            >
              취소
            </Button>
            <Button
              onClick={handleCreateSession}
              disabled={isSubmitting || !selectedLesson || !selectedDate || selectedMembers.length === 0}
            >
              {isSubmitting
                ? selectedSession
                  ? "수정 중..."
                  : "예약 중..."
                : selectedSession
                  ? "세션 수정"
                  : "세션 예약"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

