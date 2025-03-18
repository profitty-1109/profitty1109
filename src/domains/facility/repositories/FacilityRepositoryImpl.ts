import { injectable } from "tsyringe"
import type { Facility, CreateFacilityDTO, UpdateFacilityDTO } from "../models/Facility"
import type { FacilityRepository } from "./FacilityRepository"
import { AppError } from "@/core/errors/AppError"
import { db } from "@/core/db/client"

/**
 * 시설 리포지토리 구현체
 * 실제 데이터베이스 접근 로직을 구현합니다.
 */
@injectable()
export class FacilityRepositoryImpl implements FacilityRepository {
  async getFacilities(): Promise<Facility[]> {
    try {
      // 실제 구현에서는 데이터베이스 쿼리로 대체
      const facilities = await db.facility.findMany({
        orderBy: { name: "asc" },
      })
      return facilities
    } catch (error) {
      console.error("Error fetching facilities:", error)
      throw new AppError("FACILITY_FETCH_ERROR", "시설 목록을 가져오는 중 오류가 발생했습니다.", 500)
    }
  }

  async getFacilityById(id: string): Promise<Facility | null> {
    try {
      // 실제 구현에서는 데이터베이스 쿼리로 대체
      const facility = await db.facility.findUnique({
        where: { id },
      })
      return facility
    } catch (error) {
      console.error(`Error fetching facility with ID ${id}:`, error)
      throw new AppError("FACILITY_FETCH_ERROR", "시설 정보를 가져오는 중 오류가 발생했습니다.", 500)
    }
  }

  async createFacility(data: CreateFacilityDTO): Promise<Facility> {
    try {
      // 실제 구현에서는 데이터베이스 쿼리로 대체
      const facility = await db.facility.create({
        data: {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
      return facility
    } catch (error) {
      console.error("Error creating facility:", error)
      throw new AppError("FACILITY_CREATE_ERROR", "시설을 생성하는 중 오류가 발생했습니다.", 500)
    }
  }

  async updateFacility(id: string, data: UpdateFacilityDTO): Promise<Facility> {
    try {
      // 시설 존재 여부 확인
      const existingFacility = await this.getFacilityById(id)
      if (!existingFacility) {
        throw new AppError("FACILITY_NOT_FOUND", "시설을 찾을 수 없습니다.", 404)
      }

      // 실제 구현에서는 데이터베이스 쿼리로 대체
      const updatedFacility = await db.facility.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
      })
      return updatedFacility
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      console.error(`Error updating facility with ID ${id}:`, error)
      throw new AppError("FACILITY_UPDATE_ERROR", "시설 정보를 업데이트하는 중 오류가 발생했습니다.", 500)
    }
  }

  async deleteFacility(id: string): Promise<boolean> {
    try {
      // 시설 존재 여부 확인
      const existingFacility = await this.getFacilityById(id)
      if (!existingFacility) {
        throw new AppError("FACILITY_NOT_FOUND", "시설을 찾을 수 없습니다.", 404)
      }

      // 실제 구현에서는 데이터베이스 쿼리로 대체
      await db.facility.delete({
        where: { id },
      })
      return true
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      console.error(`Error deleting facility with ID ${id}:`, error)
      throw new AppError("FACILITY_DELETE_ERROR", "시설을 삭제하는 중 오류가 발생했습니다.", 500)
    }
  }

  async updateCurrentUsers(id: string, count: number): Promise<Facility> {
    try {
      // 시설 존재 여부 확인
      const existingFacility = await this.getFacilityById(id)
      if (!existingFacility) {
        throw new AppError("FACILITY_NOT_FOUND", "시설을 찾을 수 없습니다.", 404)
      }

      // 수용 인원 초과 검사
      if (count > existingFacility.capacity) {
        throw new AppError("FACILITY_CAPACITY_EXCEEDED", "시설 수용 인원을 초과했습니다.", 400)
      }

      // 실제 구현에서는 데이터베이스 쿼리로 대체
      const updatedFacility = await db.facility.update({
        where: { id },
        data: {
          currentUsers: count,
          updatedAt: new Date().toISOString(),
        },
      })
      return updatedFacility
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      console.error(`Error updating current users for facility with ID ${id}:`, error)
      throw new AppError("FACILITY_UPDATE_ERROR", "시설 이용자 수를 업데이트하는 중 오류가 발생했습니다.", 500)
    }
  }
}

