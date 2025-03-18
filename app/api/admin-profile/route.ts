import { type NextRequest, NextResponse } from "next/server"
import { getAdminProfile } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    // 인증 토큰 또는 쿠키에서 사용자 ID 가져오기
    const token = request.nextUrl.searchParams.get("token")
    const authHeader = request.headers.get("Authorization")?.split(" ")[1]

    // 실제 구현에서는 토큰이나 쿠키에서 사용자 ID를 추출
    const userId = "3" // 예시 관리자 ID

    // 관리자 프로필 데이터 가져오기
    const profile = getAdminProfile(userId)

    return NextResponse.json(profile, { status: 200 })
  } catch (error) {
    console.error("Error fetching admin profile:", error)
    return NextResponse.json({ error: "프로필 정보를 가져오는데 실패했습니다." }, { status: 500 })
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

    // 프로필 업데이트 로직 (실제 구현에서는 데이터베이스에 저장)
    console.log(`Updating admin profile for user ${userId}:`, data)

    return NextResponse.json({ success: true, message: "프로필이 성공적으로 업데이트되었습니다." }, { status: 200 })
  } catch (error) {
    console.error("Error updating admin profile:", error)
    return NextResponse.json({ error: "프로필 정보를 업데이트하는데 실패했습니다." }, { status: 500 })
  }
}

