"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Building, Dumbbell, Users } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<string>("resident")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // 입주민 폼 상태
  const [residentForm, setResidentForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    building: "",
    unit: "",
    phone: "",
    agreeTerms: false,
  })

  // 트레이너 폼 상태
  const [trainerForm, setTrainerForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    specialization: "",
    certification: "",
    experience: "",
    phone: "",
    agreeTerms: false,
  })

  // 관리소 폼 상태
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    position: "",
    department: "",
    employeeId: "",
    phone: "",
    agreeTerms: false,
  })

  // 입주민 폼 변경 핸들러
  const handleResidentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setResidentForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // 트레이너 폼 변경 핸들러
  const handleTrainerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setTrainerForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // 관리소 폼 변경 핸들러
  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setAdminForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Select 컴포넌트 변경 핸들러
  const handleSelectChange = (value: string, formType: string, field: string) => {
    if (formType === "resident") {
      setResidentForm((prev) => ({ ...prev, [field]: value }))
    } else if (formType === "trainer") {
      setTrainerForm((prev) => ({ ...prev, [field]: value }))
    } else if (formType === "admin") {
      setAdminForm((prev) => ({ ...prev, [field]: value }))
    }
  }

  // 폼 유효성 검사
  const validateForm = (formData: any, role: string) => {
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return "유효한 이메일 주소를 입력해주세요."
    }

    // 비밀번호 검사
    if (formData.password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다."
    }

    // 비밀번호 확인 검사
    if (formData.password !== formData.confirmPassword) {
      return "비밀번호가 일치하지 않습니다."
    }

    // 이름 검사
    if (formData.name.trim().length < 2) {
      return "이름을 입력해주세요."
    }

    // 역할별 추가 검사
    if (role === "resident") {
      if (!formData.building || !formData.unit) {
        return "동/호수 정보를 입력해주세요."
      }
    } else if (role === "trainer") {
      if (!formData.specialization) {
        return "전문 분야를 선택해주세요."
      }
    } else if (role === "admin") {
      if (!formData.position || !formData.department) {
        return "직책과 부서 정보를 입력해주세요."
      }
    }

    // 약관 동의 검사
    if (!formData.agreeTerms) {
      return "이용약관에 동의해주세요."
    }

    return null
  }

  // 회원가입 제출 핸들러
  const handleSubmit = async (e: React.FormEvent, role: string) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // 현재 역할에 맞는 폼 데이터 선택
    const formData = role === "resident" ? residentForm : role === "trainer" ? trainerForm : adminForm

    // 폼 유효성 검사
    const validationError = validateForm(formData, role)
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "회원가입에 실패했습니다.")
      }

      toast({
        title: "회원가입 성공",
        description: "회원가입이 완료되었습니다. 로그인해주세요.",
      })

      // 로그인 페이지로 이동
      router.push("/login?role=" + role)
    } catch (error) {
      console.error("Registration error:", error)
      setError(error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.")
      toast({
        title: "회원가입 실패",
        description: error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.",
        variant: "destructive",
      })
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
          <CardTitle className="text-2xl text-primary">회원가입</CardTitle>
          <CardDescription>계정 유형을 선택하고 정보를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="resident" className="w-full" onValueChange={setActiveTab}>
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

            {/* 입주민 회원가입 폼 */}
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
                      value={residentForm.email}
                      onChange={handleResidentChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="resident-password">비밀번호</Label>
                      <Input
                        id="resident-password"
                        name="password"
                        type="password"
                        placeholder="8자 이상 입력"
                        value={residentForm.password}
                        onChange={handleResidentChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="resident-confirm-password">비밀번호 확인</Label>
                      <Input
                        id="resident-confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="비밀번호 재입력"
                        value={residentForm.confirmPassword}
                        onChange={handleResidentChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="resident-name">이름</Label>
                    <Input
                      id="resident-name"
                      name="name"
                      type="text"
                      placeholder="홍길동"
                      value={residentForm.name}
                      onChange={handleResidentChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="resident-building">동</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange(value, "resident", "building")}
                        value={residentForm.building}
                      >
                        <SelectTrigger id="resident-building">
                          <SelectValue placeholder="동 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="101">101동</SelectItem>
                          <SelectItem value="102">102동</SelectItem>
                          <SelectItem value="103">103동</SelectItem>
                          <SelectItem value="104">104동</SelectItem>
                          <SelectItem value="105">105동</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="resident-unit">호수</Label>
                      <Input
                        id="resident-unit"
                        name="unit"
                        type="text"
                        placeholder="예: 1201"
                        value={residentForm.unit}
                        onChange={handleResidentChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="resident-phone">연락처</Label>
                    <Input
                      id="resident-phone"
                      name="phone"
                      type="tel"
                      placeholder="010-0000-0000"
                      value={residentForm.phone}
                      onChange={handleResidentChange}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="resident-terms"
                      name="agreeTerms"
                      checked={residentForm.agreeTerms}
                      onCheckedChange={(checked) =>
                        setResidentForm((prev) => ({ ...prev, agreeTerms: checked as boolean }))
                      }
                    />
                    <label
                      htmlFor="resident-terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <span>이용약관 및 개인정보 처리방침에 동의합니다.</span>
                      <Link href="/terms" className="text-primary ml-1 hover:underline">
                        (약관 보기)
                      </Link>
                    </label>
                  </div>
                  <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? "처리 중..." : "입주민으로 가입하기"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* 트레이너 회원가입 폼 */}
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
                      value={trainerForm.email}
                      onChange={handleTrainerChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="trainer-password">비밀번호</Label>
                      <Input
                        id="trainer-password"
                        name="password"
                        type="password"
                        placeholder="8자 이상 입력"
                        value={trainerForm.password}
                        onChange={handleTrainerChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="trainer-confirm-password">비밀번호 확인</Label>
                      <Input
                        id="trainer-confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="비밀번호 재입력"
                        value={trainerForm.confirmPassword}
                        onChange={handleTrainerChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trainer-name">이름</Label>
                    <Input
                      id="trainer-name"
                      name="name"
                      type="text"
                      placeholder="홍길동"
                      value={trainerForm.name}
                      onChange={handleTrainerChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trainer-specialization">전문 분야</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange(value, "trainer", "specialization")}
                      value={trainerForm.specialization}
                    >
                      <SelectTrigger id="trainer-specialization">
                        <SelectValue placeholder="전문 분야 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt">개인 PT</SelectItem>
                        <SelectItem value="yoga">요가</SelectItem>
                        <SelectItem value="pilates">필라테스</SelectItem>
                        <SelectItem value="swimming">수영</SelectItem>
                        <SelectItem value="golf">골프</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trainer-certification">자격증</Label>
                    <Input
                      id="trainer-certification"
                      name="certification"
                      type="text"
                      placeholder="보유 자격증 (예: 생활스포츠지도사 2급)"
                      value={trainerForm.certification}
                      onChange={handleTrainerChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trainer-experience">경력</Label>
                    <Input
                      id="trainer-experience"
                      name="experience"
                      type="text"
                      placeholder="경력 사항 (예: 5년)"
                      value={trainerForm.experience}
                      onChange={handleTrainerChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trainer-phone">연락처</Label>
                    <Input
                      id="trainer-phone"
                      name="phone"
                      type="tel"
                      placeholder="010-0000-0000"
                      value={trainerForm.phone}
                      onChange={handleTrainerChange}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="trainer-terms"
                      name="agreeTerms"
                      checked={trainerForm.agreeTerms}
                      onCheckedChange={(checked) =>
                        setTrainerForm((prev) => ({ ...prev, agreeTerms: checked as boolean }))
                      }
                    />
                    <label
                      htmlFor="trainer-terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <span>이용약관 및 개인정보 처리방침에 동의합니다.</span>
                      <Link href="/terms" className="text-primary ml-1 hover:underline">
                        (약관 보기)
                      </Link>
                    </label>
                  </div>
                  <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? "처리 중..." : "트레이너로 가입하기"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* 관리소 회원가입 폼 */}
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
                      value={adminForm.email}
                      onChange={handleAdminChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="admin-password">비밀번호</Label>
                      <Input
                        id="admin-password"
                        name="password"
                        type="password"
                        placeholder="8자 이상 입력"
                        value={adminForm.password}
                        onChange={handleAdminChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="admin-confirm-password">비밀번호 확인</Label>
                      <Input
                        id="admin-confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="비밀번호 재입력"
                        value={adminForm.confirmPassword}
                        onChange={handleAdminChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="admin-name">이름</Label>
                    <Input
                      id="admin-name"
                      name="name"
                      type="text"
                      placeholder="홍길동"
                      value={adminForm.name}
                      onChange={handleAdminChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="admin-position">직책</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange(value, "admin", "position")}
                        value={adminForm.position}
                      >
                        <SelectTrigger id="admin-position">
                          <SelectValue placeholder="직책 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">관리소장</SelectItem>
                          <SelectItem value="assistant">부관리소장</SelectItem>
                          <SelectItem value="staff">일반 직원</SelectItem>
                          <SelectItem value="security">보안 담당</SelectItem>
                          <SelectItem value="facility">시설 담당</SelectItem>
                          <SelectItem value="other">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="admin-department">부서</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange(value, "admin", "department")}
                        value={adminForm.department}
                      >
                        <SelectTrigger id="admin-department">
                          <SelectValue placeholder="부서 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="management">관리부</SelectItem>
                          <SelectItem value="security">보안부</SelectItem>
                          <SelectItem value="facility">시설부</SelectItem>
                          <SelectItem value="cleaning">미화부</SelectItem>
                          <SelectItem value="community">커뮤니티부</SelectItem>
                          <SelectItem value="other">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="admin-employeeId">사원번호</Label>
                    <Input
                      id="admin-employeeId"
                      name="employeeId"
                      type="text"
                      placeholder="사원번호 입력"
                      value={adminForm.employeeId}
                      onChange={handleAdminChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="admin-phone">연락처</Label>
                    <Input
                      id="admin-phone"
                      name="phone"
                      type="tel"
                      placeholder="010-0000-0000"
                      value={adminForm.phone}
                      onChange={handleAdminChange}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="admin-terms"
                      name="agreeTerms"
                      checked={adminForm.agreeTerms}
                      onCheckedChange={(checked) =>
                        setAdminForm((prev) => ({ ...prev, agreeTerms: checked as boolean }))
                      }
                    />
                    <label
                      htmlFor="admin-terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <span>이용약관 및 개인정보 처리방침에 동의합니다.</span>
                      <Link href="/terms" className="text-primary ml-1 hover:underline">
                        (약관 보기)
                      </Link>
                    </label>
                  </div>
                  <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? "처리 중..." : "관리소 직원으로 가입하기"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          {error && <div className="mt-4 text-center text-sm text-red-500">{error}</div>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-center text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link href={`/login?role=${activeTab}`} className="text-primary hover:underline">
              로그인
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

