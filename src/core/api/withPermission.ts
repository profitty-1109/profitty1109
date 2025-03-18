import type { NextApiRequest, NextApiResponse } from "next"
import { type Permission, hasPermission } from "@/core/auth/permissions"
import { AppError } from "@/core/errors/AppError"
import { getUserRoleFromToken } from "@/core/auth/jwt"

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

/**
 * 권한 검사 미들웨어
 * API 핸들러에 권한 검사 로직을 추가합니다.
 * @param permission 필요한 권한
 */
export function withPermission(permission: Permission) {
  return (handler: ApiHandler): ApiHandler =>
    async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        // 헤더에서 토큰 추출
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          throw AppError.unauthorized("인증이 필요합니다.")
        }

        const token = authHeader.substring(7)

        // 토큰에서 사용자 역할 추출
        const userRole = getUserRoleFromToken(token)

        // 권한 검사
        if (!hasPermission(userRole, permission)) {
          throw AppError.forbidden("이 작업을 수행할 권한이 없습니다.")
        }

        // 권한이 있으면 핸들러 실행
        return handler(req, res)
      } catch (error) {
        if (error instanceof AppError) {
          return res.status(error.statusCode).json({
            error: {
              code: error.code,
              message: error.message,
            },
          })
        }

        console.error("권한 검사 중 오류 발생:", error)
        return res.status(500).json({
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "서버 오류가 발생했습니다.",
          },
        })
      }
    }
}

