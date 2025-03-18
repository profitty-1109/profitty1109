import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  // 세션 쿠키 삭제
  cookies().delete("user-session")

  return NextResponse.json({ success: true })
}

