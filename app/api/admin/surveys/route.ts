import { NextResponse } from "next/server"
import { getSurveys, createSurvey, updateSurvey, deleteSurvey, getSurveyResults } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")
    const results = url.searchParams.get("results") === "true"

    if (id && results) {
      const surveyResults = await getSurveyResults(id)
      return NextResponse.json(surveyResults)
    } else if (id) {
      const survey = await getSurveys(id)
      return NextResponse.json(survey)
    } else {
      const surveys = await getSurveys()
      return NextResponse.json(surveys)
    }
  } catch (error) {
    console.error("Error fetching surveys:", error)
    return NextResponse.json({ error: "수요 조사 정보를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const data = await request.json()
    const survey = await createSurvey(data)
    return NextResponse.json(survey)
  } catch (error) {
    console.error("Error creating survey:", error)
    return NextResponse.json({ error: "수요 조사 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const data = await request.json()
    const survey = await updateSurvey(data.id, data)
    return NextResponse.json(survey)
  } catch (error) {
    console.error("Error updating survey:", error)
    return NextResponse.json({ error: "수요 조사 업데이트 중 오류가 발생했습니다." }, { status: 500 })
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
      return NextResponse.json({ error: "수요 조사 ID가 필요합니다." }, { status: 400 })
    }

    await deleteSurvey(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting survey:", error)
    return NextResponse.json({ error: "수요 조사 삭제 중 오류가 발생했습니다." }, { status: 500 })
  }
}

