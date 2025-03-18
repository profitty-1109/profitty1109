/**
 * 사용자 역할 정의
 */
export type UserRole = "resident" | "trainer" | "admin"

/**
 * 사용자 모델 정의
 */
export interface User {
  id: string
  email: string
  password: string // 실제로는 해시된 비밀번호가 저장됨
  name: string
  role: UserRole
  apartment?: string // 입주민인 경우 아파트 동
  unit?: string // 입주민인 경우 호수
  createdAt: string
  updatedAt: string
}

/**
 * 클라이언트에 반환할 사용자 정보 (비밀번호 제외)
 */
export type SafeUser = Omit<User, "password">

/**
 * 사용자 생성 시 필요한 데이터 타입
 */
export type CreateUserDTO = Omit<User, "id" | "createdAt" | "updatedAt">

/**
 * 사용자 업데이트 시 필요한 데이터 타입
 */
export type UpdateUserDTO = Partial<Omit<User, "id" | "createdAt" | "updatedAt">>

/**
 * 로그인 요청 데이터 타입
 */
export interface LoginDTO {
  email: string
  password: string
  role?: UserRole
}

/**
 * 로그인 응답 데이터 타입
 */
export interface LoginResponseDTO {
  user: SafeUser
  token: string
}

