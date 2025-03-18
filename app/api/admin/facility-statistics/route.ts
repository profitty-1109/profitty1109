import { NextResponse } from "next/server"
import { getFacilityStatistics } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const url = new URL(request.url)
    const facilityId = url.searchParams.get("facilityId")
    const period = url.searchParams.get("period") || "weekly"
    const startDate = url.searchParams.get("startDate")
    const endDate = url.searchParams.get("endDate")

    const statistics = await getFacilityStatistics(facilityId, period, startDate, endDate)
    return NextResponse.json(statistics)
  } catch (error) {
    console.error("Error fetching facility statistics:", error)
    return NextResponse.json({ error: "시설 통계 정보를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

