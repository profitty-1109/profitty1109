import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

// 목업 데이터 - 실제 구현에서는 데이터베이스에서 가져옴
const mockReservations = [
  {
    id: "R001",
    facilityId: "1",
    facilityName: "헬스장",
    userId: "U001",
    userName: "홍길동",
    date: "2025-03-17",
    timeSlot: "10:00-11:00",
    status: "confirmed",
    createdAt: "2025-03-10T09:30:00Z",
    note: "",
  },
  {
    id: "R002",
    facilityId: "2",
    facilityName: "수영장",
    userId: "U002",
    userName: "김철수",
    date: "2025-03-17",
    timeSlot: "15:00-16:00",
    status: "confirmed",
    createdAt: "2025-03-11T14:20:00Z",
    note: "",
  },
  {
    id: "R003",
    facilityId: "4",
    facilityName: "탁구장",
    userId: "U003",
    userName: "이영희",
    date: "2025-03-17",
    timeSlot: "18:00-19:00",
    status: "pending",
    createdAt: "2025-03-12T17:45:00Z",
    note: "첫 방문 회원",
  },
  {
    id: "R004",
    facilityId: "1",
    facilityName: "헬스장",
    userId: "U004",
    userName: "박지성",
    date: "2025-03-17",
    timeSlot: "19:00-20:00",
    status: "cancelled",
    createdAt: "2025-03-13T18:10:00Z",
    note: "개인 사정으로 취소",
  },
  {
    id: "R005",
    facilityId: "2",
    facilityName: "수영장",
    userId: "U005",
    userName: "최민수",
    date: "2025-03-18",
    timeSlot: "11:00-12:00",
    status: "confirmed",
    createdAt: "2025-03-14T10:30:00Z",
    note: "",
  },
  {
    id: "R006",
    facilityId: "3",
    facilityName: "골프연습장",
    userId: "U001",
    userName: "홍길동",
    date: "2025-03-18",
    timeSlot: "14:00-15:00",
    status: "confirmed",
    createdAt: "2025-03-15T13:20:00Z",
    note: "",
  },
]

export async function GET(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const url = new URL(request.url)
    const date = url.searchParams.get("date")
    const facilityId = url.searchParams.get("facilityId")
    const status = url.searchParams.get("status")

    let filteredReservations = [...mockReservations]

    if (date) {
      filteredReservations = filteredReservations.filter((reservation) => reservation.date === date)
    }

    if (facilityId && facilityId !== "all") {
      filteredReservations = filteredReservations.filter((reservation) => reservation.facilityId === facilityId)
    }

    if (status) {
      filteredReservations = filteredReservations.filter((reservation) => reservation.status === status)
    }

    return NextResponse.json(filteredReservations)
  } catch (error) {
    console.error("Error fetching facility reservations:", error)
    return NextResponse.json({ error: "예약 정보를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const data = await request.json()
    const { id, status, note } = data

    if (!id) {
      return NextResponse.json({ error: "예약 ID가 필요합니다." }, { status: 400 })
    }

    // 실제 구현에서는 데이터베이스 업데이트
    const updatedReservation = mockReservations.find((reservation) => reservation.id === id)

    if (!updatedReservation) {
      return NextResponse.json({ error: "예약을 찾을 수 없습니다." }, { status: 404 })
    }

    if (status) {
      updatedReservation.status = status
    }

    if (note !== undefined) {
      updatedReservation.note = note
    }

    return NextResponse.json(updatedReservation)
  } catch (error) {
    console.error("Error updating facility reservation:", error)
    return NextResponse.json({ error: "예약 정보를 업데이트하는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "예약 ID가 필요합니다." }, { status: 400 })
    }

    // 실제 구현에서는 데이터베이스에서 삭제 또는 상태 변경
    const reservationIndex = mockReservations.findIndex((reservation) => reservation.id === id)

    if (reservationIndex === -1) {
      return NextResponse.json({ error: "예약을 찾을 수 없습니다." }, { status: 404 })
    }

    // 상태를 취소로 변경
    mockReservations[reservationIndex].status = "cancelled"

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error cancelling facility reservation:", error)
    return NextResponse.json({ error: "예약을 취소하는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

