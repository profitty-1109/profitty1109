import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

// 목업 데이터 - 실제 구현에서는 데이터베이스에서 가져옴
const mockReservationStats = {
  "1": {
    // 헬스장
    totalToday: 12,
    averageUsageTime: "1시간 20분",
    peakHours: "18:00-20:00",
    cancellationRate: "5%",
    timeDistribution: {
      morning: 60, // 06:00-12:00
      afternoon: 80, // 12:00-18:00
      evening: 90, // 18:00-22:00
    },
    weeklyTrend: [8, 10, 12, 15, 18, 20, 14], // 월-일
    popularTimeSlots: [
      { slot: "18:00-19:00", usage: 95 },
      { slot: "19:00-20:00", usage: 90 },
      { slot: "17:00-18:00", usage: 85 },
    ],
  },
  "2": {
    // 수영장
    totalToday: 15,
    averageUsageTime: "1시간 10분",
    peakHours: "06:00-08:00",
    cancellationRate: "3%",
    timeDistribution: {
      morning: 85,
      afternoon: 60,
      evening: 70,
    },
    weeklyTrend: [12, 14, 13, 15, 16, 18, 10],
    popularTimeSlots: [
      { slot: "06:00-07:00", usage: 90 },
      { slot: "07:00-08:00", usage: 85 },
      { slot: "19:00-20:00", usage: 75 },
    ],
  },
  "3": {
    // 골프연습장
    totalToday: 8,
    averageUsageTime: "1시간 30분",
    peakHours: "19:00-21:00",
    cancellationRate: "8%",
    timeDistribution: {
      morning: 40,
      afternoon: 60,
      evening: 85,
    },
    weeklyTrend: [6, 8, 7, 9, 10, 12, 8],
    popularTimeSlots: [
      { slot: "19:00-20:00", usage: 90 },
      { slot: "20:00-21:00", usage: 85 },
      { slot: "18:00-19:00", usage: 80 },
    ],
  },
  "4": {
    // 탁구장
    totalToday: 10,
    averageUsageTime: "1시간",
    peakHours: "12:00-14:00",
    cancellationRate: "4%",
    timeDistribution: {
      morning: 50,
      afternoon: 85,
      evening: 65,
    },
    weeklyTrend: [8, 9, 10, 11, 12, 14, 9],
    popularTimeSlots: [
      { slot: "12:00-13:00", usage: 90 },
      { slot: "13:00-14:00", usage: 85 },
      { slot: "18:00-19:00", usage: 70 },
    ],
  },
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

    const stats = mockReservationStats[facilityId]

    if (!stats) {
      return NextResponse.json({ error: "해당 시설의 통계를 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching facility reservation stats:", error)
    return NextResponse.json({ error: "시설 예약 통계를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

