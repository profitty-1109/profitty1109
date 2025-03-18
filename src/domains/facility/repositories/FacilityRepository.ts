import type { Facility, CreateFacilityDTO, UpdateFacilityDTO } from "../models/Facility"

/**
 * 시설 데이터 접근을 위한 리포지토리 인터페이스
 * 데이터 소스에 독립적인 인터페이스를 정의하여 구현체를 교체 가능하게 합니다.
 */
export interface FacilityRepository {
  /**
   * 모든 시설 목록을 조회합니다.
   */
  getFacilities(): Promise<Facility[]>

  /**
   * ID로 특정 시설을 조회합니다.
   * @param id 시설 ID
   */
  getFacilityById(id: string): Promise<Facility | null>

  /**
   * 새로운 시설을 생성합니다.
   * @param data 시설 생성 데이터
   */
  createFacility(data: CreateFacilityDTO): Promise<Facility>

  /**
   * 시설 정보를 업데이트합니다.
   * @param id 시설 ID
   * @param data 업데이트할 시설 데이터
   */
  updateFacility(id: string, data: UpdateFacilityDTO): Promise<Facility>

  /**
   * 시설을 삭제합니다.
   * @param id 시설 ID
   */
  deleteFacility(id: string): Promise<boolean>

  /**
   * 시설의 현재 이용자 수를 업데이트합니다.
   * @param id 시설 ID
   * @param count 현재 이용자 수
   */
  updateCurrentUsers(id: string, count: number): Promise<Facility>
}

