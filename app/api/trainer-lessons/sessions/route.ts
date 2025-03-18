import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { lessonSessions } from "./shared-data"

// 가상의 토큰 기반 사용자 인증 함수
const getUserFromToken = (token: string) => {
  // 실제 구현에서는 토큰을 검증하고 사용자 정보를 반환해야 합니다.
  // 여기서는 간단히 테스트용 사용자 정보를 반환합니다.
  if (token === "test-token") {
    return { id: "123", email: "test@example.com", role: "trainer" }
  }
  return null
}

// GET 요청 처리 - 날짜 파라미터 지원 추가
export async function GET(request: Request) {
  try {
    // URL에서 날짜 파라미터 가져오기
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")

    // 세션 데이터 가져오기
    let sessions = [...lessonSessions]

    // 날짜 파라미터가 있으면 해당 날짜의 세션만 필터링
    if (dateParam) {
      sessions = sessions.filter((session) => session.date === dateParam)
    }

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error fetching lesson sessions:", error)
    return NextResponse.json({ error: "세션 정보를 가져오는데 실패했습니다." }, { status: 500 })
  }
}

// POST 함수 개선 - 오류 처리 및 로깅 추가
export async function POST(request: NextRequest) {
  try {
    console.log("트레이너 레슨 세션 생성 API 호출됨")

    // 1. 쿠키에서 세션 정보 확인
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("user-session")

    // 2. 헤더에서 인증 토큰 확인
    const authHeader = request.headers.get("authorization")
    const userSessionHeader = request.headers.get("X-User-Session")
    const authToken = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : request.nextUrl.searchParams.get("token")

    let user = null

    // 세션 쿠키로 인증 시도
    if (sessionCookie?.value) {
      try {
        user = JSON.parse(sessionCookie.value)
        console.log("API Sessions POST: 세션 쿠키에서 사용자 정보 가져옴")
      } catch (parseError) {
        console.error("API Sessions POST: 세션 쿠키 파싱 오류:", parseError)
      }
    }

    // 토큰으로 인증 시도 (쿠키 인증 실패 시)
    if (!user && authToken) {
      try {
        user = JSON.parse(Buffer.from(authToken, "base64").toString())
        console.log("API Sessions POST: 토큰에서 사용자 정보 가져옴")
      } catch (tokenError) {
        console.error("API Sessions POST: 토큰 파싱 오류:", tokenError)
      }
    }

    // X-User-Session 헤더 확인
    if (!user && userSessionHeader) {
      try {
        user = JSON.parse(userSessionHeader)
        console.log("API Sessions POST: X-User-Session 헤더에서 사용자 정보 가져옴")
      } catch (headerError) {
        console.error("API Sessions POST: X-User-Session 헤더 파싱 오류:", headerError)
      }
    }

    // 인증 실패 시 테스트 사용자 ID 사용 (개발 환경에서만)
    if (!user && process.env.NODE_ENV === "development") {
      console.log("API Sessions POST: 인증 실패, 테스트 트레이너 ID 사용")
      user = { id: "2", role: "trainer", name: "박트레이너", email: "trainer@example.com" } // 테스트용 트레이너 ID
    }

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    if (user.role !== "trainer") {
      return NextResponse.json({ error: "트레이너 권한이 필요합니다." }, { status: 403 })
    }

    const sessionData = await request.json()
    console.log("세션 생성 요청 데이터:", sessionData)

    // 필수 필드 검증
    if (
      !sessionData.lessonId ||
      !sessionData.date ||
      !sessionData.time ||
      !sessionData.memberIds ||
      sessionData.memberIds.length === 0
    ) {
      return NextResponse.json({ error: "레슨 ID, 날짜, 시간, 회원 정보는 필수 입력 항목입니다." }, { status: 400 })
    }

    // 새 세션 생성
    const newSession = {
      id: Math.random().toString(36).substring(2, 15),
      ...sessionData,
      trainerId: user.id,
      status: sessionData.status || "scheduled",
    }

    lessonSessions.push(newSession)
    console.log("새 세션 생성 완료:", newSession.id)
    return NextResponse.json(newSession)
  } catch (error) {
    console.error("Error creating lesson session:", error)
    return NextResponse.json({ error: "레슨 세션 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

