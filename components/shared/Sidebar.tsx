"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, LayoutDashboard, Map, User, LogOut, Menu, X, ChevronLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface SidebarProps {
  isPageSidebarVisible?: boolean // Controlled from parent
  onVisibilityChange?: (isVisible: boolean) => void // To notify parent
  isMobile?: boolean // To distinguish mobile toggle from desktop hover
}

export function Sidebar({ isPageSidebarVisible, onVisibilityChange, isMobile: isMobileProp }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  // Internal open state for mobile, controlled by parent for desktop
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileSidebar = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    onVisibilityChange?.(!isMobileMenuOpen) // Notify parent if mobile toggles
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const navigationItems = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/roadmap",
      label: "Roadmap",
      icon: <Map className="h-5 w-5" />,
    },
    {
      href: "/account",
      label: "Account",
      icon: <User className="h-5 w-5" />,
    },
  ]

  // Effect to close mobile menu if parent hides sidebar (e.g. on route change)
  useEffect(() => {
    if (isMobileProp && !isPageSidebarVisible) {
      setIsMobileMenuOpen(false)
    }
  }, [isPageSidebarVisible, isMobileProp])

  return (
    <>
      {/* Mobile menu button */}
      {isMobileProp && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-[60] md:hidden"
          onClick={toggleMobileSidebar}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-16 bottom-0 left-0 z-40 w-64 bg-background border-r transition-transform duration-300 ease-in-out",
          isMobileProp
            ? (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")
            : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">Marco</span>
            </Link>
            {!isMobileProp &&
              onVisibilityChange && ( // Show hide button only on desktop
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onVisibilityChange?.(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobileProp) toggleMobileSidebar()
                }}
              >
                <Button variant={pathname === item.href ? "secondary" : "ghost"} className="w-full justify-start">
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive-foreground hover:bg-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
