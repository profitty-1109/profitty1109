import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFromToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const date = url.searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "날짜가 필요합니다." }, { status: 400 })
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
      } catch (parseError) {
        console.error("API Reservations: 세션 쿠키 파싱 오류:", parseError)
      }
    }

    // 토큰으로 인증 시도 (쿠키 인증 실패 시)
    if (!user && authToken) {
      try {
        user = getUserFromToken(authToken)
      } catch (tokenError) {
        console.error("API Reservations: 토큰 파싱 오류:", tokenError)
      }
    }

    // 실제 구현에서는 데이터베이스에서 해당 날짜의 예약 정보를 가져옴
    // 여기서는 목업 데이터 반환
    const reservations = [
      {
        id: "1",
        facilityId: "1",
        facilityName: "헬스장",
        userId: "1",
        userName: "홍길동",
        date: date,
        timeSlot: "06:00-07:00",
        status: "confirmed",
        createdAt: "2025-03-15",
      },
      {
        id: "2",
        facilityId: "1",
        facilityName: "헬스장",
        userId: "2",
        userName: "김철수",
        date: date,
        timeSlot: "09:00-10:00",
        status: "confirmed",
        createdAt: "2025-03-16",
      },
      {
        id: "3",
        facilityId: "2",
        facilityName: "수영장",
        userId: "3",
        userName: "이영희",
        date: date,
        timeSlot: "07:00-08:00",
        status: "confirmed",
        createdAt: "2025-03-14",
      },
      {
        id: "4",
        facilityId: "2",
        facilityName: "수영장",
        userId: "4",
        userName: "박지민",
        date: date,
        timeSlot: "08:00-09:00",
        status: "confirmed",
        createdAt: "2025-03-13",
      },
      {
        id: "5",
        facilityId: "4",
        facilityName: "탁구장",
        userId: "5",
        userName: "최민수",
        date: date,
        timeSlot: "18:00-19:00",
        status: "confirmed",
        createdAt: "2025-03-12",
      },
    ]

    return NextResponse.json(reservations)
  } catch (error) {
    console.error("Error fetching facility reservations by date:", error)
    return NextResponse.json({ error: "예약 정보를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

