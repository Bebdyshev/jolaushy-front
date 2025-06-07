"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/shared/Sidebar"
import { ChatInterface } from "@/components/trip/ChatInterface"
import { RoadmapView } from "@/components/trip/RoadmapView"
import { supabase } from "@/lib/supabase"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Navbar } from "@/components/shared/Navbar"

export default function RoadmapPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const prompt = searchParams.get("prompt")
  const [roadmapData, setRoadmapData] = useState<any>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false)
  const [showSplitView, setShowSplitView] = useState(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true) // Default to visible
  const sidebarHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/auth/login")
        return
      }
      setIsLoadingAuth(false)
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    // If not desktop, sidebar visibility is controlled by its own state via hamburger
    if (!isDesktop) {
      setIsSidebarVisible(false) // Keep it hidden by default on mobile, rely on hamburger
      return
    }
    // On desktop, auto-hide sidebar when split view (chat) becomes active
    if (showSplitView && isDesktop) {
      setIsSidebarVisible(false)
    } else if (!showSplitView && isDesktop) {
      setIsSidebarVisible(true) // Show sidebar if not in split view on desktop
    }
  }, [showSplitView, isDesktop])

  const handleUpdateRoadmap = (data: any) => {
    setRoadmapData(data)
  }

  const handleGenerationStart = () => {
    setIsGeneratingRoadmap(true)
    setTimeout(() => {
      setShowSplitView(true)
    }, 600)
  }

  const handleGenerationComplete = () => {
    setTimeout(() => {
      setIsGeneratingRoadmap(false)
    }, 500)
  }

  const handleSidebarVisibilityChange = (visible: boolean) => {
    if (isDesktop || (!isDesktop && !visible)) {
      // Allow mobile to close itself
      setIsSidebarVisible(visible)
    }
  }

  const handleMouseEnterHotspot = () => {
    if (isDesktop && showSplitView) {
      // Only trigger on desktop when chat is active
      if (sidebarHoverTimeoutRef.current) clearTimeout(sidebarHoverTimeoutRef.current)
      setIsSidebarVisible(true)
    }
  }

  const handleMouseLeaveSidebarAndHotspot = () => {
    if (isDesktop && showSplitView) {
      // Only trigger on desktop when chat is active
      sidebarHoverTimeoutRef.current = setTimeout(() => {
        setIsSidebarVisible(false)
      }, 300) // Delay before hiding
    }
  }

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen bg-background">
        {/* Pass isMobile true for initial loading state if needed, or manage separately */}
        <Sidebar
          isPageSidebarVisible={isSidebarVisible}
          onVisibilityChange={handleSidebarVisibilityChange}
          isMobile={!isDesktop}
        />
        <div
          className={cn(
            "flex-1 pt-16 flex items-center justify-center transition-all duration-300 ease-in-out",
            isSidebarVisible && isDesktop ? "md:ml-64" : "ml-0",
          )}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-background relative">
        {/* Sidebar Hotspot for hover effect on desktop when chat is active */}
        {isDesktop && showSplitView && !isSidebarVisible && (
          <div
            className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-8 z-[55] cursor-pointer" // Increased width for easier hover
            onMouseEnter={handleMouseEnterHotspot}
          >
            <div className="absolute left-1 top-1/2 -translate-y-1/2 p-1 bg-background/50 border border-border rounded-md shadow-md opacity-70 hover:opacity-100 transition-opacity">
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        )}

        <div onMouseLeave={isDesktop && showSplitView ? handleMouseLeaveSidebarAndHotspot : undefined}>
          <Sidebar
            isPageSidebarVisible={isSidebarVisible}
            onVisibilityChange={handleSidebarVisibilityChange}
            isMobile={!isDesktop}
          />
        </div>

        <div
          className={cn(
            "flex-1 pt-16 transition-all duration-300 ease-in-out",
            isSidebarVisible && isDesktop ? "md:ml-64" : "ml-0",
          )}
        >
          <div
            className={cn(
              "min-h-[calc(100vh-64px)] transition-opacity duration-700 ease-in-out",
              showSplitView || !prompt ? "opacity-100" : "opacity-0",
            )}
          >
            {!showSplitView && prompt ? (
              <div className="h-[calc(100vh-64px)] animate-fade-in">
                <ChatInterface
                  initialPrompt={prompt || undefined}
                  onUpdateRoadmap={handleUpdateRoadmap}
                  onGenerationStart={handleGenerationStart}
                  onGenerationComplete={handleGenerationComplete}
                />
              </div>
            ) : (
              <ResizablePanelGroup
                direction="horizontal"
                className={cn("min-h-[calc(100vh-64px)]", showSplitView && "animate-fade-in")}
              >
                <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
                  <div className="h-full border-r">
                    <ChatInterface
                      initialPrompt={showSplitView ? undefined : prompt || undefined}
                      onUpdateRoadmap={handleUpdateRoadmap}
                      onGenerationStart={handleGenerationStart}
                      onGenerationComplete={handleGenerationComplete}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors duration-200" />
                <ResizablePanel defaultSize={65}>
                  <div className="h-full p-4 bg-gradient-to-br from-background to-secondary/10">
                    <RoadmapView data={roadmapData} isGenerating={isGeneratingRoadmap} />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
