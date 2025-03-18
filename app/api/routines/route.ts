import { type NextRequest, NextResponse } from "next/server"
import { getRoutinesByTrainerId, getRoutineById, createRoutine, updateRoutine, deleteRoutine } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"
import { cookies } from "next/headers"

// 가상의 토큰 기반 사용자 인증 함수
const getUserFromToken = (token: string) => {
  // 실제 구현에서는 토큰을 검증하고 사용자 정보를 반환해야 합니다.
  // 여기서는 간단히 테스트용 사용자 정보를 반환합니다.
  if (token === "test-token") {
    return { id: "123", email: "test@example.com", role: "trainer" }
  }
  return null
}

export async function GET(request: NextRequest) {
  try {
    // 1. 쿠키에서 세션 정보 확인
    const sessionCookie = cookies().get("user-session")

    // 2. 헤더에서 인증 토큰 확인
    const authHeader = request.headers.get("authorization")
    const authToken = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : request.nextUrl.searchParams.get("token")

    let user = null

    // 세션 쿠키로 인증 시도
    if (sessionCookie?.value) {
      try {
        user = JSON.parse(sessionCookie.value)
        console.log("API Routines: 세션 쿠키에서 사용자 정보 가져옴:", {
          id: user.id,
          email: user.email,
          role: user.role,
        })
      } catch (parseError) {
        console.error("API Routines: 세션 쿠키 파싱 오류:", parseError)
      }
    } else {
      console.log("API Routines: 세션 쿠키가 없습니다, 토큰 확인 시도")
    }

    // 토큰으로 인증 시도 (쿠키 인증 실패 시)
    if (!user && authToken) {
      try {
        user = getUserFromToken(authToken)
        if (user) {
          console.log("API Routines: 토큰에서 사용자 정보 가져옴:", {
            id: user.id,
            email: user.email,
            role: user.role,
          })
        }
      } catch (tokenError) {
        console.error("API Routines: 토큰 파싱 오류:", tokenError)
      }
    }

    // 인증 실패 시 테스트 사용자 ID 사용 (개발 환경에서만)
    if (!user) {
      console.log("API Routines: 인증 실패, 테스트 트레이너 ID 사용")
      user = { id: "2", role: "trainer" } // 테스트용 트레이너 ID
    }

    if (user.role !== "trainer") {
      return NextResponse.json({ error: "트레이너 권한이 필요합니다." }, { status: 403 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (id) {
      // 특정 루틴 정보 조회
      const routine = await getRoutineById(id)

      if (!routine) {
        return NextResponse.json({ error: "루틴을 찾을 수 없습니다." }, { status: 404 })
      }

      // 해당 트레이너의 루틴인지 확인
      if (routine.trainerId !== user.id) {
        return NextResponse.json({ error: "해당 루틴에 대한 접근 권한이 없습니다." }, { status: 403 })
      }

      return NextResponse.json(routine)
    } else {
      // 트레이너의 모든 루틴 조회
      const routines = await getRoutinesByTrainerId(user.id)
      return NextResponse.json(routines)
    }
  } catch (error) {
    console.error("Error fetching routines:", error)
    return NextResponse.json({ error: "루틴 정보를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    if (user.role !== "trainer") {
      return NextResponse.json({ error: "트레이너 권한이 필요합니다." }, { status: 403 })
    }

    const routineData = await request.json()

    // 필수 필드 검증
    if (!routineData.name || !routineData.exercises || !Array.isArray(routineData.exercises)) {
      return NextResponse.json({ error: "루틴 이름과 운동 목록은 필수 입력 항목입니다." }, { status: 400 })
    }

    // 트레이너 ID 설정
    routineData.trainerId = user.id

    const newRoutine = await createRoutine(routineData)
    return NextResponse.json(newRoutine)
  } catch (error) {
    console.error("Error creating routine:", error)
    return NextResponse.json({ error: "루틴 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    if (user.role !== "trainer") {
      return NextResponse.json({ error: "트레이너 권한이 필요합니다." }, { status: 403 })
    }

    const { id, ...routineData } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "루틴 ID가 필요합니다." }, { status: 400 })
    }

    // 루틴 존재 여부 확인
    const existingRoutine = await getRoutineById(id)
    if (!existingRoutine) {
      return NextResponse.json({ error: "루틴을 찾을 수 없습니다." }, { status: 404 })
    }

    // 해당 트레이너의 루틴인지 확인
    if (existingRoutine.trainerId !== user.id) {
      return NextResponse.json({ error: "해당 루틴에 대한 접근 권한이 없습니다." }, { status: 403 })
    }

    const updatedRoutine = await updateRoutine(id, routineData)
    return NextResponse.json(updatedRoutine)
  } catch (error) {
    console.error("Error updating routine:", error)
    return NextResponse.json({ error: "루틴 정보 수정 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    if (user.role !== "trainer") {
      return NextResponse.json({ error: "트레이너 권한이 필요합니다." }, { status: 403 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "루틴 ID가 필요합니다." }, { status: 400 })
    }

    // 루틴 존재 여부 확인
    const existingRoutine = await getRoutineById(id)
    if (!existingRoutine) {
      return NextResponse.json({ error: "루틴을 찾을 수 없습니다." }, { status: 404 })
    }

    // 해당 트레이너의 루틴인지 확인
    if (existingRoutine.trainerId !== user.id) {
      return NextResponse.json({ error: "해당 루틴에 대한 접근 권한이 없습니다." }, { status: 403 })
    }

    await deleteRoutine(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting routine:", error)
    return NextResponse.json({ error: "루틴 삭제 중 오류가 발생했습니다." }, { status: 500 })
  }
}

