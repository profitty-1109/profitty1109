import { type NextRequest, NextResponse } from "next/server"
import { getLessons, createReservation } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const lessons = await getLessons()
    return NextResponse.json(lessons)
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ error: "레슨 정보를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    const { lessonId, lessonTitle, date, time } = await request.json()

    if (!lessonId || !date || !time) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    const reservation = await createReservation({
      lessonId,
      lessonTitle,
      userId: user.id,
      userName: user.name,
      date,
      time,
      status: "confirmed",
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json({ error: "예약 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

