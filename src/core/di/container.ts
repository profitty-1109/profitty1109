import { container } from "tsyringe"
import type { FacilityRepository } from "@/domains/facility/repositories/FacilityRepository"
import { FacilityRepositoryImpl } from "@/domains/facility/repositories/FacilityRepositoryImpl"
import { FacilityService } from "@/domains/facility/services/FacilityService"

/**
 * 의존성 주입 컨테이너 설정
 */
// 리포지토리 등록
container.register<FacilityRepository>("FacilityRepository", { useClass: FacilityRepositoryImpl })

// 서비스 등록
container.register<FacilityService>(FacilityService, {
  useClass: FacilityService,
})

// 다른 의존성들도 여기에 등록

export { container }

