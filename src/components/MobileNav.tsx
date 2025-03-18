"use client"

import type React from "react"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface MobileNavProps {
  links: {
    href: string
    label: string
    icon?: React.ReactNode
  }[]
}

/**
 * 모바일 네비게이션 컴포넌트
 */
export function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          id="mobile-menu"
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-3/4 bg-background p-6 shadow-lg transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
          aria-hidden={!isOpen}
        >
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">메뉴</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="메뉴 닫기">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex flex-col space-y-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-2 py-1 rounded-md hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon && <span className="mr-2">{link.icon}</span>}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

