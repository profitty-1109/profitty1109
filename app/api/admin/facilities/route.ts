import { NextResponse } from "next/server"
import { getFacilities, updateFacility, createFacility, deleteFacility } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const facilities = await getFacilities()
    return NextResponse.json(facilities)
  } catch (error) {
    console.error("Error fetching facilities:", error)
    return NextResponse.json({ error: "시설 정보를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const data = await request.json()
    const facility = await createFacility(data)
    return NextResponse.json(facility)
  } catch (error) {
    console.error("Error creating facility:", error)
    return NextResponse.json({ error: "시설 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const data = await request.json()
    const facility = await updateFacility(data.id, data)
    return NextResponse.json(facility)
  } catch (error) {
    console.error("Error updating facility:", error)
    return NextResponse.json({ error: "시설 업데이트 중 오류가 발생했습니다." }, { status: 500 })
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
      return NextResponse.json({ error: "시설 ID가 필요합니다." }, { status: 400 })
    }

    await deleteFacility(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting facility:", error)
    return NextResponse.json({ error: "시설 삭제 중 오류가 발생했습니다." }, { status: 500 })
  }
}

