/**
 * 예약 모델 정의
 * 시설 예약 데이터 구조를 정의합니다.
 */
export type ReservationStatus = "pending" | "confirmed" | "cancelled"

export interface Reservation {
  id: string
  facilityId: string
  facilityName: string
  userId: string
  userName: string
  date: string // YYYY-MM-DD 형식
  timeSlot: string // HH:MM-HH:MM 형식
  status: ReservationStatus
  createdAt: string
  updatedAt: string
}

/**
 * 예약 생성 시 필요한 데이터 타입
 */
export type CreateReservationDTO = Omit<Reservation, "id" | "createdAt" | "updatedAt">

/**
 * 예약 업데이트 시 필요한 데이터 타입
 */
export type UpdateReservationDTO = Partial<Omit<Reservation, "id" | "createdAt" | "updatedAt">>

