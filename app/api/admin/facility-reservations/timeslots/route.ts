import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

// 목업 데이터 - 실제 구현에서는 데이터베이스에서 가져옴
const mockTimeSlots = {
  "1": [
    // 헬스장
    { id: "TS001", time: "06:00-07:00", capacity: 10, booked: 6, available: 4 },
    { id: "TS002", time: "07:00-08:00", capacity: 10, booked: 8, available: 2 },
    { id: "TS003", time: "08:00-09:00", capacity: 10, booked: 7, available: 3 },
    { id: "TS004", time: "09:00-10:00", capacity: 10, booked: 5, available: 5 },
    { id: "TS005", time: "10:00-11:00", capacity: 10, booked: 4, available: 6 },
    { id: "TS006", time: "11:00-12:00", capacity: 10, booked: 3, available: 7 },
    { id: "TS007", time: "12:00-13:00", capacity: 10, booked: 6, available: 4 },
    { id: "TS008", time: "13:00-14:00", capacity: 10, booked: 5, available: 5 },
    { id: "TS009", time: "14:00-15:00", capacity: 10, booked: 7, available: 3 },
    { id: "TS010", time: "15:00-16:00", capacity: 10, booked: 8, available: 2 },
    { id: "TS011", time: "16:00-17:00", capacity: 10, booked: 9, available: 1 },
    { id: "TS012", time: "17:00-18:00", capacity: 10, booked: 10, available: 0 },
    { id: "TS013", time: "18:00-19:00", capacity: 10, booked: 10, available: 0 },
    { id: "TS014", time: "19:00-20:00", capacity: 10, booked: 9, available: 1 },
    { id: "TS015", time: "20:00-21:00", capacity: 10, booked: 7, available: 3 },
    { id: "TS016", time: "21:00-22:00", capacity: 10, booked: 5, available: 5 },
  ],
  "2": [
    // 수영장
    { id: "TS101", time: "06:00-07:00", capacity: 8, booked: 8, available: 0 },
    { id: "TS102", time: "07:00-08:00", capacity: 8, booked: 7, available: 1 },
    { id: "TS103", time: "08:00-09:00", capacity: 8, booked: 6, available: 2 },
    { id: "TS104", time: "09:00-10:00", capacity: 8, booked: 5, available: 3 },
    { id: "TS105", time: "10:00-11:00", capacity: 8, booked: 4, available: 4 },
    { id: "TS106", time: "11:00-12:00", capacity: 8, booked: 3, available: 5 },
    { id: "TS107", time: "12:00-13:00", capacity: 8, booked: 4, available: 4 },
    { id: "TS108", time: "13:00-14:00", capacity: 8, booked: 5, available: 3 },
    { id: "TS109", time: "14:00-15:00", capacity: 8, booked: 6, available: 2 },
    { id: "TS110", time: "15:00-16:00", capacity: 8, booked: 5, available: 3 },
    { id: "TS111", time: "16:00-17:00", capacity: 8, booked: 6, available: 2 },
    { id: "TS112", time: "17:00-18:00", capacity: 8, booked: 7, available: 1 },
    { id: "TS113", time: "18:00-19:00", capacity: 8, booked: 7, available: 1 },
    { id: "TS114", time: "19:00-20:00", capacity: 8, booked: 6, available: 2 },
    { id: "TS115", time: "20:00-21:00", capacity: 8, booked: 4, available: 4 },
  ],
  "3": [
    // 골프연습장
    { id: "TS201", time: "08:00-09:00", capacity: 5, booked: 2, available: 3 },
    { id: "TS202", time: "09:00-10:00", capacity: 5, booked: 3, available: 2 },
    { id: "TS203", time: "10:00-11:00", capacity: 5, booked: 4, available: 1 },
    { id: "TS204", time: "11:00-12:00", capacity: 5, booked: 3, available: 2 },
    { id: "TS205", time: "12:00-13:00", capacity: 5, booked: 2, available: 3 },
    { id: "TS206", time: "13:00-14:00", capacity: 5, booked: 3, available: 2 },
    { id: "TS207", time: "14:00-15:00", capacity: 5, booked: 4, available: 1 },
    { id: "TS208", time: "15:00-16:00", capacity: 5, booked: 3, available: 2 },
    { id: "TS209", time: "16:00-17:00", capacity: 5, booked: 4, available: 1 },
    { id: "TS210", time: "17:00-18:00", capacity: 5, booked: 5, available: 0 },
    { id: "TS211", time: "18:00-19:00", capacity: 5, booked: 5, available: 0 },
    { id: "TS212", time: "19:00-20:00", capacity: 5, booked: 5, available: 0 },
    { id: "TS213", time: "20:00-21:00", capacity: 5, booked: 4, available: 1 },
    { id: "TS214", time: "21:00-22:00", capacity: 5, booked: 3, available: 2 },
  ],
  "4": [
    // 탁구장
    { id: "TS301", time: "09:00-10:00", capacity: 4, booked: 2, available: 2 },
    { id: "TS302", time: "10:00-11:00", capacity: 4, booked: 3, available: 1 },
    { id: "TS303", time: "11:00-12:00", capacity: 4, booked: 3, available: 1 },
    { id: "TS304", time: "12:00-13:00", capacity: 4, booked: 4, available: 0 },
    { id: "TS305", time: "13:00-14:00", capacity: 4, booked: 4, available: 0 },
    { id: "TS306", time: "14:00-15:00", capacity: 4, booked: 3, available: 1 },
    { id: "TS307", time: "15:00-16:00", capacity: 4, booked: 2, available: 2 },
    { id: "TS308", time: "16:00-17:00", capacity: 4, booked: 3, available: 1 },
    { id: "TS309", time: "17:00-18:00", capacity: 4, booked: 3, available: 1 },
    { id: "TS310", time: "18:00-19:00", capacity: 4, booked: 4, available: 0 },
    { id: "TS311", time: "19:00-20:00", capacity: 4, booked: 3, available: 1 },
    { id: "TS312", time: "20:00-21:00", capacity: 4, booked: 2, available: 2 },
  ],
}

export async function GET(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const url = new URL(request.url)
    const facilityId = url.searchParams.get("facilityId")
    const date = url.searchParams.get("date")

    if (!facilityId) {
      return NextResponse.json({ error: "시설 ID가 필요합니다." }, { status: 400 })
    }

    const timeSlots = mockTimeSlots[facilityId]

    if (!timeSlots) {
      return NextResponse.json({ error: "해당 시설의 시간대를 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json(timeSlots)
  } catch (error) {
    console.error("Error fetching facility time slots:", error)
    return NextResponse.json({ error: "시설 시간대를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

