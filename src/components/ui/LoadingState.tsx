import type React from "react"
import { Spinner } from "@/components/ui/Spinner"

interface LoadingStateProps {
  isLoading: boolean
  children: React.ReactNode
  skeleton?: React.ReactNode
}

/**
 * 로딩 상태를 표시하는 컴포넌트
 */
export function LoadingState({ isLoading, children, skeleton }: LoadingStateProps) {
  if (isLoading) {
    return skeleton ? (
      <>{skeleton}</>
    ) : (
      <div className="flex justify-center items-center p-8" aria-live="polite" aria-busy="true">
        <Spinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}

