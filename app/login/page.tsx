"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Building, Dumbbell, Users } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "resident"
  const redirectPath = searchParams.get("redirect") // 리다이렉트 경로 가져오기
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // 테스트 계정 정보 (실제 프로덕션에서는 제거해야 함)
  const testAccounts = {
    resident: { email: "resident@example.com", password: "password123", role: "resident" },
    trainer: { email: "trainer@example.com", password: "password123", role: "trainer" },
    admin: { email: "admin@example.com", password: "password123", role: "admin" },
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 테스트 계정 자동 입력
  const fillTestAccount = (role: string) => {
    const account = testAccounts[role as keyof typeof testAccounts]
    if (account) {
      setFormData({
        email: account.email,
        password: account.password,
      })
    }
  }

  // 역할이 변경될 때 해당 역할의 테스트 계정 정보 자동 입력
  useEffect(() => {
    fillTestAccount(defaultRole)
  }, [defaultRole])

  const handleSubmit = async (e: React.FormEvent, role: string) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // 이메일 주소로 올바른 역할 확인
      let correctRole = role

      // 테스트 계정의 경우 이메일 주소로 올바른 역할 확인
      Object.entries(testAccounts).forEach(([accountRole, account]) => {
        if (account.email === formData.email) {
          correctRole = accountRole
        }
      })

      console.log("로그인 시도:", { ...formData, role: correctRole })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: correctRole, // 올바른 역할 사용
        }),
      })

      console.log("로그인 응답 상태:", response.status)

      // 응답이 JSON이 아닌 경우 처리
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("서버 응답이 JSON 형식이 아닙니다:", contentType)
        throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }

      const data = await response.json()

      if (!response.ok) {
        console.error("로그인 실패 응답:", data)
        throw new Error(data.error || "로그인에 실패했습니다.")
      }

      console.log("로그인 성공:", data)

      // 인증 토큰이 있으면 로컬 스토리지에 저장
      if (data.authToken) {
        localStorage.setItem("authToken", data.authToken)
      }

      // 사용자 세션 정보도 로컬 스토리지에 저장
      if (data.user) {
        localStorage.setItem("user-session", JSON.stringify(data.user))
      }

      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      })

      // 리다이렉트 경로가 있으면 해당 경로로, 없으면 대시보드로 이동
      const redirectUrl = searchParams.get("redirect") || `/${role}/dashboard`
      router.push(redirectUrl)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "로그인 실패",
        description: error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      setError(error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lyTW3wLdZpCvqsXZM5Kdabm0YK3OPB.png"
              alt="천안 불당호반써밋플레이스센터시티 로고"
              width={180}
              height={40}
            />
          </div>
          <CardTitle className="text-2xl text-primary">천안 불당호반써밋플레이스센터시티</CardTitle>
          <CardDescription>계정에 로그인하여 서비스를 이용하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultRole} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="resident" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">입주민</span>
              </TabsTrigger>
              <TabsTrigger value="trainer" className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                <span className="hidden sm:inline">트레이너</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span className="hidden sm:inline">관리소</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resident">
              <form onSubmit={(e) => handleSubmit(e, "resident")}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="resident-email">이메일</Label>
                    <Input
                      id="resident-email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="resident-password">비밀번호</Label>
                    <Input
                      id="resident-password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "로그인 중..." : "입주민 로그인"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="trainer">
              <form onSubmit={(e) => handleSubmit(e, "trainer")}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="trainer-email">이메일</Label>
                    <Input
                      id="trainer-email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trainer-password">비밀번호</Label>
                    <Input
                      id="trainer-password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "로그인 중..." : "트레이너 로그인"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={(e) => handleSubmit(e, "admin")}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="admin-email">이메일</Label>
                    <Input
                      id="admin-email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="admin-password">비밀번호</Label>
                    <Input
                      id="admin-password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "로그인 중..." : "관리소 로그인"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>테스트 계정이 자동으로 입력됩니다.</p>
          </div>
          {error && <div className="mt-4 text-center text-sm text-red-500">{error}</div>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-center text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link href="/register" className="text-primary hover:underline">
              회원가입
            </Link>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            <Link href="/" className="text-primary hover:underline">
              홈으로 돌아가기
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

