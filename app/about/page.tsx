import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Users, Award, Lightbulb, Code, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
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
              <p className="text-sm">by 프로피티(Profitty)</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/login">로그인</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/">홈으로</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4 text-primary">프로피티(Profitty) 소개</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            프로피티는 아파트 커뮤니티 관리의 새로운 패러다임을 제시합니다. 입주민, 관리소, 트레이너를 위한 맞춤형
            솔루션으로 더 나은 주거 경험을 만들어갑니다.
          </p>
        </section>

        <Tabs defaultValue="company">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="company">회사 소개</TabsTrigger>
            <TabsTrigger value="vision">비전 및 미션</TabsTrigger>
            <TabsTrigger value="technology">기술 소개</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">프로피티(Profitty)는</h3>
                <p className="mb-4 text-muted-foreground">
                  2020년 설립된 프로피티는 아파트 커뮤니티 관리 솔루션 전문 기업입니다. 부동산 관리와 IT 기술의 융합을
                  통해 아파트 커뮤니티의 효율적인 관리와 입주민들의 편리한 생활을 지원합니다.
                </p>
                <p className="mb-4 text-muted-foreground">
                  현재 전국 50개 이상의 아파트 단지에서 프로피티의 솔루션을 도입하여 사용하고 있으며, 지속적인 기술
                  개발과 서비스 향상을 통해 더 많은 아파트 커뮤니티에 가치를 전달하고자 합니다.
                </p>
                <div className="flex gap-4 mt-6">
                  <Button asChild>
                    <Link href="/contact">문의하기</Link>
                  </Button>
                  <Button variant="outline">서비스 소개서 다운로드</Button>
                </div>
              </div>
              <div className="bg-blue-100 rounded-lg p-8 flex items-center justify-center">
                <div className="text-center">
                  <h4 className="text-xl font-bold mb-4">회사 정보</h4>
                  <ul className="space-y-2 text-left">
                    <li className="flex items-center">
                      <Building className="h-5 w-5 mr-2 text-primary" />
                      <span>설립: 2020년 3월</span>
                    </li>
                    <li className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      <span>임직원: 50명</span>
                    </li>
                    <li className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-primary" />
                      <span>2023 스마트시티 혁신상 수상</span>
                    </li>
                    <li className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-primary" />
                      <span>고객센터: 1588-1234</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vision" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>비전</CardTitle>
                <CardDescription>프로피티가 추구하는 미래</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h4 className="text-lg font-bold flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-primary" />더 나은 주거 경험을 위한 혁신
                    </h4>
                    <p className="mt-2 text-muted-foreground">
                      프로피티는 기술을 통해 아파트 커뮤니티의 모든 구성원이 더 편리하고 효율적으로 소통하고 관리할 수
                      있는 환경을 만들어 갑니다. 우리의 목표는 주거 공간을 단순한 '집'이 아닌 '삶의 질을 높이는
                      공간'으로 변화시키는 것입니다.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-bold mb-2">미션</h4>
                      <p className="text-muted-foreground">
                        기술을 통해 아파트 커뮤니티의 모든 이해관계자가 효율적으로 소통하고 협력할 수 있는 플랫폼을
                        제공합니다.
                      </p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-bold mb-2">핵심 가치</h4>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        <li>혁신 (Innovation)</li>
                        <li>신뢰 (Trust)</li>
                        <li>협력 (Collaboration)</li>
                        <li>고객 중심 (Customer-Centric)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technology" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Code className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>최신 기술 스택</CardTitle>
                  <CardDescription>프로피티의 기술 기반</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>Next.js & React</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>TypeScript</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>Tailwind CSS</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>Node.js & Express</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>MongoDB & PostgreSQL</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lightbulb className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>혁신적인 기능</CardTitle>
                  <CardDescription>차별화된 서비스</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>실시간 시설 모니터링</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>AI 기반 예약 최적화</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>맞춤형 운동 추천 시스템</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>데이터 기반 시설 관리</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>통합 커뮤니케이션 플랫폼</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>보안 및 인증</CardTitle>
                  <CardDescription>안전한 서비스 제공</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>ISO 27001 인증</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>GDPR 준수</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>개인정보보호 관리체계</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>엔드투엔드 암호화</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>정기적인 보안 감사</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <section className="mt-12 bg-blue-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">프로피티와 함께하세요</h3>
          <p className="mb-6 text-muted-foreground">
            프로피티의 아파트 커뮤니티 관리 솔루션으로 더 효율적이고 편리한 아파트 생활을 경험해보세요. 지금 바로
            문의하시면 맞춤형 솔루션을 제안해드립니다.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/contact">서비스 문의하기</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">서비스 이용하기</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">프로피티(Profitty)</h3>
              <p className="text-sm">아파트 커뮤니티 관리의 새로운 기준을 제시합니다.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">연락처</h3>
              <p className="text-sm">이메일: info@profitty.com</p>
              <p className="text-sm">고객센터: 1588-1234</p>
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
                  <Link href="/contact" className="hover:underline">
                    문의하기
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

