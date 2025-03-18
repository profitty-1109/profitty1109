/**
 * 시설 모델 정의
 * 아파트 내 공용 시설(헬스장, 수영장 등)의 데이터 구조를 정의합니다.
 */
export type FacilityStatus = "open" | "closed" | "maintenance"

export interface Facility {
  id: string
  name: string
  description: string
  image: string
  hours: string
  location: string
  status: FacilityStatus
  capacity: number
  currentUsers: number
  createdAt: string
  updatedAt: string
}

/**
 * 시설 생성 시 필요한 데이터 타입
 */
export type CreateFacilityDTO = Omit<Facility, "id" | "createdAt" | "updatedAt">

/**
 * 시설 업데이트 시 필요한 데이터 타입
 */
export type UpdateFacilityDTO = Partial<Omit<Facility, "id" | "createdAt" | "updatedAt">>

