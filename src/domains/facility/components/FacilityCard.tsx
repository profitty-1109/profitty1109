"use client"

import { memo } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Facility, FacilityStatus } from "../models/Facility"
import { OptimizedImage } from "@/components/ui/OptimizedImage"

interface FacilityCardProps {
  facility: Facility
  onManage?: (facility: Facility) => void
  onReserve?: (facility: Facility) => void
  isAdmin?: boolean
}

/**
 * 시설 정보를 표시하는 카드 컴포넌트
 */
const FacilityCard = memo(
  ({ facility, onManage, onReserve, isAdmin = false }: FacilityCardProps) => {
    // 시설 상태에 따른 배지 색상 및 텍스트
    const getStatusBadge = (status: FacilityStatus) => {
      switch (status) {
        case "open":
          return <Badge className="bg-green-500">운영 중</Badge>
        case "closed":
          return <Badge className="bg-red-500">운영 종료</Badge>
        case "maintenance":
          return <Badge className="bg-yellow-500">점검 중</Badge>
        default:
          return <Badge>알 수 없음</Badge>
      }
    }

    return (
      <Card className="h-full" data-testid="facility-card">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold" id={`facility-name-${facility.id}`}>
              {facility.name}
            </CardTitle>
            {getStatusBadge(facility.status)}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <OptimizedImage
            src={facility.image || "/placeholder.svg"}
            alt={facility.name}
            width={400}
            height={200}
            className="w-full h-40 rounded-md mb-4"
          />
          <div className="space-y-2 text-sm">
            <p className="line-clamp-2">{facility.description}</p>
            <p>
              <span className="font-medium">위치:</span> {facility.location}
            </p>
            <p>
              <span className="font-medium">운영 시간:</span> {facility.hours}
            </p>
            <p>
              <span className="font-medium">수용 인원:</span> {facility.currentUsers}/{facility.capacity}명
            </p>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex w-full gap-2">
            {isAdmin && onManage && (
              <Button
                onClick={() => onManage(facility)}
                className="flex-1"
                data-testid="manage-button"
                aria-label={`${facility.name} 관리하기`}
              >
                관리
              </Button>
            )}
            {!isAdmin && facility.status === "open" && onReserve && (
              <Button
                onClick={() => onReserve(facility)}
                className="flex-1"
                data-testid="reserve-button"
                aria-label={`${facility.name} 예약하기`}
              >
                예약하기
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    )
  },
  (prevProps, nextProps) => {
    // 필요한 속성만 비교하여 불필요한 리렌더링 방지
    return (
      prevProps.facility.id === nextProps.facility.id &&
      prevProps.facility.name === nextProps.facility.name &&
      prevProps.facility.status === nextProps.facility.status &&
      prevProps.facility.currentUsers === nextProps.facility.currentUsers &&
      prevProps.isAdmin === nextProps.isAdmin
    )
  },
)

FacilityCard.displayName = "FacilityCard"

export default FacilityCard

