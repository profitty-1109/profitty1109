"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Facility {
  id: string
  name: string
  location: string
  status: string
  capacity: number
  openTime: string
  closeTime: string
  description: string
  maintenanceSchedule: string
  lastMaintenance: string
}

interface FacilityListProps {
  facilities: Facility[]
  onSelectFacility: (facilityId: string) => void
}

export default function FacilityList({ facilities, onSelectFacility }: FacilityListProps) {
  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>시설명</TableHead>
            <TableHead>위치</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>수용 인원</TableHead>
            <TableHead>운영 시간</TableHead>
            <TableHead>관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facilities.map((facility) => (
            <TableRow key={facility.id}>
              <TableCell className="font-medium">{facility.name}</TableCell>
              <TableCell>{facility.location}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      facility.status === "운영 중"
                        ? "bg-green-500"
                        : facility.status === "점검 중"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                  {facility.status}
                </div>
              </TableCell>
              <TableCell>{facility.capacity}명</TableCell>
              <TableCell>
                {facility.openTime} - {facility.closeTime}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onSelectFacility(facility.id)}>
                    상세 보기
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility) => (
          <Card key={facility.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{facility.name}</h3>
                  <div
                    className={`px-2 py-1 text-xs rounded-full ${
                      facility.status === "운영 중"
                        ? "bg-green-100 text-green-800"
                        : facility.status === "점검 중"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {facility.status}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{facility.location}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">운영 시간:</span>
                    <span>
                      {facility.openTime} - {facility.closeTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">수용 인원:</span>
                    <span>{facility.capacity}명</span>
                  </div>
                </div>
              </div>
              <div className="border-t p-4 bg-muted/20">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      onSelectFacility(facility.id)
                    }}
                  >
                    상세 보기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

