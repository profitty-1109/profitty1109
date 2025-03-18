import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 인증이 필요한 경로 패턴
const PROTECTED_PATHS = ["/resident", "/trainer", "/admin"]

// 역할별 접근 가능한 경로 패턴
const ROLE_PATHS = {
  resident: ["/resident"],
  trainer: ["/trainer"],
  admin: ["/admin"],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 인증이 필요한 경로인지 확인
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // 1. 쿠키에서 세션 확인
  const sessionCookie = request.cookies.get("user-session")

  // 2. 헤더에서 토큰 확인
  const authHeader = request.headers.get("Authorization")
  const userSessionHeader = request.headers.get("X-User-Session")

  // 3. URL 쿼리 파라미터에서 토큰 확인
  const url = new URL(request.url)
  const tokenParam = url.searchParams.get("token")

  let user = null

  // 세션 쿠키 확인
  if (sessionCookie?.value) {
    try {
      user = JSON.parse(sessionCookie.value)
    } catch (error) {
      console.error("세션 쿠키 파싱 오류:", error)
    }
  }

  // 인증 헤더 확인
  if (!user && authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7)
    try {
      user = JSON.parse(Buffer.from(token, "base64").toString())
    } catch (error) {
      console.error("토큰 검증 오류:", error)
    }
  }

  // X-User-Session 헤더 확인
  if (!user && userSessionHeader) {
    try {
      user = JSON.parse(userSessionHeader)
    } catch (error) {
      console.error("세션 헤더 파싱 오류:", error)
    }
  }

  // 토큰 파라미터 확인
  if (!user && tokenParam) {
    try {
      user = JSON.parse(Buffer.from(tokenParam, "base64").toString())
    } catch (error) {
      console.error("토큰 파라미터 검증 오류:", error)
    }
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 역할 기반 접근 제어
  const { role } = user
  const hasAccess = ROLE_PATHS[role as keyof typeof ROLE_PATHS]?.some((path) => pathname.startsWith(path))

  if (!hasAccess) {
    // 권한이 없는 경우 대시보드로 리다이렉트
    const dashboardUrl = new URL(`/${role}/dashboard`, request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // 인증이 필요한 경로 패턴
    "/resident/:path*",
    "/trainer/:path*",
    "/admin/:path*",
    // API 경로는 제외 (API 내부에서 인증 처리)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

