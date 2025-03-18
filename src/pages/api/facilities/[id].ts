import type { NextApiRequest, NextApiResponse } from "next"
import { container } from "@/core/di/container"
import { FacilityService } from "@/domains/facility/services/FacilityService"
import { errorHandler } from "@/core/api/errorHandler"
import { withPermission } from "@/core/api/withPermission"
import { Permission } from "@/core/auth/permissions"
import type { UpdateFacilityDTO, FacilityStatus } from "@/domains/facility/models/Facility"
import { z } from "zod"
import { AppError } from "@/core/errors/AppError"

// 시설 업데이트 스키마
const updateFacilitySchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().min(10).max(500).optional(),
  image: z.string().url().optional(),
  hours: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["open", "closed", "maintenance"]).optional(),
  capacity: z.number().int().min(1).max(1000).optional(),
  currentUsers: z.number().int().min(0).optional(),
})

// 시설 상태 업데이트 스키마
const updateStatusSchema = z.object({
  status: z.enum(["open", "closed", "maintenance"]),
})

/**
 * 특정 시설 API 핸들러
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query

    if (!id || Array.isArray(id)) {
      throw AppError.badRequest("유효한 시설 ID가 필요합니다.")
    }

    const facilityService = container.resolve(FacilityService)

    // GET 요청 처리 (특정 시설 조회)
    if (req.method === "GET") {
      const facility = await facilityService.getFacilityById(id)
      return res.status(200).json(facility)
    }

    // PUT 요청 처리 (시설 업데이트)
    if (req.method === "PUT") {
      // 입력 검증
      const validationResult = updateFacilitySchema.safeParse(req.body)
      if (!validationResult.success) {
        throw AppError.badRequest("입력 데이터가 유효하지 않습니다.", "VALIDATION_ERROR", validationResult.error)
      }

      const facilityData = validationResult.data as UpdateFacilityDTO
      const updatedFacility = await facilityService.updateFacility(id, facilityData)
      return res.status(200).json(updatedFacility)
    }

    // PATCH 요청 처리 (시설 상태 업데이트)
    if (req.method === "PATCH") {
      // 입력 검증
      const validationResult = updateStatusSchema.safeParse(req.body)
      if (!validationResult.success) {
        throw AppError.badRequest("입력 데이터가 유효하지 않습니다.", "VALIDATION_ERROR", validationResult.error)
      }

      const { status } = validationResult.data
      const updatedFacility = await facilityService.updateFacilityStatus(id, status as FacilityStatus)
      return res.status(200).json(updatedFacility)
    }

    // DELETE 요청 처리 (시설 삭제)
    if (req.method === "DELETE") {
      await facilityService.deleteFacility(id)
      return res.status(204).end()
    }

    // 지원하지 않는 메서드
    res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"])
    return res.status(405).json({ error: { code: "METHOD_NOT_ALLOWED", message: "지원하지 않는 메서드입니다." } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

// GET 요청은 시설 조회 권한 필요
// 나머지 요청은 시설 관리 권한 필요
export default function facilityHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return withPermission(Permission.READ_FACILITY)(handler)(req, res)
  }
  return withPermission(Permission.MANAGE_FACILITY)(handler)(req, res)
}

