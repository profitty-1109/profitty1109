import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Building, Dumbbell, Users } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lyTW3wLdZpCvqsXZM5Kdabm0YK3OPB.png"
              alt="천안 불당호반써밋플레이스센터시티 로고"
              width={180}
              height={40}
              className="mr-3"
            />
            <div>
              <h1 className="text-2xl font-bold">아파트 커뮤니티 관리 앱</h1>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              asChild
              className="font-semibold bg-white text-black border-gray-300 hover:bg-gray-50"
            >
              <Link href="/login">로그인</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="text-black font-semibold bg-white border-gray-300 hover:bg-gray-50"
            >
              <Link href="/register">회원가입</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4 text-primary">
            천안 불당호반써밋플레이스센터시티
            <br />
            아파트 커뮤니티 관리 앱에 오신 것을 환영합니다
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            입주민, 관리소 직원, 트레이너를 위한 맞춤형 서비스를 제공합니다.
            <br />
            시설 예약, 정보 공유, 커뮤니티 활동 참여, 운동 관리 등을 효율적으로 지원합니다.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-2 border-primary/20 hover:border-primary transition-colors">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 mx-auto text-primary mb-2" />
              <CardTitle>입주민</CardTitle>
              <CardDescription>개인 맞춤형 대시보드, 시설 예약, 레슨 예약, 운동 일지</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>시설 사용 현황 확인 및 예약</li>
                <li>레슨 예약 및 관리</li>
                <li>개인 운동 일지 관리</li>
                <li>커뮤니티 활동 참여</li>
                <li>공지사항 확인</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/login?role=resident">입주민 로그인</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary transition-colors">
            <CardHeader className="text-center">
              <Dumbbell className="w-12 h-12 mx-auto text-primary mb-2" />
              <CardTitle>트레이너</CardTitle>
              <CardDescription>회원 관리, 운동 루틴 관리, 레슨 관리, 통계 및 분석</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>회원 관리 및 활동 기록</li>
                <li>개인별 맞춤 운동 프로그램 관리</li>
                <li>레슨 일정 등록 및 관리</li>
                <li>회원 건강 정보 분석</li>
                <li>효율적인 관리 도구</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/login?role=trainer">트레이너 로그인</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary transition-colors">
            <CardHeader className="text-center">
              <Building className="w-12 h-12 mx-auto text-primary mb-2" />
              <CardTitle>관리소</CardTitle>
              <CardDescription>운영 수요 조사, 전자 문서 관리, 시설 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>시설 이용 현황 및 통계</li>
                <li>입주자 동의 관리</li>
                <li>위탁 운영 동의 관리</li>
                <li>전자 문서 관리</li>
                <li>실시간 운영 현황 파악</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/login?role=admin">관리소 로그인</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section className="bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-primary">주요 기능</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">시설 예약 시스템</h3>
              <p className="text-muted-foreground">
                헬스장, 수영장, 골프연습장 등 다양한 커뮤니티 시설을 손쉽게 예약하고 관리할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">레슨 예약 시스템</h3>
              <p className="text-muted-foreground">
                요가, 필라테스, 수영 등 다양한 레슨을 예약하고 관리할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">커뮤니티 기능</h3>
              <p className="text-muted-foreground">
                입주민 간 소통, 정보 공유, 중고거래 등 다양한 커뮤니티 활동을 지원합니다.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">건강 관리 기능</h3>
              <p className="text-muted-foreground">
                개인 운동 일지, 건강 목표 설정, 건강 정보 관리 등 건강한 생활을 지원합니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">아파트 커뮤니티 관리 앱</h3>
              <p className="text-sm">입주민, 관리소 직원, 트레이너를 위한 맞춤형 서비스를 제공합니다.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">연락처</h3>
              <p className="text-sm">이메일: info@apartment-community.com</p>
              <p className="text-sm">관리사무소: 041-562-9566</p>
              <p className="text-sm">운영사무소: 041-556-9700</p>
              <p className="text-sm">팩스(APT): 041-562-9568</p>
              <p className="text-sm">팩스(OP): 041-556-9702</p>
              <p className="text-sm">운영시간: 09:00~18:00 (주말/공휴일 휴무)</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">바로가기</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/login" className="hover:underline">
                    로그인
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:underline">
                    회원가입
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:underline">
                    도움말
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm">
            <p>© 2025 프로피티(Profitty). All rights reserved.</p>
            <p className="mt-1 text-xs text-primary-foreground/70">아파트 커뮤니티 관리 솔루션의 새로운 기준</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

