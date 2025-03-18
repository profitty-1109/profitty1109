import { type NextRequest, NextResponse } from "next/server"

// 사용자 데이터를 저장할 임시 데이터베이스 (실제 구현에서는 데이터베이스 사용)
const users: any[] = []

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 사용자 데이터 추출
    const userData = await request.json()

    // 필수 필드 검증
    const requiredFields = ["email", "password", "name", "role"]
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json({ error: `${field} 필드는 필수입니다.` }, { status: 400 })
      }
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json({ error: "유효한 이메일 주소를 입력해주세요." }, { status: 400 })
    }

    // 비밀번호 길이 검증
    if (userData.password.length < 8) {
      return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 })
    }

    // 이메일 중복 검사
    const existingUser = users.find((user) => user.email === userData.email)
    if (existingUser) {
      return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 409 })
    }

    // 역할별 추가 필드 검증
    if (userData.role === "resident") {
      if (!userData.building || !userData.unit) {
        return NextResponse.json({ error: "동/호수 정보는 필수입니다." }, { status: 400 })
      }
    } else if (userData.role === "trainer") {
      if (!userData.specialization) {
        return NextResponse.json({ error: "전문 분야는 필수입니다." }, { status: 400 })
      }
    } else if (userData.role === "admin") {
      if (!userData.position || !userData.department) {
        return NextResponse.json({ error: "직책과 부서 정보는 필수입니다." }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: "유효하지 않은 사용자 역할입니다." }, { status: 400 })
    }

    // 사용자 ID 생성
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // 비밀번호 해싱 (실제 구현에서는 bcrypt 등 사용)
    // 여기서는 간단한 예시로 Base64 인코딩 사용
    const hashedPassword = Buffer.from(userData.password).toString("base64")

    // 새 사용자 객체 생성
    const newUser = {
      id: userId,
      email: userData.email,
      password: hashedPassword, // 실제 구현에서는 해싱된 비밀번호 저장
      name: userData.name,
      role: userData.role,
      createdAt: new Date().toISOString(),
      ...userData, // 나머지 필드 포함
    }

    // 비밀번호 확인 필드 제거
    delete newUser.confirmPassword
    delete newUser.agreeTerms

    // 사용자 데이터 저장 (실제 구현에서는 데이터베이스에 저장)
    users.push(newUser)

    // 민감한 정보 제거
    const userResponse = { ...newUser }
    delete userResponse.password

    // 성공 응답 반환
    return NextResponse.json(
      {
        message: "회원가입이 완료되었습니다.",
        user: userResponse,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("회원가입 처리 중 오류 발생:", error)
    return NextResponse.json({ error: "회원가입 처리 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 사용자 목록 조회 (테스트용)
export async function GET(request: NextRequest) {
  // 실제 구현에서는 관리자 권한 확인 필요
  try {
    // 비밀번호 필드 제거
    const safeUsers = users.map((user) => {
      const { password, ...safeUser } = user
      return safeUser
    })

    return NextResponse.json({ users: safeUsers })
  } catch (error) {
    console.error("사용자 목록 조회 중 오류 발생:", error)
    return NextResponse.json({ error: "사용자 목록 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}

