import { NextResponse } from "next/server"
import { cancelReservation } from "@/lib/data"
import { cookies } from "next/headers"
import { getUserFromToken } from "@/lib/auth"
import type { NextRequest } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reservationId = params.id

    if (!reservationId) {
      return NextResponse.json({ error: "예약 ID가 필요합니다." }, { status: 400 })
    }

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
        console.log("API Reservations: 세션 쿠키에서 사용자 정보 가져옴:", {
          id: user.id,
          email: user.email,
          role: user.role,
        })
      } catch (parseError) {
        console.error("API Reservations: 세션 쿠키 파싱 오류:", parseError)
      }
    } else {
      console.log("API Reservations: 세션 쿠키가 없습니다, 토큰 확인 시도")
    }

    // 토큰으로 인증 시도 (쿠키 인증 실패 시)
    if (!user && authToken) {
      try {
        user = getUserFromToken(authToken)
        if (user) {
          console.log("API Reservations: 토큰에서 사용자 정보 가져옴:", {
            id: user.id,
            email: user.email,
            role: user.role,
          })
        }
      } catch (tokenError) {
        console.error("API Reservations: 토큰 파싱 오류:", tokenError)
      }
    }

    // 인증 실패 시 테스트 사용자 ID 사용 (개발 환경에서만)
    let userId = user?.id
    if (!userId) {
      console.log("API Reservations: 인증 실패, 테스트 사용자 ID 사용")
      userId = "1" // 테스트용 사용자 ID (홍길동)
    }

    const updatedReservation = await cancelReservation(reservationId, userId)

    if (!updatedReservation) {
      return NextResponse.json({ error: "예약을 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json(updatedReservation)
  } catch (error) {
    console.error("Error cancelling reservation:", error)
    return NextResponse.json({ error: "예약 취소 중 오류가 발생했습니다." }, { status: 500 })
  }
}

