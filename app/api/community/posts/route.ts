import { type NextRequest, NextResponse } from "next/server"
import { getPosts, createPost } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const posts = await getPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "게시글을 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    }

    const { title, content, category } = await request.json()

    if (!title || !content || !category) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    const post = await createPost({
      title,
      content,
      authorId: user.id,
      authorName: user.name,
      category,
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "게시글 작성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

