import { type NextRequest, NextResponse } from "next/server"
import { getNotices, createNotice } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const notices = await getNotices()
    return NextResponse.json(notices)
  } catch (error) {
    console.error("Error fetching notices:", error)
    return NextResponse.json({ error: "공지사항을 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const { title, content, important } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    const notice = await createNotice({
      title,
      content,
      authorId: user.id,
      authorName: user.name,
      important: important || false,
    })

    return NextResponse.json(notice)
  } catch (error) {
    console.error("Error creating notice:", error)
    return NextResponse.json({ error: "공지사항 작성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

