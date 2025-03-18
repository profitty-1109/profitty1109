"use client"

import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Key, Moon, Sun, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ResidentProfile {
  id: string
  name: string
  email: string
  phone: string
  unit: string
  moveInDate: string
  familyMembers: number
  profileImage?: string
  interests: string[]
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  facilityReminder: boolean
  lessonReminder: boolean
  communityPosts: boolean
  notices: boolean
}

export default function ResidentSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  // 프로필 상태
  const [profile, setProfile] = useState<ResidentProfile>({
    id: "",
    name: "",
    email: "",
    phone: "",
    unit: "",
    moveInDate: "",
    familyMembers: 1,
    interests: [],
  })

  // 알림 설정 상태
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    facilityReminder: true,
    lessonReminder: true,
    communityPosts: true,
    notices: true,
  })

  // 비밀번호 변경 상태
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // 새 관심사 입력 상태
  const [newInterest, setNewInterest] = useState("")

  // 로컬 스토리지에서 인증 토큰 가져오기
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setAuthToken(token)
    }

    // 테마 설정 가져오기
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
    if (savedTheme) {
      setTheme(savedTheme)
    }

    // 문서에 테마 클래스 적용
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // 입주민 프로필 데이터 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)

        // API 요청 URL 구성
        let url = "/api/resident-profile"
        if (authToken) {
          url += `?token=${authToken}`
        }

        console.log("Fetching profile from:", url)

        const response = await fetch(url, {
          headers: {
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
          },
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
              window.location.href = "/login?redirect=/resident/settings"
            }, 3000)

            return
          }

          throw new Error(errorData.error || "프로필 정보를 가져오는데 실패했습니다.")
        }

        const data = await response.json()
        console.log("가져온 프로필 데이터:", data)
        setProfile(data)

        // 알림 설정도 가져오기
        if (data.notificationSettings) {
          setNotifications(data.notificationSettings)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "오류",
          description: error instanceof Error ? error.message : "프로필 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        })
        // 오류 발생 시 기본 데이터 설정
        setProfile({
          id: "1",
          name: "홍길동",
          email: "hong@example.com",
          phone: "010-1234-5678",
          unit: "101동 1001호",
          moveInDate: "2023-01-15",
          familyMembers: 3,
          interests: ["헬스", "수영", "요가"],
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [toast, authToken])

  // 프로필 저장 처리
  const handleSaveProfile = async () => {
    setIsSaving(true)

    try {
      // API 요청 URL 구성
      let url = "/api/resident-profile"
      if (authToken) {
        url += `?token=${authToken}`
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "프로필 저장에 실패했습니다.")
      }

      toast({
        title: "저장 완료",
        description: "프로필 정보가 성공적으로 저장되었습니다.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "저장 실패",
        description: error instanceof Error ? error.message : "프로필 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 알림 설정 저장 처리
  const handleSaveNotifications = async () => {
    setIsSaving(true)

    try {
      // API 요청 URL 구성
      let url = "/api/resident-notifications"
      if (authToken) {
        url += `?token=${authToken}`
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
        body: JSON.stringify(notifications),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "알림 설정 저장에 실패했습니다.")
      }

      toast({
        title: "저장 완료",
        description: "알림 설정이 성공적으로 저장되었습니다.",
      })
    } catch (error) {
      console.error("Error saving notifications:", error)
      toast({
        title: "저장 실패",
        description: error instanceof Error ? error.message : "알림 설정 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 비밀번호 변경 처리
  const handleChangePassword = async () => {
    // 비밀번호 유효성 검사
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호는 8자 이상이어야 합니다.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // API 요청 URL 구성
      let url = "/api/auth/change-password"
      if (authToken) {
        url += `?token=${authToken}`
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        credentials: "include",
        body: JSON.stringify(passwordData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "비밀번호 변경에 실패했습니다.")
      }

      toast({
        title: "변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      })

      // 폼 초기화
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Error changing password:", error)
      toast({
        title: "변경 실패",
        description: error instanceof Error ? error.message : "비밀번호 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 테마 변경 처리
  const handleChangeTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      // 시스템 설정에 따라 테마 적용
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    toast({
      title: "테마 변경",
      description: `테마가 ${
        newTheme === "light" ? "라이트 모드" : newTheme === "dark" ? "다크 모드" : "시스템 설정"
      }로 변경되었습니다.`,
    })
  }

  // 관심사 추가
  const handleAddInterest = () => {
    if (!newInterest.trim()) {
      toast({
        title: "입력 오류",
        description: "관심사를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setProfile({
      ...profile,
      interests: [...profile.interests, newInterest.trim()],
    })
    setNewInterest("")
  }

  // 관심사 삭제
  const handleRemoveInterest = (index: number) => {
    const updatedInterests = [...profile.interests]
    updatedInterests.splice(index, 1)
    setProfile({
      ...profile,
      interests: updatedInterests,
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
            <h1 className="text-2xl font-bold">설정</h1>
          </div>

          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">프로필</TabsTrigger>
              <TabsTrigger value="notifications">알림 설정</TabsTrigger>
              <TabsTrigger value="security">보안</TabsTrigger>
              <TabsTrigger value="appearance">테마</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>프로필 정보</CardTitle>
                  <CardDescription>입주민 프로필 정보를 관리합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={profile.profileImage || "/placeholder.svg?height=96&width=96"}
                          alt={profile.name}
                        />
                        <AvatarFallback>{profile.name?.slice(0, 2).toUpperCase() || "홍길"}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        이미지 변경
                      </Button>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">이름</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">이메일</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">연락처</Label>
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="unit">세대 정보</Label>
                          <Input
                            id="unit"
                            value={profile.unit}
                            onChange={(e) => setProfile({ ...profile, unit: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="moveInDate">입주일</Label>
                          <Input
                            id="moveInDate"
                            type="date"
                            value={profile.moveInDate}
                            onChange={(e) => setProfile({ ...profile, moveInDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="familyMembers">가족 구성원 수</Label>
                          <Select
                            value={profile.familyMembers.toString()}
                            onValueChange={(value) => setProfile({ ...profile, familyMembers: Number.parseInt(value) })}
                          >
                            <SelectTrigger id="familyMembers">
                              <SelectValue placeholder="가족 구성원 수 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1명</SelectItem>
                              <SelectItem value="2">2명</SelectItem>
                              <SelectItem value="3">3명</SelectItem>
                              <SelectItem value="4">4명</SelectItem>
                              <SelectItem value="5">5명 이상</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>관심사</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          placeholder="새 관심사 추가 (예: 헬스, 수영, 요가)"
                        />
                        <Button type="button" onClick={handleAddInterest}>
                          추가
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            {interest}
                            <button
                              className="ml-2 text-muted-foreground hover:text-foreground"
                              onClick={() => handleRemoveInterest(index)}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? "저장 중..." : "프로필 저장"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>알림 설정</CardTitle>
                  <CardDescription>알림 수신 방법 및 유형을 설정합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">알림 수신 방법</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4" />
                          <Label htmlFor="email-notifications">이메일 알림</Label>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={notifications.email}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4" />
                          <Label htmlFor="push-notifications">푸시 알림</Label>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={notifications.push}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4" />
                          <Label htmlFor="sms-notifications">SMS 알림</Label>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={notifications.sms}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">알림 유형</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="facility-reminder-notifications">시설 예약 알림</Label>
                        <Switch
                          id="facility-reminder-notifications"
                          checked={notifications.facilityReminder}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, facilityReminder: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="lesson-reminder-notifications">레슨 알림</Label>
                        <Switch
                          id="lesson-reminder-notifications"
                          checked={notifications.lessonReminder}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, lessonReminder: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="community-posts-notifications">커뮤니티 게시글</Label>
                        <Switch
                          id="community-posts-notifications"
                          checked={notifications.communityPosts}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, communityPosts: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notices-notifications">공지사항</Label>
                        <Switch
                          id="notices-notifications"
                          checked={notifications.notices}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, notices: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveNotifications} disabled={isSaving}>
                    {isSaving ? "저장 중..." : "알림 설정 저장"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>보안 설정</CardTitle>
                  <CardDescription>비밀번호 변경 및 계정 보안 설정을 관리합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">비밀번호 변경</h3>
                    <div className="space-y-2">
                      <Label htmlFor="current-password">현재 비밀번호</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">새 비밀번호</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">비밀번호 확인</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      />
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      disabled={
                        isSaving ||
                        !passwordData.currentPassword ||
                        !passwordData.newPassword ||
                        !passwordData.confirmPassword
                      }
                    >
                      <Key className="h-4 w-4 mr-2" />
                      {isSaving ? "변경 중..." : "비밀번호 변경"}
                    </Button>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">계정 보안</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="two-factor-auth">2단계 인증</Label>
                        <Switch id="two-factor-auth" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        2단계 인증을 활성화하면 로그인 시 추가 인증 코드가 필요합니다.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>테마 설정</CardTitle>
                  <CardDescription>앱의 테마를 설정합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className={`border rounded-md p-4 cursor-pointer ${theme === "light" ? "border-primary" : "border-border"}`}
                        onClick={() => handleChangeTheme("light")}
                      >
                        <div className="flex justify-center mb-2">
                          <Sun className="h-6 w-6" />
                        </div>
                        <p className="text-center font-medium">라이트 모드</p>
                      </div>
                      <div
                        className={`border rounded-md p-4 cursor-pointer ${theme === "system" ? "border-primary" : "border-border"}`}
                        onClick={() => handleChangeTheme("system")}
                      >
                        <div className="flex justify-center mb-2">
                          <div className="flex">
                            <Sun className="h-6 w-6" />
                            <Moon className="h-6 w-6" />
                          </div>
                        </div>
                        <p className="text-center font-medium">시스템 설정</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      시스템 설정을 선택하면 기기의 테마 설정에 따라 자동으로 테마가 변경됩니다.
                    </p>
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

