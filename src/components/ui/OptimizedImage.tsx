"use client"

import Image from "next/image"
import { useState } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

/**
 * 최적화된 이미지 컴포넌트
 * 로딩 상태를 표시하고, 이미지 최적화를 제공합니다.
 */
export function OptimizedImage({ src, alt, width, height, className = "", priority = false }: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        sizes={`(max-width: 768px) 100vw, ${width}px`}
        priority={priority}
        className={`object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoadingComplete={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <span className="sr-only">Loading...</span>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent text-primary"></div>
        </div>
      )}
    </div>
  )
}

