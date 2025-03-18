"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, Building, Calendar, Settings, MessageSquare, Landmark } from "lucide-react"

interface AdminNavProps {
  className?: string
}

export default function AdminNav({ className }: AdminNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: Home,
    },
    {
      title: "Residents",
      href: "/admin/residents",
      icon: Users,
    },
    {
      title: "Apartments",
      href: "/admin/apartments",
      icon: Building,
    },
    {
      title: "Facilities",
      href: "/admin/facilities",
      icon: Landmark,
    },
    {
      title: "Events",
      href: "/admin/events",
      icon: Calendar,
    },
    {
      title: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}

