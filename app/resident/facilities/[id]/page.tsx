"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Calendar, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface Facility {
  id: string
  name: string
  description: string
  image: string
  hours: string
  location: string
  status: "open" | "maintenance" | "closed"
  capacity: number
  currentUsers: number
  rules?: string[]
  amenities?: string[]
  contactInfo?: string
}

export default function FacilityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [facility, setFacility] = useState<Facility | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authToken, setAuthToken] = useState<string | null>(null)

  // 로그인 시 저장된 인증 토큰 가져오기
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setAuthToken(token)
    }
  }, [])

  // 시설 정보 가져오기
  useEffect(() => {
    const fetchFacility = async () => {
      try {
        setIsLoading(true)

        // API 요청 URL 구성
        let url = `/api/facilities?id=${params.id}`
        if (authToken) {
          url += `&token=${authToken}`
        }

        const response = await fetch(url, {
          headers: {
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
          },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("시설 정보를 가져오는데 실패했습니다.")
        }

        const data = await response.json()
        setFacility(data)
      } catch (error) {
        console.error("Error fetching facility:", error)
        toast({
          title: "오류",
          description: "시설 정보를 가져오는데 실패했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchFacility()
    }
  }, [params.id, toast, authToken])

  // 상태에 따른 배지 색상 및 텍스트
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-500">이용 가능</Badge>
      case "maintenance":
        return <Badge variant="destructive">점검 중</Badge>
      case "closed":
        return <Badge variant="outline">운영 종료</Badge>
      default:
        return <Badge variant="outline">상태 미확인</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:flex flex-col w-64 border-r px-4 py-6">
          <MainNav userRole="resident" />
        </div>
        <div className="flex-1 p-8 flex justify-center items-center">
          <p>시설 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!facility) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:flex flex-col w-64 border-r px-4 py-6">
          <MainNav userRole="resident" />
        </div>
        <div className="flex-1 p-8 flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-4">시설을 찾을 수 없습니다</h2>
          <Button asChild>
            <Link href="/resident/facilities">시설 목록으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    )
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
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
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
                  className="h-4 w-4"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </Button>
              <h1 className="text-2xl font-bold">{facility.name}</h1>
              <div>{getStatusBadge(facility.status)}</div>
            </div>
            <Button disabled={facility.status !== "open"} asChild>
              <Link href={`/resident/facilities/${facility.id}/reserve`}>예약하기</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="p-0">
                  <div className="relative">
                    <Image
                      src={facility.image || "/placeholder.svg"}
                      alt={facility.name}
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">{facility.name}</h2>
                  <p className="text-muted-foreground mb-6">{facility.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="text-sm font-medium">운영 시간</p>
                        <p className="text-sm text-muted-foreground">{facility.hours}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="text-sm font-medium">위치</p>
                        <p className="text-sm text-muted-foreground">{facility.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="text-sm font-medium">수용 인원</p>
                        <p className="text-sm text-muted-foreground">최대 {facility.capacity}명</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="text-sm font-medium">현재 이용 현황</p>
                        <p className="text-sm text-muted-foreground">
                          현재 {facility.currentUsers}/{facility.capacity}명 이용 중
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="info">
                <TabsList>
                  <TabsTrigger value="info">상세 정보</TabsTrigger>
                  <TabsTrigger value="rules">이용 규칙</TabsTrigger>
                  <TabsTrigger value="amenities">시설 및 편의</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="p-4 border rounded-md mt-2">
                  <h3 className="font-medium mb-2">시설 소개</h3>
                  <p className="text-muted-foreground mb-4">{facility.description}</p>

                  <h3 className="font-medium mb-2">운영 시간</h3>
                  <p className="text-muted-foreground mb-4">{facility.hours}</p>

                  <h3 className="font-medium mb-2">위치</h3>
                  <p className="text-muted-foreground mb-4">{facility.location}</p>

                  {facility.contactInfo && (
                    <>
                      <h3 className="font-medium mb-2">연락처</h3>
                      <p className="text-muted-foreground">{facility.contactInfo}</p>
                    </>
                  )}
                </TabsContent>
                <TabsContent value="rules" className="p-4 border rounded-md mt-2">
                  <h3 className="font-medium mb-2">이용 규칙</h3>
                  {facility.rules && facility.rules.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {facility.rules.map((rule, index) => (
                        <li key={index} className="text-muted-foreground">
                          {rule}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">등록된 이용 규칙이 없습니다.</p>
                  )}
                </TabsContent>
                <TabsContent value="amenities" className="p-4 border rounded-md mt-2">
                  <h3 className="font-medium mb-2">시설 및 편의</h3>
                  {facility.amenities && facility.amenities.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {facility.amenities.map((amenity, index) => (
                        <li key={index} className="text-muted-foreground">
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">등록된 시설 및 편의 정보가 없습니다.</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>예약 정보</CardTitle>
                  <CardDescription>시설 예약 관련 정보</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">상태</span>
                    <span>{getStatusBadge(facility.status)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">운영 시간</span>
                    <span>{facility.hours}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">최대 수용 인원</span>
                    <span>{facility.capacity}명</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">현재 이용 인원</span>
                    <span>{facility.currentUsers}명</span>
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="w-full" disabled={facility.status !== "open"} asChild>
                      <Link href={`/resident/facilities/${facility.id}/reserve`}>
                        <Calendar className="mr-2 h-4 w-4" />
                        예약하기
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>위치 정보</CardTitle>
                  <CardDescription>시설 위치 안내</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-muted rounded-md flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{facility.location}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

