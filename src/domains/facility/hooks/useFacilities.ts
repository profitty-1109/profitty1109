import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { container } from "@/core/di/container"
import { FacilityService } from "../services/FacilityService"
import type { CreateFacilityDTO, UpdateFacilityDTO, FacilityStatus } from "../models/Facility"

// 서비스 인스턴스 가져오기
const facilityService = container.resolve(FacilityService)

/**
 * 모든 시설 목록을 조회하는 훅
 */
export function useFacilities() {
  return useQuery({
    queryKey: ["facilities"],
    queryFn: () => facilityService.getFacilities(),
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  })
}

/**
 * ID로 특정 시설을 조회하는 훅
 * @param id 시설 ID
 */
export function useFacilityById(id: string) {
  return useQuery({
    queryKey: ["facilities", id],
    queryFn: () => facilityService.getFacilityById(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  })
}

/**
 * 시설을 생성하는 훅
 */
export function useCreateFacility() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFacilityDTO) => facilityService.createFacility(data),
    onSuccess: (newFacility) => {
      // 캐시 업데이트
      queryClient.setQueryData(["facilities", newFacility.id], newFacility)
      // 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["facilities"] })
    },
  })
}

/**
 * 시설을 업데이트하는 훅
 */
export function useUpdateFacility() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFacilityDTO }) => facilityService.updateFacility(id, data),
    onSuccess: (updatedFacility) => {
      // 캐시 업데이트
      queryClient.setQueryData(["facilities", updatedFacility.id], updatedFacility)
      // 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["facilities"] })
    },
  })
}

/**
 * 시설 상태를 변경하는 훅
 */
export function useUpdateFacilityStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: FacilityStatus }) =>
      facilityService.updateFacilityStatus(id, status),
    onSuccess: (updatedFacility) => {
      // 캐시 업데이트
      queryClient.setQueryData(["facilities", updatedFacility.id], updatedFacility)
      // 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["facilities"] })
    },
  })
}

/**
 * 시설을 삭제하는 훅
 */
export function useDeleteFacility() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => facilityService.deleteFacility(id),
    onSuccess: (_, id) => {
      // 캐시에서 삭제
      queryClient.removeQueries({ queryKey: ["facilities", id] })
      // 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["facilities"] })
    },
  })
}

