import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

// 목업 데이터 - 실제 구현에서는 데이터베이스에서 가져옴
const mockReservationDetails = {
  "1": [
    // 헬스장
    {
      id: "R001",
      facilityId: "1",
      facilityName: "헬스장",
      date: "2025-03-17",
      timeSlot: "09:00-10:00",
      userId: "U001",
      userName: "홍길동",
      userPhone: "010-1234-5678",
      userEmail: "hong@example.com",
      status: "confirmed",
      createdAt: "2025-03-10T09:30:00Z",
      checkedIn: false,
      note: "",
      purpose: "웨이트 트레이닝",
      companions: 0,
    },
    {
      id: "R002",
      facilityId: "1",
      facilityName: "헬스장",
      date: "2025-03-17",
      timeSlot: "10:00-11:00",
      userId: "U002",
      userName: "김철수",
      userPhone: "010-2345-6789",
      userEmail: "kim@example.com",
      status: "confirmed",
      createdAt: "2025-03-11T14:20:00Z",
      checkedIn: false,
      note: "",
      purpose: "유산소 운동",
      companions: 0,
    },
    {
      id: "R003",
      facilityId: "1",
      facilityName: "헬스장",
      date: "2025-03-17",
      timeSlot: "14:00-15:00",
      userId: "U003",
      userName: "이영희",
      userPhone: "010-3456-7890",
      userEmail: "lee@example.com",
      status: "pending",
      createdAt: "2025-03-12T17:45:00Z",
      checkedIn: false,
      note: "첫 방문 회원",
      purpose: "PT 상담",
      companions: 0,
    },
    {
      id: "R004",
      facilityId: "1",
      facilityName: "헬스장",
      date: "2025-03-17",
      timeSlot: "18:00-19:00",
      userId: "U004",
      userName: "박지성",
      userPhone: "010-4567-8901",
      userEmail: "park@example.com",
      status: "cancelled",
      createdAt: "2025-03-13T18:10:00Z",
      checkedIn: false,
      note: "개인 사정으로 취소",
      purpose: "웨이트 트레이닝",
      companions: 0,
    },
  ],
  "2": [
    // 수영장
    {
      id: "R005",
      facilityId: "2",
      facilityName: "수영장",
      date: "2025-03-17",
      timeSlot: "06:00-07:00",
      userId: "U005",
      userName: "최민수",
      userPhone: "010-5678-9012",
      userEmail: "choi@example.com",
      status: "confirmed",
      createdAt: "2025-03-14T10:30:00Z",
      checkedIn: true,
      note: "",
      purpose: "자유 수영",
      companions: 0,
    },
    {
      id: "R006",
      facilityId: "2",
      facilityName: "수영장",
      date: "2025-03-17",
      timeSlot: "15:00-16:00",
      userId: "U006",
      userName: "정소연",
      userPhone: "010-6789-0123",
      userEmail: "jung@example.com",
      status: "confirmed",
      createdAt: "2025-03-14T11:45:00Z",
      checkedIn: false,
      note: "",
      purpose: "수영 강습",
      companions: 0,
    },
  ],
  "3": [
    // 골프연습장
    {
      id: "R007",
      facilityId: "3",
      facilityName: "골프연습장",
      date: "2025-03-17",
      timeSlot: "14:00-15:00",
      userId: "U007",
      userName: "강동원",
      userPhone: "010-7890-1234",
      userEmail: "kang@example.com",
      status: "confirmed",
      createdAt: "2025-03-15T13:20:00Z",
      checkedIn: false,
      note: "",
      purpose: "스윙 연습",
      companions: 0,
    },
  ],
  "4": [
    // 탁구장
    {
      id: "R008",
      facilityId: "4",
      facilityName: "탁구장",
      date: "2025-03-17",
      timeSlot: "18:00-19:00",
      userId: "U008",
      userName: "윤서진",
      userPhone: "010-8901-2345",
      userEmail: "yoon@example.com",
      status: "confirmed",
      createdAt: "2025-03-15T16:10:00Z",
      checkedIn: false,
      note: "",
      purpose: "친구와 함께",
      companions: 1,
    },
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
    const reservationId = url.searchParams.get("id")

    if (!facilityId && !reservationId) {
      return NextResponse.json({ error: "시설 ID 또는 예약 ID가 필요합니다." }, { status: 400 })
    }

    if (reservationId) {
      // 특정 예약 ID로 조회
      for (const facilityReservations of Object.values(mockReservationDetails)) {
        const reservation = facilityReservations.find((r) => r.id === reservationId)
        if (reservation) {
          return NextResponse.json(reservation)
        }
      }
      return NextResponse.json({ error: "예약을 찾을 수 없습니다." }, { status: 404 })
    }

    // 시설 ID로 조회
    const reservations = mockReservationDetails[facilityId]

    if (!reservations) {
      return NextResponse.json({ error: "해당 시설의 예약을 찾을 수 없습니다." }, { status: 404 })
    }

    // 날짜로 필터링
    if (date) {
      const filteredReservations = reservations.filter((r) => r.date === date)
      return NextResponse.json(filteredReservations)
    }

    return NextResponse.json(reservations)
  } catch (error) {
    console.error("Error fetching facility reservation details:", error)
    return NextResponse.json({ error: "시설 예약 상세 정보를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const data = await request.json()
    const { id, status, note, checkedIn } = data

    if (!id) {
      return NextResponse.json({ error: "예약 ID가 필요합니다." }, { status: 400 })
    }

    // 예약 찾기
    let foundReservation = null
    let facilityId = null

    for (const [fId, facilityReservations] of Object.entries(mockReservationDetails)) {
      const reservation = facilityReservations.find((r) => r.id === id)
      if (reservation) {
        foundReservation = reservation
        facilityId = fId
        break
      }
    }

    if (!foundReservation) {
      return NextResponse.json({ error: "예약을 찾을 수 없습니다." }, { status: 404 })
    }

    // 예약 정보 업데이트
    if (status !== undefined) {
      foundReservation.status = status
    }

    if (note !== undefined) {
      foundReservation.note = note
    }

    if (checkedIn !== undefined) {
      foundReservation.checkedIn = checkedIn
    }

    return NextResponse.json(foundReservation)
  } catch (error) {
    console.error("Error updating facility reservation:", error)
    return NextResponse.json({ error: "시설 예약을 업데이트하는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

