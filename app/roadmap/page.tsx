"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/shared/Sidebar"
import { ChatInterface } from "@/components/trip/ChatInterface"
import { RoadmapView } from "@/components/trip/RoadmapView"
import { supabase } from "@/lib/supabase"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"

export default function RoadmapPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const prompt = searchParams.get("prompt")
  // const tripId = searchParams.get("id"); // tripId is not used in current logic, but good to keep if needed later
  const [roadmapData, setRoadmapData] = useState<any>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true) // Renamed for clarity
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false) // Renamed for clarity
  const [showSplitView, setShowSplitView] = useState(false)

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

  const handleUpdateRoadmap = (data: any) => {
    setRoadmapData(data)
  }

  const handleGenerationStart = () => {
    setIsGeneratingRoadmap(true)
    // Delay showing split view for smooth transition, allow chat to initiate
    setTimeout(() => {
      setShowSplitView(true)
    }, 600) // Slightly reduced to feel more responsive
  }

  const handleGenerationComplete = () => {
    // Add a slight delay before setting isGeneratingRoadmap to false
    // to allow the roadmap data to be set and animations to kick in smoothly.
    setTimeout(() => {
      setIsGeneratingRoadmap(false)
    }, 500) // Reduced, actual data display will handle its own animation
  }

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64 pt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 pt-16">
        <div
          className={cn(
            "min-h-[calc(100vh-64px)] transition-opacity duration-700 ease-in-out", // Use opacity for main container
            showSplitView || !prompt ? "opacity-100" : "opacity-0", // Fade in when split view is ready or if no initial prompt
          )}
        >
          {!showSplitView && prompt ? ( // Only show full screen chat if there's an initial prompt and split view is not yet active
            // Full screen chat initially if there's a prompt
            <div className="h-[calc(100vh-64px)] animate-fade-in">
              <ChatInterface
                initialPrompt={prompt || undefined}
                onUpdateRoadmap={handleUpdateRoadmap}
                onGenerationStart={handleGenerationStart}
                onGenerationComplete={handleGenerationComplete}
              />
            </div>
          ) : (
            // Split view after generation starts or if no initial prompt
            <ResizablePanelGroup
              direction="horizontal"
              className={cn(
                "min-h-[calc(100vh-64px)]",
                showSplitView && "animate-fade-in", // Apply fade-in when split view becomes active
              )}
            >
              <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
                <div className="h-full border-r">
                  <ChatInterface
                    initialPrompt={showSplitView ? undefined : prompt || undefined} // Pass prompt only if not yet in split view
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
  )
}
