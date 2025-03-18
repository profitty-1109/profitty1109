import { NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()

    // 필수 필드 검증
    if (!email || !password || !role) {
      return NextResponse.json({ error: "이메일, 비밀번호, 역할은 필수 입력 항목입니다." }, { status: 400 })
    }

    console.log("로그인 요청 받음:", { email, role })

    // 이메일로 사용자 찾기
    const user = await getUserByEmail(email)

    console.log(
      "사용자 조회 결과:",
      user
        ? {
            id: user.id,
            email: user.email,
            role: user.role,
            found: true,
          }
        : "사용자 없음",
    )

    // 사용자가 없는 경우
    if (!user) {
      console.log("로그인 실패: 사용자 없음")
      return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 })
    }

    // 비밀번호가 일치하지 않는 경우
    if (user.password !== password) {
      console.log("로그인 실패: 비밀번호 불일치", { expected: user.password, received: password })
      return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 })
    }

    // 역할이 일치하지 않는 경우 - 자동으로 올바른 역할 사용
    if (role && user.role !== role) {
      console.log("역할 불일치 감지, 올바른 역할로 진행:", { requested: role, actual: user.role })
      // 역할 불일치 경고만 로그로 남기고 실제 사용자 역할로 진행
      // 클라이언트에서 리다이렉트 처리를 위해 실제 역할 정보 포함
      const roleToAssign = user.role
    }

    // 세션에 저장할 사용자 정보 (비밀번호 제외)
    const { password: _, ...userWithoutPassword } = user

    // 세션 쿠키 설정
    const session = JSON.stringify(userWithoutPassword)
    const encodedSession = Buffer.from(session).toString("base64")

    // 토큰 생성
    const token = encodedSession

    // 쿠키 설정
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    }

    // 응답 생성
    const response = NextResponse.json({
      success: true,
      message: "로그인 성공",
      user: userWithoutPassword,
      token,
    })

    // 쿠키 설정
    response.cookies.set("user-session", session, cookieOptions)

    console.log("로그인 성공:", { id: user.id, email: user.email, role: user.role })
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "로그인 처리 중 오류가 발생했습니다." }, { status: 500 })
  }
}

