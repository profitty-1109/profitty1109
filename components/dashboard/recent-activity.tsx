"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: "김철수",
      userInitials: "김",
      action: "헬스장 예약",
      time: "10분 전",
    },
    {
      id: 2,
      user: "이영희",
      userInitials: "이",
      action: "수영장 예약 취소",
      time: "25분 전",
    },
    {
      id: 3,
      user: "박지민",
      userInitials: "박",
      action: "민원 등록",
      time: "1시간 전",
    },
    {
      id: 4,
      user: "최민수",
      userInitials: "최",
      action: "공지사항 확인",
      time: "2시간 전",
    },
    {
      id: 5,
      user: "정수진",
      userInitials: "정",
      action: "골프연습장 예약",
      time: "3시간 전",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
        <CardDescription>최근 입주민 및 관리자 활동 내역</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <Avatar className="h-9 w-9 mr-3">
                <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={activity.user} />
                <AvatarFallback>{activity.userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.user}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
              </div>
              <div className="text-sm text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

