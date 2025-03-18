import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
}

/**
 * 접근성이 향상된 버튼 컴포넌트
 */
export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ className, children, disabled, isLoading, loadingText, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          disabled || isLoading ? "opacity-50 cursor-not-allowed" : "",
          className,
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{loadingText || "로딩 중..."}</span>
            <span className="sr-only">로딩 중</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  },
)
AccessibleButton.displayName = "AccessibleButton"

