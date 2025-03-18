import { injectable, inject } from "tsyringe"
import type { Facility, CreateFacilityDTO, UpdateFacilityDTO, FacilityStatus } from "../models/Facility"
import type { FacilityRepository } from "../repositories/FacilityRepository"
import { AppError } from "@/core/errors/AppError"
import { EventBus } from "@/core/events/EventBus"
import { FacilityEvents } from "../events"

/**
 * 시설 관련 비즈니스 로직을 처리하는 서비스
 */
@injectable()
export class FacilityService {
  private eventBus: EventBus;

  constructor(
    @inject('FacilityRepository') private facilityRepository: FacilityRepository
  ) {
    this.eventBus = EventBus.getInstance();
  }

  /**
   * 모든 시설 목록을 조회합니다.
   */
  async getFacilities(): Promise<Facility[]> {
    return this.facilityRepository.getFacilities()
  }

  /**
   * ID로 특정 시설을 조회합니다.
   * @param id 시설 ID
   */
  async getFacilityById(id: string): Promise<Facility> {
    const facility = await this.facilityRepository.getFacilityById(id)
    if (!facility) {
      throw new AppError("FACILITY_NOT_FOUND", "시설을 찾을 수 없습니다.", 404)
    }
    return facility
  }

  /**
   * 새로운 시설을 생성합니다.
   * @param data 시설 생성 데이터
   */
  async createFacility(data: CreateFacilityDTO): Promise<Facility> {
    // 비즈니스 로직 검증
    this.validateFacilityData(data)

    const facility = await this.facilityRepository.createFacility(data)

    // 이벤트 발행
    await this.eventBus.emit(FacilityEvents.CREATED, facility)

    return facility
  }

  /**
   * 시설 정보를 업데이트합니다.
   * @param id 시설 ID
   * @param data 업데이트할 시설 데이터
   */
  async updateFacility(id: string, data: UpdateFacilityDTO): Promise<Facility> {
    // 시설 존재 여부 확인
    await this.getFacilityById(id)

    // 비즈니스 로직 검증
    if (Object.keys(data).length > 0) {
      this.validateFacilityData(data as Partial<CreateFacilityDTO>)
    }

    const updatedFacility = await this.facilityRepository.updateFacility(id, data)

    // 이벤트 발행
    await this.eventBus.emit(FacilityEvents.UPDATED, updatedFacility)

    return updatedFacility
  }

  /**
   * 시설 상태를 변경합니다.
   * @param id 시설 ID
   * @param status 변경할 상태
   */
  async updateFacilityStatus(id: string, status: FacilityStatus): Promise<Facility> {
    // 시설 존재 여부 확인
    const facility = await this.getFacilityById(id)

    // 상태가 이미 같은 경우 처리
    if (facility.status === status) {
      return facility
    }

    const updatedFacility = await this.facilityRepository.updateFacility(id, { status })

    // 상태 변경 이벤트 발행
    await this.eventBus.emit(FacilityEvents.STATUS_CHANGED, {
      facilityId: id,
      previousStatus: facility.status,
      newStatus: status,
      facility: updatedFacility,
    })

    return updatedFacility
  }

  /**
   * 시설을 삭제합니다.
   * @param id 시설 ID
   */
  async deleteFacility(id: string): Promise<boolean> {
    // 시설 존재 여부 확인
    const facility = await this.getFacilityById(id)

    const result = await this.facilityRepository.deleteFacility(id)

    // 이벤트 발행
    await this.eventBus.emit(FacilityEvents.DELETED, facility)

    return result
  }

  /**
   * 시설 데이터 유효성을 검증합니다.
   * @param data 검증할 시설 데이터
   */
  private validateFacilityData(data: Partial<CreateFacilityDTO>): void {
    // 이름 길이 검증
    if (data.name && (data.name.length < 2 || data.name.length > 50)) {
      throw new AppError("INVALID_FACILITY_NAME", "시설 이름은 2~50자 사이여야 합니다.", 400)
    }

    // 수용 인원 검증
    if (data.capacity !== undefined && (data.capacity < 1 || data.capacity > 1000)) {
      throw new AppError("INVALID_FACILITY_CAPACITY", "시설 수용 인원은 1~1000명 사이여야 합니다.", 400)
    }

    // 현재 이용자 수 검증
    if (data.currentUsers !== undefined && data.currentUsers < 0) {
      throw new AppError("INVALID_CURRENT_USERS", "현재 이용자 수는 0 이상이어야 합니다.", 400)
    }

    // 수용 인원과 현재 이용자 수 관계 검증
    if (data.capacity !== undefined && data.currentUsers !== undefined && data.currentUsers > data.capacity) {
      throw new AppError("CURRENT_USERS_EXCEED_CAPACITY", "현재 이용자 수는 수용 인원을 초과할 수 없습니다.", 400)
    }
  }
}

