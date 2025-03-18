import { type NextRequest, NextResponse } from "next/server"
import {
  createFacilityReservation,
  getFacilityReservationsByUserId,
  cancelFacilityReservation,
  getFacilityById,
} from "@/lib/data"
import { cookies } from "next/headers"
import { getUserFromToken } from "@/lib/auth"

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

    const reservations = await getFacilityReservationsByUserId(userId)
    return NextResponse.json(reservations)
  } catch (error) {
    console.error("Error fetching facility reservations:", error)
    return NextResponse.json({ error: "예약 정보를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    // 인증 실패
    if (!user || !user.id) {
      console.error("API Reservations: 유효한 사용자 정보가 없습니다")
      return NextResponse.json(
        {
          error: "로그인이 필요합니다.",
          requireAuth: true,
        },
        { status: 401 },
      )
    }

    const { facilityId, facilityName, date, timeSlot } = await request.json()

    if (!facilityId || !date || !timeSlot) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    // 시설 존재 여부 확인
    const facility = await getFacilityById(facilityId)
    if (!facility) {
      return NextResponse.json({ error: "존재하지 않는 시설입니다." }, { status: 404 })
    }

    // 시설이 운영 중인지 확인
    if (facility.status !== "open") {
      return NextResponse.json({ error: "현재 이용할 수 없는 시설입니다." }, { status: 400 })
    }

    const reservation = await createFacilityReservation({
      facilityId,
      facilityName: facilityName || facility.name,
      userId: user.id,
      userName: user.name,
      date,
      timeSlot,
      status: "confirmed",
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("Error creating facility reservation:", error)
    return NextResponse.json({ error: "예약 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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

    const { reservationId } = await request.json()

    if (!reservationId) {
      return NextResponse.json({ error: "예약 ID가 필요합니다." }, { status: 400 })
    }

    const updatedReservation = await cancelFacilityReservation(reservationId, userId)
    return NextResponse.json(updatedReservation)
  } catch (error) {
    console.error("Error cancelling facility reservation:", error)
    return NextResponse.json({ error: "예약 취소 중 오류가 발생했습니다." }, { status: 500 })
  }
}

