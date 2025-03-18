"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Building, Calendar, Dumbbell, FileText, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react"
import Image from "next/image"
import { LogoutButton } from "@/components/logout-button"

interface MainNavProps {
  userRole: "resident" | "trainer" | "admin"
}

export function MainNav({ userRole }: MainNavProps) {
  const pathname = usePathname()

  const residentLinks = [
    {
      href: "/resident/dashboard",
      label: "대시보드",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/resident/dashboard",
    },
    {
      href: "/resident/facilities",
      label: "시설 예약",
      icon: <Building className="mr-2 h-4 w-4" />,
      active: pathname === "/resident/facilities",
    },
    {
      href: "/resident/lessons",
      label: "레슨 예약",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      active: pathname === "/resident/lessons",
    },
    {
      href: "/resident/exercise-log",
      label: "운동 일지",
      icon: <Dumbbell className="mr-2 h-4 w-4" />,
      active: pathname === "/resident/exercise-log",
    },
    {
      href: "/resident/community",
      label: "커뮤니티",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
      active: pathname === "/resident/community",
    },
    {
      href: "/resident/notices",
      label: "공지사항",
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname === "/resident/notices",
    },
  ]

  const trainerLinks = [
    {
      href: "/trainer/dashboard",
      label: "대시보드",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/trainer/dashboard",
    },
    {
      href: "/trainer/members",
      label: "회원 관리",
      icon: <Users className="mr-2 h-4 w-4" />,
      active: pathname === "/trainer/members",
    },
    {
      href: "/trainer/routines",
      label: "운동 루틴",
      icon: <Dumbbell className="mr-2 h-4 w-4" />,
      active: pathname === "/trainer/routines",
    },
    {
      href: "/trainer/lessons",
      label: "레슨 관리",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      active: pathname === "/trainer/lessons",
    },
    {
      href: "/trainer/statistics",
      label: "통계 및 분석",
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname === "/trainer/statistics",
    },
  ]

  const adminLinks = [
    {
      href: "/admin/dashboard",
      label: "대시보드",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/facilities",
      label: "시설 관리",
      icon: <Building className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/facilities",
    },
    {
      href: "/admin/surveys",
      label: "수요 조사",
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/surveys",
    },
    {
      href: "/admin/documents",
      label: "전자 문서",
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/documents",
    },
    {
      href: "/admin/notices",
      label: "공지사항",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/notices",
    },
  ]

  const links = userRole === "resident" ? residentLinks : userRole === "trainer" ? trainerLinks : adminLinks

  return (
    <nav className="flex flex-col gap-1 w-full">
      <Link href="/" className="flex items-center mb-4">
        <div className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lyTW3wLdZpCvqsXZM5Kdabm0YK3OPB.png"
            alt="천안 불당호반써밋플레이스센터시티 로고"
            width={120}
            height={30}
            className="mr-2"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg">커뮤니티 앱</span>
            <span className="text-xs text-muted-foreground">by 프로피티</span>
          </div>
        </div>
      </Link>

      {links.map((link) => (
        <Button
          key={link.href}
          variant={link.active ? "secondary" : "ghost"}
          className={cn("justify-start", link.active ? "bg-secondary" : "")}
          asChild
        >
          <Link href={link.href}>
            {link.icon}
            {link.label}
          </Link>
        </Button>
      ))}

      <div className="mt-auto pt-4 flex flex-col gap-1">
        <Button variant="ghost" className="justify-start" asChild>
          <Link href={`/${userRole}/settings`}>
            <Settings className="mr-2 h-4 w-4" />
            설정
          </Link>
        </Button>
        <LogoutButton>로그아웃</LogoutButton>
      </div>
    </nav>
  )
}

