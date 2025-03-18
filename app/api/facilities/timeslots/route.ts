import { type NextRequest, NextResponse } from "next/server"
import { getAvailableTimeSlots } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const facilityId = url.searchParams.get("facilityId")
    const date = url.searchParams.get("date")

    if (!facilityId || !date) {
      return NextResponse.json({ error: "시설 ID와 날짜가 필요합니다." }, { status: 400 })
    }

    const timeSlots = await getAvailableTimeSlots(facilityId, date)
    return NextResponse.json(timeSlots)
  } catch (error) {
    console.error("Error fetching available time slots:", error)
    return NextResponse.json({ error: "이용 가능 시간을 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

