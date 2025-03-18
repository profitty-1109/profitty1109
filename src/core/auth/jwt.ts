import jwt from "jsonwebtoken"
import type { User, UserRole, SafeUser } from "@/domains/user/models/User"
import { AppError } from "@/core/errors/AppError"

// 환경 변수에서 JWT 설정 가져오기
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d" // 1일

/**
 * JWT 페이로드 인터페이스
 */
export interface JwtPayload {
  sub: string // 사용자 ID
  email: string
  role: UserRole
  iat: number // 발급 시간
  exp: number // 만료 시간
}

/**
 * 사용자 정보로 JWT 토큰 생성
 * @param user 사용자 정보
 */
export function generateToken(user: User | SafeUser): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  )
}

/**
 * JWT 토큰 검증 및 페이로드 반환
 * @param token JWT 토큰
 */
export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized("토큰이 만료되었습니다.")
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw AppError.unauthorized("유효하지 않은 토큰입니다.")
    }
    throw AppError.unauthorized("토큰 검증 중 오류가 발생했습니다.")
  }
}

/**
 * 토큰에서 사용자 ID 추출
 * @param token JWT 토큰
 */
export function getUserIdFromToken(token: string): string {
  const payload = verifyToken(token)
  return payload.sub
}

/**
 * 토큰에서 사용자 역할 추출
 * @param token JWT 토큰
 */
export function getUserRoleFromToken(token: string): UserRole {
  const payload = verifyToken(token)
  return payload.role
}

