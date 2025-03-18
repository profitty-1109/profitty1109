"use client"

import type { AppProps } from "next/app"
import { useState } from "react"
import { QueryClient, QueryClientProvider, Hydrate } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "@/app/globals.css"

/**
 * 애플리케이션 루트 컴포넌트
 */
export default function MyApp({ Component, pageProps }: AppProps) {
  // 클라이언트 사이드에서 QueryClient 인스턴스 생성
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Component {...pageProps} />
          <Toaster />
        </ThemeProvider>
      </Hydrate>
      {process.env.NODE_ENV !== "production" && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}

