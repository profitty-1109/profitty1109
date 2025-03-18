import { cookies } from "next/headers"
import { cache } from "react"

// 사용자 타입 정의
export type UserRole = "resident" | "trainer" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  apartment?: string
  unit?: string
}

// 세션 가져오기 함수를 캐싱하여 성능 향상
export const getSession = cache((): User | null => {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("user-session")

    if (!sessionCookie?.value) {
      console.log("세션 쿠키가 없습니다")
      return null
    }

    try {
      const user = JSON.parse(sessionCookie.value) as User
      console.log("세션에서 사용자 정보 가져옴:", { id: user.id, email: user.email, role: user.role })
      return user
    } catch (error) {
      console.error("세션 쿠키 파싱 오류:", error)
      return null
    }
  } catch (error) {
    console.error("세션 쿠키 접근 오류:", error)
    return null
  }
})

// 로그인 상태 확인 - 헤더 정보도 확인하도록 개선
export function isAuthenticated(headers?: Headers): boolean {
  // 1. 서버 측 세션 확인
  const user = getSession()
  if (user) return true

  // 2. 요청 헤더에서 토큰 확인 (API 라우트에서 사용)
  if (headers) {
    const authHeader = headers.get("Authorization")
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      try {
        const decoded = JSON.parse(Buffer.from(token, "base64").toString())
        if (decoded && decoded.id) return true
      } catch (error) {
        console.error("토큰 검증 오류:", error)
      }
    }

    // 3. X-User-Session 헤더 확인
    const userSessionHeader = headers.get("X-User-Session")
    if (userSessionHeader) {
      try {
        const sessionData = JSON.parse(userSessionHeader)
        if (sessionData && sessionData.id) return true
      } catch (error) {
        console.error("세션 헤더 파싱 오류:", error)
      }
    }
  }

  return false
}

// 현재 사용자 정보 가져오기 - 헤더 정보도 확인하도록 개선
export function getCurrentUser(headers?: Headers): User | null {
  try {
    // 1. 서버 측 세션 확인
    const user = getSession()
    if (user) return user

    // 2. 요청 헤더에서 토큰 확인 (API 라우트에서 사용)
    if (headers) {
      const authHeader = headers.get("Authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7)
        try {
          const decoded = JSON.parse(Buffer.from(token, "base64").toString()) as User
          if (decoded && decoded.id) return decoded
        } catch (error) {
          console.error("토큰 검증 오류:", error)
        }
      }

      // 3. X-User-Session 헤더 확인
      const userSessionHeader = headers.get("X-User-Session")
      if (userSessionHeader) {
        try {
          const sessionData = JSON.parse(userSessionHeader) as User
          if (sessionData && sessionData.id) return sessionData
        } catch (error) {
          console.error("세션 헤더 파싱 오류:", error)
        }
      }
    }

    console.log("현재 로그인된 사용자가 없습니다")
    return null
  } catch (error) {
    console.error("현재 사용자 정보 가져오기 오류:", error)
    return null
  }
}

// 인증 토큰에서 사용자 정보 추출
export function getUserFromToken(token: string): User | null {
  try {
    const decoded = Buffer.from(token, "base64").toString()
    return JSON.parse(decoded) as User
  } catch (error) {
    console.error("토큰 디코딩 오류:", error)
    return null
  }
}

// 클라이언트 측에서 사용할 수 있는 인증 헤더 생성 함수
export function getAuthHeader(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  // 클라이언트 측에서는 쿠키가 자동으로 전송되므로 추가 헤더가 필요 없음
  return headers
}

