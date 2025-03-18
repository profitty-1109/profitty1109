import type { UserRole } from "@/domains/user/models/User"

/**
 * 권한 정의
 */
export enum Permission {
  // 시설 관련 권한
  READ_FACILITY = "read:facility",
  MANAGE_FACILITY = "manage:facility",

  // 예약 관련 권한
  READ_RESERVATION = "read:reservation",
  CREATE_RESERVATION = "create:reservation",
  MANAGE_RESERVATION = "manage:reservation",

  // 사용자 관련 권한
  READ_USER = "read:user",
  MANAGE_USER = "manage:user",

  // 공지사항 관련 권한
  READ_NOTICE = "read:notice",
  MANAGE_NOTICE = "manage:notice",

  // 커뮤니티 관련 권한
  READ_COMMUNITY = "read:community",
  CREATE_COMMUNITY = "create:community",
  MANAGE_COMMUNITY = "manage:community",

  // 트레이너 관련 권한
  MANAGE_LESSON = "manage:lesson",
  MANAGE_ROUTINE = "manage:routine",
  MANAGE_MEMBER = "manage:member",
}

/**
 * 역할별 권한 매핑
 */
const rolePermissions: Record<UserRole, Permission[]> = {
  resident: [
    Permission.READ_FACILITY,
    Permission.READ_RESERVATION,
    Permission.CREATE_RESERVATION,
    Permission.READ_NOTICE,
    Permission.READ_COMMUNITY,
    Permission.CREATE_COMMUNITY,
  ],
  trainer: [
    Permission.READ_FACILITY,
    Permission.READ_RESERVATION,
    Permission.MANAGE_LESSON,
    Permission.MANAGE_ROUTINE,
    Permission.MANAGE_MEMBER,
    Permission.READ_NOTICE,
    Permission.READ_COMMUNITY,
    Permission.CREATE_COMMUNITY,
  ],
  admin: [
    Permission.READ_FACILITY,
    Permission.MANAGE_FACILITY,
    Permission.READ_RESERVATION,
    Permission.MANAGE_RESERVATION,
    Permission.READ_USER,
    Permission.MANAGE_USER,
    Permission.READ_NOTICE,
    Permission.MANAGE_NOTICE,
    Permission.READ_COMMUNITY,
    Permission.MANAGE_COMMUNITY,
  ],
}

/**
 * 사용자 역할이 특정 권한을 가지고 있는지 확인
 * @param userRole 사용자 역할
 * @param permission 확인할 권한
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return rolePermissions[userRole]?.includes(permission) || false
}

/**
 * 사용자 역할이 여러 권한 중 하나라도 가지고 있는지 확인
 * @param userRole 사용자 역할
 * @param permissions 확인할 권한 목록
 */
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission))
}

/**
 * 사용자 역할이 모든 권한을 가지고 있는지 확인
 * @param userRole 사용자 역할
 * @param permissions 확인할 권한 목록
 */
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission))
}

