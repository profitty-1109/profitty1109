"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import FacilityList from "./facility-list"
import FacilityReservationStatus from "./facility-reservation-status"
import FacilityManagementPanel from "./facility-management-panel"
import { useToast } from "@/hooks/use-toast"

// Mock data for facilities
const mockFacilities = [
  {
    id: "1",
    name: "헬스장",
    location: "커뮤니티 센터 1층",
    status: "운영 중",
    capacity: 30,
    openTime: "06:00",
    closeTime: "22:00",
    description: "최신 운동 기구를 갖춘 헬스장입니다.",
    maintenanceSchedule: "매월 첫째 주 월요일",
    lastMaintenance: "2025-03-01",
  },
  {
    id: "2",
    name: "수영장",
    location: "커뮤니티 센터 지하 1층",
    status: "운영 중",
    capacity: 20,
    openTime: "06:00",
    closeTime: "21:00",
    description: "25m 길이의 실내 수영장입니다.",
    maintenanceSchedule: "매월 둘째 주 월요일",
    lastMaintenance: "2025-03-08",
  },
  {
    id: "3",
    name: "골프연습장",
    location: "커뮤니티 센터 옥상",
    status: "점검 중",
    capacity: 10,
    openTime: "08:00",
    closeTime: "22:00",
    description: "10타석 규모의 실내 골프연습장입니다.",
    maintenanceSchedule: "매월 셋째 주 월요일",
    lastMaintenance: "2025-03-15",
  },
  {
    id: "4",
    name: "탁구장",
    location: "커뮤니티 센터 2층",
    status: "운영 중",
    capacity: 8,
    openTime: "09:00",
    closeTime: "21:00",
    description: "4개의 탁구대를 갖춘 탁구장입니다.",
    maintenanceSchedule: "매월 넷째 주 월요일",
    lastMaintenance: "2025-02-22",
  },
]

export default function FacilityManagement() {
  const [facilities, setFacilities] = useState(mockFacilities)
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("list")
  const { toast } = useToast()

  // Function to handle facility selection
  const handleSelectFacility = (facilityId: string) => {
    setSelectedFacility(facilityId)
    setActiveTab("facility-details")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>시설 관리</CardTitle>
            <CardDescription>아파트 내 모든 시설의 현황 및 관리</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            시설 추가
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">시설 목록</TabsTrigger>
              {selectedFacility && (
                <>
                  <TabsTrigger value="reservation-status">예약 현황</TabsTrigger>
                  <TabsTrigger value="management">관리</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <FacilityList facilities={facilities} onSelectFacility={handleSelectFacility} />
            </TabsContent>

            {selectedFacility && (
              <>
                <TabsContent value="reservation-status">
                  <FacilityReservationStatus facilityId={selectedFacility} />
                </TabsContent>

                <TabsContent value="management">
                  <FacilityManagementPanel
                    facilityId={selectedFacility}
                    facilities={facilities}
                    setFacilities={setFacilities}
                  />
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

