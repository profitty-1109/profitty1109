"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, type ButtonProps } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LogoutButtonProps extends ButtonProps {
  children?: React.ReactNode
}

export function LogoutButton({ children, ...props }: LogoutButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("로그아웃 중 오류가 발생했습니다.")
      }

      toast({
        title: "로그아웃 성공",
        description: "안전하게 로그아웃되었습니다.",
      })

      // 홈페이지로 이동
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "로그아웃 실패",
        description: error instanceof Error ? error.message : "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      className="justify-start text-muted-foreground"
      onClick={handleLogout}
      disabled={isLoading}
      {...props}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoading ? "로그아웃 중..." : children || "로그아웃"}
    </Button>
  )
}

