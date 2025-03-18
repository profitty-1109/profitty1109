import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/core/auth/jwt"

/**
 * 미들웨어 함수
 * 인증 및 CSRF 보호를 처리합니다.
 */
export function middleware(request: NextRequest) {
  // API 요청에 대해서만 처리
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // CSRF 토큰 검증 (POST, PUT, DELETE 요청에 대해서만)
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
      const csrfToken = request.headers.get("X-CSRF-Token")
      const expectedToken = request.cookies.get("csrf-token")?.value

      if (!csrfToken || !expectedToken || csrfToken !== expectedToken) {
        return NextResponse.json(
          { error: { code: "CSRF_ERROR", message: "CSRF 토큰 검증에 실패했습니다." } },
          { status: 403 },
        )
      }
    }

    // 인증 토큰 검증 (공개 API 제외)
    const publicPaths = ["/api/auth/login", "/api/auth/register"]
    if (!publicPaths.includes(request.nextUrl.pathname)) {
      const authHeader = request.headers.get("authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "인증이 필요합니다." } }, { status: 401 })
      }

      const token = authHeader.substring(7)

      try {
        const payload = verifyToken(token)

        // 요청 헤더에 사용자 정보 추가
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set("X-User-ID", payload.sub)
        requestHeaders.set("X-User-Role", payload.role)

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
      } catch (error) {
        return NextResponse.json(
          { error: { code: "UNAUTHORIZED", message: "유효하지 않거나 만료된 토큰입니다." } },
          { status: 401 },
        )
      }
    }
  }

  // 보호된 페이지 접근 제어
  const protectedPaths = ["/admin", "/resident", "/trainer"]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath) {
    // 쿠키에서 인증 토큰 확인
    const authToken = request.cookies.get("auth-token")?.value

    if (!authToken) {
      // 로그인 페이지로 리다이렉트
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const payload = verifyToken(authToken)

      // 역할 기반 접근 제어
      const role = payload.role
      const pathRole = protectedPaths.find((path) => request.nextUrl.pathname.startsWith(path))?.replace("/", "")

      if (pathRole && role !== pathRole) {
        // 권한이 없는 경우 대시보드로 리다이렉트
        const dashboardUrl = new URL(`/${role}/dashboard`, request.url)
        return NextResponse.redirect(dashboardUrl)
      }
    } catch (error) {
      // 토큰이 유효하지 않은 경우 로그인 페이지로 리다이렉트
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // API 경로
    "/api/:path*",
    // 보호된 페이지 경로
    "/admin/:path*",
    "/resident/:path*",
    "/trainer/:path*",
  ],
}

