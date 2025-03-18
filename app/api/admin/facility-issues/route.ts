import { NextResponse } from "next/server"
import { getFacilityIssues, createFacilityIssue, updateFacilityIssue, deleteFacilityIssue } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const url = new URL(request.url)
    const facilityId = url.searchParams.get("facilityId")
    const status = url.searchParams.get("status")

    const issues = await getFacilityIssues(facilityId, status)
    return NextResponse.json(issues)
  } catch (error) {
    console.error("Error fetching facility issues:", error)
    return NextResponse.json({ error: "시설 문제 정보를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const data = await request.json()
    const issue = await createFacilityIssue(data)
    return NextResponse.json(issue)
  } catch (error) {
    console.error("Error creating facility issue:", error)
    return NextResponse.json({ error: "시설 문제 보고 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const data = await request.json()
    const issue = await updateFacilityIssue(data.id, data)
    return NextResponse.json(issue)
  } catch (error) {
    console.error("Error updating facility issue:", error)
    return NextResponse.json({ error: "시설 문제 업데이트 중 오류가 발생했습니다." }, { status: 500 })
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
      return NextResponse.json({ error: "문제 ID가 필요합니다." }, { status: 400 })
    }

    await deleteFacilityIssue(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting facility issue:", error)
    return NextResponse.json({ error: "시설 문제 삭제 중 오류가 발생했습니다." }, { status: 500 })
  }
}

