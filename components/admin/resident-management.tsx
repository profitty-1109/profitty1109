"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

// 입주민 타입 정의
interface Resident {
  id: string
  name: string
  unit: string
  phone: string
  email: string
  moveInDate: string
  status: "거주중" | "퇴거예정" | "퇴거완료"
  familyMembers: number
  parkingSpots: number
}

// 목업 데이터
const mockResidents: Resident[] = [
  {
    id: "1",
    name: "김철수",
    unit: "101동 1201호",
    phone: "010-1234-5678",
    email: "kim@example.com",
    moveInDate: "2023-01-15",
    status: "거주중",
    familyMembers: 3,
    parkingSpots: 1,
  },
  {
    id: "2",
    name: "이영희",
    unit: "102동 302호",
    phone: "010-2345-6789",
    email: "lee@example.com",
    moveInDate: "2022-08-20",
    status: "거주중",
    familyMembers: 2,
    parkingSpots: 1,
  },
  {
    id: "3",
    name: "박지민",
    unit: "103동 1503호",
    phone: "010-3456-7890",
    email: "park@example.com",
    moveInDate: "2023-05-10",
    status: "거주중",
    familyMembers: 4,
    parkingSpots: 2,
  },
  {
    id: "4",
    name: "최민수",
    unit: "101동 502호",
    phone: "010-4567-8901",
    email: "choi@example.com",
    moveInDate: "2022-11-05",
    status: "퇴거예정",
    familyMembers: 1,
    parkingSpots: 1,
  },
  {
    id: "5",
    name: "정다운",
    unit: "104동 1801호",
    phone: "010-5678-9012",
    email: "jung@example.com",
    moveInDate: "2023-03-22",
    status: "거주중",
    familyMembers: 5,
    parkingSpots: 2,
  },
]

export default function ResidentManagement() {
  const [residents, setResidents] = useState<Resident[]>(mockResidents)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  const [newResident, setNewResident] = useState<Omit<Resident, "id">>({
    name: "",
    unit: "",
    phone: "",
    email: "",
    moveInDate: new Date().toISOString().split("T")[0],
    status: "거주중",
    familyMembers: 1,
    parkingSpots: 1,
  })
  const { toast } = useToast()

  // 검색 기능
  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.includes(searchTerm) ||
      resident.unit.includes(searchTerm) ||
      resident.phone.includes(searchTerm) ||
      resident.email.includes(searchTerm),
  )

  // 입주민 추가
  const handleAddResident = () => {
    const id = (residents.length + 1).toString()
    const residentToAdd = { id, ...newResident }
    setResidents([...residents, residentToAdd])
    setIsAddDialogOpen(false)
    setNewResident({
      name: "",
      unit: "",
      phone: "",
      email: "",
      moveInDate: new Date().toISOString().split("T")[0],
      status: "거주중",
      familyMembers: 1,
      parkingSpots: 1,
    })
    toast({
      title: "입주민 추가 완료",
      description: `${residentToAdd.name}님이 추가되었습니다.`,
    })
  }

  // 입주민 수정
  const handleEditResident = () => {
    if (!selectedResident) return

    const updatedResidents = residents.map((resident) =>
      resident.id === selectedResident.id ? selectedResident : resident,
    )

    setResidents(updatedResidents)
    setIsEditDialogOpen(false)
    setSelectedResident(null)

    toast({
      title: "입주민 정보 수정 완료",
      description: `${selectedResident.name}님의 정보가 수정되었습니다.`,
    })
  }

  // 입주민 삭제
  const handleDeleteResident = (id: string) => {
    const residentToDelete = residents.find((resident) => resident.id === id)
    if (!residentToDelete) return

    const updatedResidents = residents.filter((resident) => resident.id !== id)
    setResidents(updatedResidents)

    toast({
      title: "입주민 삭제 완료",
      description: `${residentToDelete.name}님이 삭제되었습니다.`,
      variant: "destructive",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>입주민 관리</CardTitle>
            <CardDescription>아파트 입주민 정보 관리 및 조회</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                입주민 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>새 입주민 추가</DialogTitle>
                <DialogDescription>새로운 입주민의 정보를 입력해주세요.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    이름
                  </Label>
                  <Input
                    id="name"
                    value={newResident.name}
                    onChange={(e) => setNewResident({ ...newResident, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit" className="text-right">
                    호수
                  </Label>
                  <Input
                    id="unit"
                    value={newResident.unit}
                    onChange={(e) => setNewResident({ ...newResident, unit: e.target.value })}
                    className="col-span-3"
                    placeholder="예: 101동 1201호"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    연락처
                  </Label>
                  <Input
                    id="phone"
                    value={newResident.phone}
                    onChange={(e) => setNewResident({ ...newResident, phone: e.target.value })}
                    className="col-span-3"
                    placeholder="예: 010-1234-5678"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newResident.email}
                    onChange={(e) => setNewResident({ ...newResident, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="moveInDate" className="text-right">
                    입주일
                  </Label>
                  <Input
                    id="moveInDate"
                    type="date"
                    value={newResident.moveInDate}
                    onChange={(e) => setNewResident({ ...newResident, moveInDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    상태
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setNewResident({ ...newResident, status: value as "거주중" | "퇴거예정" | "퇴거완료" })
                    }
                    defaultValue={newResident.status}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="거주중">거주중</SelectItem>
                      <SelectItem value="퇴거예정">퇴거예정</SelectItem>
                      <SelectItem value="퇴거완료">퇴거완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="familyMembers" className="text-right">
                    가족 구성원
                  </Label>
                  <Input
                    id="familyMembers"
                    type="number"
                    min="1"
                    value={newResident.familyMembers}
                    onChange={(e) => setNewResident({ ...newResident, familyMembers: Number.parseInt(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="parkingSpots" className="text-right">
                    주차 공간
                  </Label>
                  <Input
                    id="parkingSpots"
                    type="number"
                    min="0"
                    value={newResident.parkingSpots}
                    onChange={(e) => setNewResident({ ...newResident, parkingSpots: Number.parseInt(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddResident}>
                  추가하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="이름, 호수, 연락처로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>호수</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>입주일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>가족 구성원</TableHead>
                <TableHead>주차 공간</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredResidents.map((resident) => (
                  <TableRow key={resident.id}>
                    <TableCell className="font-medium">{resident.name}</TableCell>
                    <TableCell>{resident.unit}</TableCell>
                    <TableCell>{resident.phone}</TableCell>
                    <TableCell>{resident.moveInDate}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          resident.status === "거주중"
                            ? "bg-green-100 text-green-800"
                            : resident.status === "퇴거예정"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {resident.status}
                      </span>
                    </TableCell>
                    <TableCell>{resident.familyMembers}명</TableCell>
                    <TableCell>{resident.parkingSpots}대</TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={isEditDialogOpen && selectedResident?.id === resident.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open)
                          if (!open) setSelectedResident(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedResident(resident)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">수정</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>입주민 정보 수정</DialogTitle>
                            <DialogDescription>입주민의 정보를 수정해주세요.</DialogDescription>
                          </DialogHeader>
                          {selectedResident && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  이름
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={selectedResident.name}
                                  onChange={(e) => setSelectedResident({ ...selectedResident, name: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-unit" className="text-right">
                                  호수
                                </Label>
                                <Input
                                  id="edit-unit"
                                  value={selectedResident.unit}
                                  onChange={(e) => setSelectedResident({ ...selectedResident, unit: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-phone" className="text-right">
                                  연락처
                                </Label>
                                <Input
                                  id="edit-phone"
                                  value={selectedResident.phone}
                                  onChange={(e) => setSelectedResident({ ...selectedResident, phone: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-email" className="text-right">
                                  이메일
                                </Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  value={selectedResident.email}
                                  onChange={(e) => setSelectedResident({ ...selectedResident, email: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-moveInDate" className="text-right">
                                  입주일
                                </Label>
                                <Input
                                  id="edit-moveInDate"
                                  type="date"
                                  value={selectedResident.moveInDate}
                                  onChange={(e) =>
                                    setSelectedResident({ ...selectedResident, moveInDate: e.target.value })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-status" className="text-right">
                                  상태
                                </Label>
                                <Select
                                  onValueChange={(value) =>
                                    setSelectedResident({
                                      ...selectedResident,
                                      status: value as "거주중" | "퇴거예정" | "퇴거완료",
                                    })
                                  }
                                  defaultValue={selectedResident.status}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="상태 선택" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="거주중">거주중</SelectItem>
                                    <SelectItem value="퇴거예정">퇴거예정</SelectItem>
                                    <SelectItem value="퇴거완료">퇴거완료</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-familyMembers" className="text-right">
                                  가족 구성원
                                </Label>
                                <Input
                                  id="edit-familyMembers"
                                  type="number"
                                  min="1"
                                  value={selectedResident.familyMembers}
                                  onChange={(e) =>
                                    setSelectedResident({
                                      ...selectedResident,
                                      familyMembers: Number.parseInt(e.target.value),
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-parkingSpots" className="text-right">
                                  주차 공간
                                </Label>
                                <Input
                                  id="edit-parkingSpots"
                                  type="number"
                                  min="0"
                                  value={selectedResident.parkingSpots}
                                  onChange={(e) =>
                                    setSelectedResident({
                                      ...selectedResident,
                                      parkingSpots: Number.parseInt(e.target.value),
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button type="submit" onClick={handleEditResident}>
                              저장하기
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteResident(resident.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">삭제</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">총 {filteredResidents.length}명의 입주민</div>
      </CardFooter>
    </Card>
  )
}

