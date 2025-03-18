/**
 * 이벤트 핸들러 타입 정의
 */
type EventHandler<T = any> = (data: T) => void | Promise<void>

/**
 * 이벤트 버스 클래스
 * 모듈 간 결합도를 낮추기 위한 이벤트 기반 통신을 지원합니다.
 */
export class EventBus {
  private static instance: EventBus
  private handlers: Map<string, EventHandler[]> = new Map()

  private constructor() {}

  /**
   * 싱글톤 인스턴스 반환
   */
  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }
    return EventBus.instance
  }

  /**
   * 이벤트 구독
   * @param event 이벤트 이름
   * @param handler 이벤트 핸들러
   */
  on<T>(event: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, [])
    }
    this.handlers.get(event)!.push(handler)
  }

  /**
   * 이벤트 구독 취소
   * @param event 이벤트 이름
   * @param handler 이벤트 핸들러
   */
  off<T>(event: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(event)) return

    const handlers = this.handlers.get(event)!
    const index = handlers.indexOf(handler)
    if (index !== -1) {
      handlers.splice(index, 1)
    }
  }

  /**
   * 이벤트 발행
   * @param event 이벤트 이름
   * @param data 이벤트 데이터
   */
  async emit<T>(event: string, data: T): Promise<void> {
    if (!this.handlers.has(event)) return

    const handlers = this.handlers.get(event)!
    await Promise.all(handlers.map((handler) => handler(data)))
  }
}

