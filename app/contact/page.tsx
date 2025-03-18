import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Building, Mail, Phone } from "lucide-react"
import Image from "next/image"

export default function ContactPage() {
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
            <h1 className="text-2xl font-bold">고객센터</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>연락처 정보</CardTitle>
                <CardDescription>천안 불당호반써밋플레이스센터시티 관리사무소 연락처 정보입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lyTW3wLdZpCvqsXZM5Kdabm0YK3OPB.png"
                    alt="천안 불당호반써밋플레이스센터시티 로고"
                    width={200}
                    height={50}
                    className="mb-4"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Building className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-medium">관리사무소 운영시간</h3>
                      <p className="text-sm text-muted-foreground">09:00~18:00 (주말/공휴일 휴무)</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-medium">전화번호</h3>
                      <p className="text-sm text-muted-foreground">관리사무소(APT): 041-562-9566</p>
                      <p className="text-sm text-muted-foreground">운영사무소(OP): 041-556-9700</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-medium">이메일</h3>
                      <p className="text-sm text-muted-foreground">info@profitty.com</p>
                      <p className="text-sm text-muted-foreground">support@profitty.com</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">프로피티(Profitty) 본사</h3>
                  <p className="text-sm text-muted-foreground">서울특별시 강남구 테헤란로 123, 프로피티타워 15층</p>
                  <p className="text-sm text-muted-foreground">고객센터: 1588-1234 (평일 09:00-18:00)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>문의하기</CardTitle>
                <CardDescription>궁금하신 사항이나 건의사항을 작성해주세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="inquiry">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="inquiry">일반 문의</TabsTrigger>
                    <TabsTrigger value="repair">시설 보수 요청</TabsTrigger>
                  </TabsList>
                  <TabsContent value="inquiry" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름</Label>
                      <Input id="name" placeholder="이름을 입력하세요" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      <Input id="email" type="email" placeholder="이메일을 입력하세요" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">연락처</Label>
                      <Input id="phone" placeholder="연락처를 입력하세요" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inquiry-type">문의 유형</Label>
                      <select
                        id="inquiry-type"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">문의 유형을 선택하세요</option>
                        <option value="facility">시설 이용 문의</option>
                        <option value="reservation">예약 관련 문의</option>
                        <option value="app">앱 사용 문의</option>
                        <option value="other">기타 문의</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">문의 내용</Label>
                      <Textarea id="message" placeholder="문의 내용을 입력하세요" rows={5} />
                    </div>
                    <Button className="w-full">문의하기</Button>
                  </TabsContent>
                  <TabsContent value="repair" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="repair-name">이름</Label>
                      <Input id="repair-name" placeholder="이름을 입력하세요" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="repair-phone">연락처</Label>
                      <Input id="repair-phone" placeholder="연락처를 입력하세요" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="repair-address">동/호수</Label>
                      <Input id="repair-address" placeholder="동/호수를 입력하세요" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="repair-type">보수 유형</Label>
                      <select
                        id="repair-type"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">보수 유형을 선택하세요</option>
                        <option value="plumbing">수도/배관</option>
                        <option value="electrical">전기</option>
                        <option value="facility">시설물</option>
                        <option value="other">기타</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="repair-details">상세 내용</Label>
                      <Textarea id="repair-details" placeholder="보수가 필요한 내용을 상세히 입력하세요" rows={5} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="repair-time">방문 가능 시간</Label>
                      <Input id="repair-time" placeholder="방문 가능한 시간대를 입력하세요" />
                    </div>
                    <Button className="w-full">보수 요청하기</Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>자주 묻는 질문</CardTitle>
              <CardDescription>자주 묻는 질문과 답변을 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Q: 시설 예약은 어떻게 하나요?</h3>
                <p className="text-sm text-muted-foreground">
                  A: 앱 메인 메뉴에서 '시설 예약'을 선택하신 후, 원하시는 시설과 날짜, 시간을 선택하여 예약하실 수
                  있습니다. 예약 가능 시간은 시설별로 상이할 수 있습니다.
                </p>
              </div>
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Q: 레슨 예약을 취소하고 싶어요.</h3>
                <p className="text-sm text-muted-foreground">
                  A: '내 예약' 메뉴에서 예약된 레슨을 확인하신 후, 취소 버튼을 클릭하시면 됩니다. 단, 레슨 시작 24시간
                  이내에는 취소가 제한될 수 있습니다.
                </p>
              </div>
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Q: 앱 로그인이 안돼요.</h3>
                <p className="text-sm text-muted-foreground">
                  A: 아이디와 비밀번호를 정확히 입력하셨는지 확인해주세요. 비밀번호를 잊으셨다면 '비밀번호 찾기' 기능을
                  이용하시거나, 관리사무소(041-562-9566)로 문의해주세요.
                </p>
              </div>
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Q: 커뮤니티 시설 이용 시간은 어떻게 되나요?</h3>
                <p className="text-sm text-muted-foreground">
                  A: 시설별 이용 시간은 다음과 같습니다:
                  <br />
                  헬스장: 06:00-22:00
                  <br />
                  수영장: 06:00-21:00
                  <br />
                  골프연습장: 08:00-22:00
                  <br />
                  탁구장: 09:00-21:00
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

