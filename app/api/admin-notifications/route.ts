import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // 인증 토큰 또는 쿠키에서 사용자 ID 가져오기
    const token = request.nextUrl.searchParams.get("token")
    const authHeader = request.headers.get("Authorization")?.split(" ")[1]

    // 실제 구현에서는 토큰이나 쿠키에서 사용자 ID를 추출
    const userId = "3" // 예시 관리자 ID

    // 관리자 알림 설정 데이터 가져오기 (실제 구현에서는 데이터베이스에서 가져옴)
    const notificationSettings = {
      email: true,
      push: true,
      sms: false,
      facilityIssues: true,
      reservationUpdates: true,
      residentRequests: true,
      systemUpdates: true,
    }

    return NextResponse.json(notificationSettings, { status: 200 })
  } catch (error) {
    console.error("Error fetching admin notification settings:", error)
    return NextResponse.json({ error: "알림 설정을 가져오는데 실패했습니다." }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // 인증 토큰 또는 쿠키에서 사용자 ID 가져오기
    const token = request.nextUrl.searchParams.get("token")
    const authHeader = request.headers.get("Authorization")?.split(" ")[1]

    // 실제 구현에서는 토큰이나 쿠키에서 사용자 ID를 추출하고 데이터베이스에 저장
    const userId = "3" // 예시 관리자 ID

    // 알림 설정 업데이트 로직 (실제 구현에서는 데이터베이스에 저장)
    console.log(`Updating admin notification settings for user ${userId}:`, data)

    return NextResponse.json({ success: true, message: "알림 설정이 성공적으로 업데이트되었습니다." }, { status: 200 })
  } catch (error) {
    console.error("Error updating admin notification settings:", error)
    return NextResponse.json({ error: "알림 설정을 업데이트하는데 실패했습니다." }, { status: 500 })
  }
}

