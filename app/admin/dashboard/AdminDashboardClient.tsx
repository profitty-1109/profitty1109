"use client"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import FacilityManagement from "@/components/admin/facility-management"
// 필요한 컴포넌트 import 추가
import ResidentManagement from "@/components/admin/resident-management"
import NoticeManagement from "@/components/admin/notice-management"
import DocumentManagement from "@/components/admin/document-management"

export default function AdminDashboardClient() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex flex-col w-64 border-r px-4 py-6">
        <MainNav userRole="admin" />
      </div>
      <div className="flex-1">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 md:px-6">
            <div className="md:hidden mr-4">
              <Button variant="ghost" size="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <UserNav userName="관리자" userEmail="admin@example.com" userRole="admin" />
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">관리자 대시보드</h1>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="activity">최근 활동</TabsTrigger>
              <TabsTrigger value="facilities">시설 관리</TabsTrigger>
              <TabsTrigger value="residents">입주민 관리</TabsTrigger>
              <TabsTrigger value="notices">공지사항</TabsTrigger>
              <TabsTrigger value="documents">전자 문서</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Overview />
            </TabsContent>
            <TabsContent value="activity" className="space-y-4">
              <RecentActivity />
            </TabsContent>
            <TabsContent value="facilities" className="space-y-4">
              <FacilityManagement />
            </TabsContent>
            <TabsContent value="residents" className="space-y-4">
              <ResidentManagement />
            </TabsContent>
            <TabsContent value="notices" className="space-y-4">
              <NoticeManagement />
            </TabsContent>
            <TabsContent value="documents" className="space-y-4">
              <DocumentManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

