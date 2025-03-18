"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  FileText,
  MoreVertical,
  Download,
  Trash2,
  Edit,
  Plus,
  Search,
  Upload,
  File,
  FileArchive,
  FileIcon as FilePdf,
  FileImage,
  FileSpreadsheet,
  FileCode,
} from "lucide-react"

// 문서 타입 정의
type Document = {
  id: string
  title: string
  category: string
  uploadDate: string
  fileType: string
  fileSize: string
  uploadedBy: string
  description: string
  downloadUrl: string
}

// 문서 카테고리 정의
const documentCategories = ["계약서", "공문", "회의록", "재무 문서", "법률 문서", "매뉴얼", "기타"]

// 파일 타입에 따른 아이콘 반환 함수
const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return <FilePdf className="h-5 w-5 text-red-500" />
    case "doc":
    case "docx":
      return <FileText className="h-5 w-5 text-blue-500" />
    case "xls":
    case "xlsx":
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    case "jpg":
    case "jpeg":
    case "png":
      return <FileImage className="h-5 w-5 text-purple-500" />
    case "zip":
    case "rar":
      return <FileArchive className="h-5 w-5 text-yellow-500" />
    case "html":
    case "css":
    case "js":
      return <FileCode className="h-5 w-5 text-orange-500" />
    default:
      return <File className="h-5 w-5 text-gray-500" />
  }
}

// 파일 크기 포맷팅 함수
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
  else return (bytes / 1073741824).toFixed(1) + " GB"
}

// 샘플 문서 데이터
const sampleDocuments: Document[] = [
  {
    id: "1",
    title: "입주 계약서 템플릿",
    category: "계약서",
    uploadDate: "2023-12-01",
    fileType: "pdf",
    fileSize: "2.5 MB",
    uploadedBy: "관리자",
    description: "신규 입주민을 위한 표준 입주 계약서 템플릿입니다.",
    downloadUrl: "#",
  },
  {
    id: "2",
    title: "주민 총회 회의록",
    category: "회의록",
    uploadDate: "2023-11-15",
    fileType: "docx",
    fileSize: "1.2 MB",
    uploadedBy: "관리자",
    description: "2023년 11월 주민 총회 회의록입니다.",
    downloadUrl: "#",
  },
  {
    id: "3",
    title: "시설 이용 안내서",
    category: "매뉴얼",
    uploadDate: "2023-10-20",
    fileType: "pdf",
    fileSize: "3.7 MB",
    uploadedBy: "관리자",
    description: "아파트 내 시설 이용에 관한 안내서입니다.",
    downloadUrl: "#",
  },
  {
    id: "4",
    title: "2023년 3분기 재무 보고서",
    category: "재무 문서",
    uploadDate: "2023-10-05",
    fileType: "xlsx",
    fileSize: "1.8 MB",
    uploadedBy: "관리자",
    description: "2023년 3분기 아파트 관리비 및 재무 현황 보고서입니다.",
    downloadUrl: "#",
  },
  {
    id: "5",
    title: "외부 공사 관련 공문",
    category: "공문",
    uploadDate: "2023-09-28",
    fileType: "pdf",
    fileSize: "0.9 MB",
    uploadedBy: "관리자",
    description: "아파트 외벽 도색 공사 관련 공문입니다.",
    downloadUrl: "#",
  },
  {
    id: "6",
    title: "주차장 이용 규정",
    category: "법률 문서",
    uploadDate: "2023-09-15",
    fileType: "pdf",
    fileSize: "1.1 MB",
    uploadedBy: "관리자",
    description: "아파트 주차장 이용에 관한 규정 문서입니다.",
    downloadUrl: "#",
  },
  {
    id: "7",
    title: "관리비 고지서 양식",
    category: "기타",
    uploadDate: "2023-08-20",
    fileType: "xlsx",
    fileSize: "0.7 MB",
    uploadedBy: "관리자",
    description: "월별 관리비 고지서 양식입니다.",
    downloadUrl: "#",
  },
]

export default function DocumentManagement() {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // 새 문서 상태
  const [newDocument, setNewDocument] = useState<
    Omit<Document, "id" | "uploadDate" | "fileSize" | "uploadedBy" | "downloadUrl">
  >({
    title: "",
    category: "기타",
    fileType: "",
    description: "",
  })

  // 문서 필터링 함수
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // 문서 추가 함수
  const handleAddDocument = () => {
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (!newDocument.title.trim()) {
      toast({
        title: "오류",
        description: "문서 제목을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      toast({
        title: "오류",
        description: "파일을 업로드해주세요.",
        variant: "destructive",
      })
      return
    }

    const file = fileInput.files[0]
    const fileExtension = file.name.split(".").pop() || ""
    const fileSize = formatFileSize(file.size)

    const newDoc: Document = {
      id: (documents.length + 1).toString(),
      title: newDocument.title,
      category: newDocument.category,
      uploadDate: new Date().toISOString().split("T")[0],
      fileType: fileExtension,
      fileSize: fileSize,
      uploadedBy: "관리자",
      description: newDocument.description,
      downloadUrl: "#",
    }

    setDocuments([...documents, newDoc])
    setNewDocument({
      title: "",
      category: "기타",
      fileType: "",
      description: "",
    })
    setIsAddDialogOpen(false)

    toast({
      title: "문서 추가 완료",
      description: "새 문서가 성공적으로 추가되었습니다.",
    })
  }

  // 문서 수정 함수
  const handleEditDocument = () => {
    if (!selectedDocument) return

    const updatedDocuments = documents.map((doc) => (doc.id === selectedDocument.id ? selectedDocument : doc))

    setDocuments(updatedDocuments)
    setIsEditDialogOpen(false)

    toast({
      title: "문서 수정 완료",
      description: "문서가 성공적으로 수정되었습니다.",
    })
  }

  // 문서 삭제 함수
  const handleDeleteDocument = () => {
    if (!selectedDocument) return

    const updatedDocuments = documents.filter((doc) => doc.id !== selectedDocument.id)
    setDocuments(updatedDocuments)
    setIsDeleteDialogOpen(false)

    toast({
      title: "문서 삭제 완료",
      description: "문서가 성공적으로 삭제되었습니다.",
    })
  }

  // 문서 다운로드 함수
  const handleDownloadDocument = (document: Document) => {
    toast({
      title: "다운로드 시작",
      description: `${document.title} 파일 다운로드가 시작되었습니다.`,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>전자 문서 관리</CardTitle>
          <CardDescription>아파트 관련 전자 문서를 관리하고 공유할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">전체 문서</TabsTrigger>
                <TabsTrigger value="contracts">계약서</TabsTrigger>
                <TabsTrigger value="reports">보고서</TabsTrigger>
                <TabsTrigger value="manuals">매뉴얼</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  문서 추가
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="문서 검색..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 카테고리</SelectItem>
                  {documentCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">유형</TableHead>
                      <TableHead>제목</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>업로드 날짜</TableHead>
                      <TableHead>크기</TableHead>
                      <TableHead className="text-right">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{getFileIcon(doc.fileType)}</TableCell>
                          <TableCell className="font-medium">
                            <button
                              className="hover:underline text-left"
                              onClick={() => {
                                setSelectedDocument(doc)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              {doc.title}
                            </button>
                          </TableCell>
                          <TableCell>{doc.category}</TableCell>
                          <TableCell>{doc.uploadDate}</TableCell>
                          <TableCell>{doc.fileSize}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDocument(doc)
                                    setIsViewDialogOpen(true)
                                  }}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  상세 보기
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownloadDocument(doc)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  다운로드
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDocument(doc)
                                    setIsEditDialogOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  수정
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDocument(doc)
                                    setIsDeleteDialogOpen(true)
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  삭제
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="contracts" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">유형</TableHead>
                      <TableHead>제목</TableHead>
                      <TableHead>업로드 날짜</TableHead>
                      <TableHead>크기</TableHead>
                      <TableHead className="text-right">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents
                      .filter((doc) => doc.category === "계약서")
                      .map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{getFileIcon(doc.fileType)}</TableCell>
                          <TableCell className="font-medium">
                            <button
                              className="hover:underline text-left"
                              onClick={() => {
                                setSelectedDocument(doc)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              {doc.title}
                            </button>
                          </TableCell>
                          <TableCell>{doc.uploadDate}</TableCell>
                          <TableCell>{doc.fileSize}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDownloadDocument(doc)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">유형</TableHead>
                      <TableHead>제목</TableHead>
                      <TableHead>업로드 날짜</TableHead>
                      <TableHead>크기</TableHead>
                      <TableHead className="text-right">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents
                      .filter((doc) => doc.category === "재무 문서" || doc.category === "회의록")
                      .map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{getFileIcon(doc.fileType)}</TableCell>
                          <TableCell className="font-medium">
                            <button
                              className="hover:underline text-left"
                              onClick={() => {
                                setSelectedDocument(doc)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              {doc.title}
                            </button>
                          </TableCell>
                          <TableCell>{doc.uploadDate}</TableCell>
                          <TableCell>{doc.fileSize}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDownloadDocument(doc)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="manuals" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">유형</TableHead>
                      <TableHead>제목</TableHead>
                      <TableHead>업로드 날짜</TableHead>
                      <TableHead>크기</TableHead>
                      <TableHead className="text-right">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents
                      .filter((doc) => doc.category === "매뉴얼")
                      .map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{getFileIcon(doc.fileType)}</TableCell>
                          <TableCell className="font-medium">
                            <button
                              className="hover:underline text-left"
                              onClick={() => {
                                setSelectedDocument(doc)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              {doc.title}
                            </button>
                          </TableCell>
                          <TableCell>{doc.uploadDate}</TableCell>
                          <TableCell>{doc.fileSize}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDownloadDocument(doc)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 문서 추가 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>새 문서 추가</DialogTitle>
            <DialogDescription>새로운 전자 문서를 업로드하고 관리할 수 있습니다.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                제목
              </Label>
              <Input
                id="title"
                value={newDocument.title}
                onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                카테고리
              </Label>
              <Select
                value={newDocument.category}
                onValueChange={(value) => setNewDocument({ ...newDocument, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file-upload" className="text-right">
                파일
              </Label>
              <div className="col-span-3">
                <Input id="file-upload" type="file" className="col-span-3" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                설명
              </Label>
              <Textarea
                id="description"
                value={newDocument.description}
                onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddDocument}>
              <Upload className="h-4 w-4 mr-2" />
              업로드
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 문서 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>문서 수정</DialogTitle>
            <DialogDescription>문서 정보를 수정할 수 있습니다.</DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  제목
                </Label>
                <Input
                  id="edit-title"
                  value={selectedDocument.title}
                  onChange={(e) => setSelectedDocument({ ...selectedDocument, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  카테고리
                </Label>
                <Select
                  value={selectedDocument.category}
                  onValueChange={(value) => setSelectedDocument({ ...selectedDocument, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-description" className="text-right pt-2">
                  설명
                </Label>
                <Textarea
                  id="edit-description"
                  value={selectedDocument.description}
                  onChange={(e) => setSelectedDocument({ ...selectedDocument, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEditDocument}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 문서 상세 보기 다이얼로그 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>문서 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
                {getFileIcon(selectedDocument.fileType)}
                <span className="ml-2 text-sm text-gray-500">{selectedDocument.fileType.toUpperCase()} 파일</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">제목</h4>
                  <p>{selectedDocument.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">카테고리</h4>
                  <p>{selectedDocument.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">파일 크기</h4>
                  <p>{selectedDocument.fileSize}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">업로드 날짜</h4>
                  <p>{selectedDocument.uploadDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">업로드한 사람</h4>
                  <p>{selectedDocument.uploadedBy}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">설명</h4>
                <p className="text-sm">{selectedDocument.description}</p>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  닫기
                </Button>
                <Button onClick={() => handleDownloadDocument(selectedDocument)}>
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 문서 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>문서 삭제</DialogTitle>
            <DialogDescription>이 문서를 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteDocument}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

