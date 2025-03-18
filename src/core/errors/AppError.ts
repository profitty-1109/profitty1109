/**
 * 애플리케이션 에러 클래스
 * 모든 비즈니스 로직 에러는 이 클래스를 상속받아 처리합니다.
 */
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = "AppError"

    // Error 클래스를 상속받을 때 프로토타입 체인 유지를 위한 설정
    Object.setPrototypeOf(this, AppError.prototype)
  }

  /**
   * 400 Bad Request 에러 생성
   */
  static badRequest(message: string, code = "BAD_REQUEST", details?: unknown): AppError {
    return new AppError(code, message, 400, details)
  }

  /**
   * 401 Unauthorized 에러 생성
   */
  static unauthorized(message: string, code = "UNAUTHORIZED", details?: unknown): AppError {
    return new AppError(code, message, 401, details)
  }

  /**
   * 403 Forbidden 에러 생성
   */
  static forbidden(message: string, code = "FORBIDDEN", details?: unknown): AppError {
    return new AppError(code, message, 403, details)
  }

  /**
   * 404 Not Found 에러 생성
   */
  static notFound(message: string, code = "NOT_FOUND", details?: unknown): AppError {
    return new AppError(code, message, 404, details)
  }

  /**
   * 500 Internal Server Error 에러 생성
   */
  static internal(message: string, code = "INTERNAL_ERROR", details?: unknown): AppError {
    return new AppError(code, message, 500, details)
  }
}

