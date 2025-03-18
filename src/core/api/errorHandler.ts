import type { NextApiRequest, NextApiResponse } from "next"
import { AppError } from "@/core/errors/AppError"

/**
 * API 에러 핸들러
 * 모든 API 라우트에서 발생하는 에러를 일관되게 처리합니다.
 */
export function errorHandler(err: unknown, req: NextApiRequest, res: NextApiResponse): void {
  console.error("API Error:", err)

  // AppError 인스턴스인 경우
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    })
    return
  }

  // Error 인스턴스인 경우
  if (err instanceof Error) {
    res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: process.env.NODE_ENV === "production" ? "서버 오류가 발생했습니다." : err.message,
      },
    })
    return
  }

  // 그 외의 경우
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "알 수 없는 오류가 발생했습니다.",
    },
  })
}

