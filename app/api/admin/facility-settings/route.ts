import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

// 목업 데이터 - 실제 구현에서는 데이터베이스에서 가져옴
const facilitySettings = [
  {
    facilityId: "1",
    status: "open",
    capacity: 30,
    operatingHours: {
      start: "06:00",
      end: "22:00",
    },
    reservationInterval: 60, // 분 단위
    maxReservationsPerDay: 2,
    requireApproval: false,
  },
  {
    facilityId: "2",
    status: "open",
    capacity: 20,
    operatingHours: {
      start: "06:00",
      end: "21:00",
    },
    reservationInterval: 60,
    maxReservationsPerDay: 1,
    requireApproval: false,
  },
  {
    facilityId: "3",
    status: "maintenance",
    capacity: 10,
    operatingHours: {
      start: "08:00",
      end: "22:00",
    },
    reservationInterval: 60,
    maxReservationsPerDay: 2,
    requireApproval: false,
  },
  {
    facilityId: "4",
    status: "open",
    capacity: 8,
    operatingHours: {
      start: "09:00",
      end: "21:00",
    },
    reservationInterval: 60,
    maxReservationsPerDay: 2,
    requireApproval: false,
  },
]

export async function GET(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const url = new URL(request.url)
    const facilityId = url.searchParams.get("facilityId")

    if (facilityId) {
      const settings = facilitySettings.find((setting) => setting.facilityId === facilityId)

      if (!settings) {
        return NextResponse.json({ error: "해당 시설의 설정을 찾을 수 없습니다." }, { status: 404 })
      }

      return NextResponse.json(settings)
    }

    return NextResponse.json(facilitySettings)
  } catch (error) {
    console.error("Error fetching facility settings:", error)
    return NextResponse.json({ error: "시설 설정을 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const data = await request.json()
    const { facilityId } = data

    if (!facilityId) {
      return NextResponse.json({ error: "시설 ID가 필요합니다." }, { status: 400 })
    }

    // 실제 구현에서는 데이터베이스 업데이트
    const settingIndex = facilitySettings.findIndex((setting) => setting.facilityId === facilityId)

    if (settingIndex === -1) {
      return NextResponse.json({ error: "해당 시설의 설정을 찾을 수 없습니다." }, { status: 404 })
    }

    // 기존 설정과 새 설정을 병합
    facilitySettings[settingIndex] = {
      ...facilitySettings[settingIndex],
      ...data,
    }

    return NextResponse.json(facilitySettings[settingIndex])
  } catch (error) {
    console.error("Error updating facility settings:", error)
    return NextResponse.json({ error: "시설 설정을 업데이트하는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

