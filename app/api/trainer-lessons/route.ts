import { type NextRequest, NextResponse } from "next/server"
import {
  getTrainerLessonsByTrainerId,
  getTrainerLessonById,
  createTrainerLesson,
  updateTrainerLesson,
  deleteTrainerLesson,
} from "@/lib/data"
import { cookies } from "next/headers"

// 인증 검증 함수 개선
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

  // 4. URL 쿼리 파라미터에서 토큰 확인
  const url = new URL(request.url)
  const tokenParam = url.searchParams.get("token")

  if (tokenParam) {
    try {
      const decoded = JSON.parse(Buffer.from(tokenParam, "base64").toString())
      if (decoded && decoded.id && decoded.role === "trainer") {
        console.log("URL 파라미터에서 사용자 정보 가져옴:", { id: decoded.id, role: decoded.role })
        return { isAuthenticated: true, user: decoded }
      }
    } catch (error) {
      console.error("토큰 파라미터 검증 오류:", error)
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

// GET 함수 개선 - 오류 처리 및 로깅 추가
export async function GET(request: NextRequest) {
  try {
    console.log("트레이너 레슨 API 호출됨:", request.url)

    // 인증 검증
    const { isAuthenticated, user } = await validateAuth(request)
    console.log("인증 결과:", { isAuthenticated, userId: user?.id, userRole: user?.role })

    if (!isAuthenticated || !user) {
      console.log("인증 실패")
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    if (user.role !== "trainer") {
      console.log("권한 부족:", user.role)
      return NextResponse.json({ error: "트레이너 권한이 필요합니다." }, { status: 403 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (id) {
      // 특정 레슨 정보 조회
      console.log("특정 레슨 조회:", id)
      const lesson = await getTrainerLessonById(id)

      if (!lesson) {
        return NextResponse.json({ error: "레슨을 찾을 수 없습니다." }, { status: 404 })
      }

      // 해당 트레이너의 레슨인지 확인
      if (lesson.trainerId !== user.id) {
        return NextResponse.json({ error: "해당 레슨에 대한 접근 권한이 없습니다." }, { status: 403 })
      }

      return NextResponse.json(lesson)
    } else {
      // 트레이너의 모든 레슨 조회
      console.log("트레이너의 모든 레슨 조회:", user.id)
      const lessons = await getTrainerLessonsByTrainerId(user.id)
      console.log("조회된 레슨 수:", lessons.length)
      return NextResponse.json(lessons)
    }
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ error: "레슨 정보를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 인증 검증
    const { isAuthenticated, user } = await validateAuth(request)

    if (!isAuthenticated || !user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    if (user.role !== "trainer") {
      return NextResponse.json({ error: "트레이너 권한이 필요합니다." }, { status: 403 })
    }

    const lessonData = await request.json()

    // 필수 필드 검증
    if (!lessonData.title || !lessonData.type || !lessonData.duration) {
      return NextResponse.json({ error: "레슨 제목, 유형, 시간은 필수 입력 항목입니다." }, { status: 400 })
    }

    // 트레이너 ID 설정
    lessonData.trainerId = user.id

    const newLesson = await createTrainerLesson(lessonData)
    return NextResponse.json(newLesson)
  } catch (error) {
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "레슨 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 인증 검증
    const { isAuthenticated, user } = await validateAuth(request)

    if (!isAuthenticated || !user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    if (user.role !== "trainer") {
      return NextResponse.json({ error: "트레이너 권한이 필요합니다." }, { status: 403 })
    }

    const { id, ...lessonData } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "레슨 ID가 필요합니다." }, { status: 400 })
    }

    // 레슨 존재 여부 확인
    const existingLesson = await getTrainerLessonById(id)
    if (!existingLesson) {
      return NextResponse.json({ error: "레슨을 찾을 수 없습니다." }, { status: 404 })
    }

    // 해당 트레이너의 레슨인지 확인
    if (existingLesson.trainerId !== user.id) {
      return NextResponse.json({ error: "해당 레슨에 대한 접근 권한이 없습니다." }, { status: 403 })
    }

    const updatedLesson = await updateTrainerLesson(id, lessonData)
    return NextResponse.json(updatedLesson)
  } catch (error) {
    console.error("Error updating lesson:", error)
    return NextResponse.json({ error: "레슨 정보 수정 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 인증 검증
    const { isAuthenticated, user } = await validateAuth(request)

    if (!isAuthenticated || !user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    if (user.role !== "trainer") {
      return NextResponse.json({ error: "트레이너 권한이 필요합니다." }, { status: 403 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "레슨 ID가 필요합니다." }, { status: 400 })
    }

    // 레슨 존재 여부 확인
    const existingLesson = await getTrainerLessonById(id)
    if (!existingLesson) {
      return NextResponse.json({ error: "레슨을 찾을 수 없습니다." }, { status: 404 })
    }

    // 해당 트레이너의 레슨인지 확인
    if (existingLesson.trainerId !== user.id) {
      return NextResponse.json({ error: "해당 레슨에 대한 접근 권한이 없습니다." }, { status: 403 })
    }

    await deleteTrainerLesson(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting lesson:", error)
    return NextResponse.json({ error: "레슨 삭제 중 오류가 발생했습니다." }, { status: 500 })
  }
}

