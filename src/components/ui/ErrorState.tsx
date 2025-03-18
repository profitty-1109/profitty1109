"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  error: Error | null
  onRetry?: () => void
}

/**
 * 에러 상태를 표시하는 컴포넌트
 */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  if (!error) return null

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center" role="alert" aria-live="assertive">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" aria-hidden="true" />
      <h3 className="text-lg font-semibold mb-2">문제가 발생했습니다</h3>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      {onRetry && <Button onClick={onRetry}>다시 시도</Button>}
    </div>
  )
}

