import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// 세션 데이터 (실제로는 데이터베이스에 저장)
// 이 데이터는 app/api/trainer-lessons/sessions/route.ts와 공유되어야 합니다
// 실제 구현에서는 데이터베이스를 사용하세요
import { lessonSessions } from "../shared-data"

// 인증 검증 함수
async function validateAuth(request: NextRequest) {
  // 1. 쿠키에서 세션 정보 확인
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get("user-session")

  if (sessionCookie?.value) {
    try {
      const user = JSON.parse(sessionCookie.value)
      console.log("쿠키에서 사용자 정보 가져옴:", { id: user.id, email: user.email, role: user.role })
      if (user && user.id && user.role === "trainer") {
        return { isAuthenticated: true, user }
      }
    } catch (error) {
      console.error("세션 쿠키 파싱 오류:", error)
    }
  }

  // 2. 요청 헤더에서 토큰 확인
  const authHeader = request.headers.get("Authorization")
  const userSessionHeader = request.headers.get("X-User-Session")

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7)
    try {
      // 토큰 검증 로직 (실제 구현에 맞게 수정 필요)
      const decoded = JSON.parse(Buffer.from(token, "base64").toString())
      if (decoded && decoded.id && decoded.role === "trainer") {
        console.log("토큰에서 사용자 정보 가져옴:", { id: decoded.id, role: decoded.role })
        return { isAuthenticated: true, user: decoded }
      }
    } catch (error) {
      console.error("토큰 검증 오류:", error)
    }
  }

  // 3. X-User-Session 헤더 확인
  if (userSessionHeader) {
    try {
      const sessionData = JSON.parse(userSessionHeader)
      if (sessionData && sessionData.id && sessionData.role === "trainer") {
        console.log("X-User-Session 헤더에서 사용자 정보 가져옴:", { id: sessionData.id, role: sessionData.role })
        return { isAuthenticated: true, user: sessionData }
      }
    } catch (error) {
      console.error("세션 헤더 파싱 오류:", error)
    }
  }

  // 개발 환경에서는 테스트 사용자 정보 반환 (실제 환경에서는 제거)
  if (process.env.NODE_ENV === "development") {
    console.log("개발 환경: 테스트 트레이너 정보 사용")
    return {
      isAuthenticated: true,
      user: {
        id: "2",
        name: "박트레이너",
        email: "trainer@example.com",
        role: "trainer",
      },
    }
  }

  return { isAuthenticated: false, user: null }
}

// 특정 세션 조회
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`세션 ID ${params.id} 조회 요청`)

    // 인증 검증
    const { isAuthenticated, user } = await validateAuth(request)

    if (!isAuthenticated || !user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    if (user.role !== "trainer") {
      return NextResponse.json({ error: "트레이너 권한이 필요합니다." }, { status: 403 })
    }

    // 세션 ID로 세션 찾기
    const session = lessonSessions.find((s) => s.id === params.id)

    if (!session) {
      return NextResponse.json({ error: "세션을 찾을 수 없습니다." }, { status: 404 })
    }

    // 해당 트레이너의 세션인지 확인
    if (session.trainerId !== user.id) {
      return NextResponse.json({ error: "해당 세션에 대한 접근 권한이 없습니다." }, { status: 403 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json({ error: "세션 정보를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 세션 수정
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`세션 ID ${params.id} 수정 요청`)

    // 인증 검증
    const { isAuthenticated, user } = await validateAuth(request)

    if (!isAuthenticated || !user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    if (user.role !== "trainer") {
      return NextResponse.json({ error: "트레이너 권한이 필요합니다." }, { status: 403 })
    }

    // 세션 ID로 세션 찾기
    const sessionIndex = lessonSessions.findIndex((s) => s.id === params.id)

    if (sessionIndex === -1) {
      return NextResponse.json({ error: "세션을 찾을 수 없습니다." }, { status: 404 })
    }

    // 해당 트레이너의 세션인지 확인
    if (lessonSessions[sessionIndex].trainerId !== user.id) {
      return NextResponse.json({ error: "해당 세션에 대한 접근 권한이 없습니다." }, { status: 403 })
    }

    // 요청 본문에서 세션 데이터 가져오기
    const sessionData = await request.json()

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

    // 세션 데이터 업데이트
    const updatedSession = {
      ...lessonSessions[sessionIndex],
      ...sessionData,
      id: params.id, // ID는 변경 불가
      trainerId: user.id, // 트레이너 ID는 변경 불가
    }

    // 세션 배열 업데이트
    lessonSessions[sessionIndex] = updatedSession

    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.json({ error: "세션 정보를 수정하는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 세션 삭제
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`세션 ID ${params.id} 삭제 요청`)

    // 인증 검증
    const { isAuthenticated, user } = await validateAuth(request)

    if (!isAuthenticated || !user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    if (user.role !== "trainer") {
      return NextResponse.json({ error: "트레이너 권한이 필요합니다." }, { status: 403 })
    }

    // 세션 ID로 세션 찾기
    const sessionIndex = lessonSessions.findIndex((s) => s.id === params.id)

    if (sessionIndex === -1) {
      return NextResponse.json({ error: "세션을 찾을 수 없습니다." }, { status: 404 })
    }

    // 해당 트레이너의 세션인지 확인
    if (lessonSessions[sessionIndex].trainerId !== user.id) {
      return NextResponse.json({ error: "해당 세션에 대한 접근 권한이 없습니다." }, { status: 403 })
    }

    // 세션 배열에서 제거
    const deletedSession = lessonSessions.splice(sessionIndex, 1)[0]

    return NextResponse.json({ success: true, deletedSession })
  } catch (error) {
    console.error("Error deleting session:", error)
    return NextResponse.json({ error: "세션을 삭제하는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

