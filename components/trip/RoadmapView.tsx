"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapIcon,
  List,
  Star,
  Navigation,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Activity = {
  title: string
  time: string
  location: string
  description?: string
  coordinates: [number, number]
}

type Day = {
  day: number
  date: string
  summary: string
  activities: Activity[]
}

type RoadmapData = {
  title: string
  description?: string
  days: Day[]
  map: {
    center: [number, number]
    zoom: number
  }
}

interface RoadmapViewProps {
  data?: RoadmapData | null // Allow null for initial state
  isGenerating?: boolean
}

export function RoadmapView({ data, isGenerating = false }: RoadmapViewProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState<string>("itinerary")
  const [animationStep, setAnimationStep] = useState(0)
  const [showContent, setShowContent] = useState(false)

  const prevIsGeneratingRef = useRef<boolean>()

  const roadmapData = data || {
    // Fallback for when data is null or undefined
    title: "Your Trip Itinerary",
    description: "Your personalized travel plan will appear here.",
    days: [],
    map: {
      center: [0, 0],
      zoom: 2,
    },
  }

  const toggleDayExpansion = (dayNumber: number) => {
    setExpandedDays((prevExpanded) =>
      prevExpanded.includes(dayNumber) ? prevExpanded.filter((day) => day !== dayNumber) : [...prevExpanded, dayNumber],
    )
  }

  useEffect(() => {
    // Auto-expand the first day when data is available and no days are expanded
    if (data?.days && data.days.length > 0 && expandedDays.length === 0) {
      setExpandedDays([data.days[0].day])
    }
  }, [data, expandedDays.length]) // Added expandedDays.length to dependencies

  useEffect(() => {
    if (isGenerating) {
      setShowContent(false) // Hide content when generation starts
      const interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 4)
      }, 600) // Slightly slower for better readability
      return () => clearInterval(interval)
    } else if (prevIsGeneratingRef.current && !isGenerating && data) {
      // Was generating, now finished and data is available
      const timer = setTimeout(() => {
        setShowContent(true) // Show content after a brief delay for smooth transition
      }, 100) // Short delay for fade-in effect
      return () => clearTimeout(timer)
    } else if (!isGenerating && data) {
      // Initially not generating but data is present
      setShowContent(true)
    }
    prevIsGeneratingRef.current = isGenerating
  }, [isGenerating, data])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  }

  const GeneratingAnimation = () => (
    <div className="h-full flex flex-col items-center justify-center p-8 space-y-6 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse" />
        <div className="relative bg-background border-2 border-primary/20 rounded-full p-8">
          <Sparkles className="h-16 w-16 text-primary animate-spin" style={{ animationDuration: "1.5s" }} />
        </div>
      </div>

      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold">Creating Your Perfect Trip</h3>
        <div className="space-y-2">
          {[
            "Analyzing your preferences...",
            "Finding the best destinations...",
            "Crafting your daily itinerary...",
            "Adding finishing touches...",
          ].map((text, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-center space-x-2 transition-opacity duration-500 ease-in-out",
                animationStep === index ? "opacity-100" : "opacity-40",
              )}
            >
              <div
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              />
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md space-y-4 mt-6">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  )

  if (isGenerating || (!showContent && !data)) {
    // Show generating animation if isGenerating or if content shouldn't be shown yet and no data
    return (
      <Card className="h-full flex flex-col overflow-hidden border-primary/20 transition-all duration-300">
        <GeneratingAnimation />
      </Card>
    )
  }

  // If not generating and data is available (or fallback is used), show the content
  return (
    <Card
      className={cn(
        "h-full flex flex-col overflow-hidden transition-opacity duration-500 ease-in-out hover:shadow-lg",
        showContent ? "opacity-100" : "opacity-0",
      )}
    >
      <CardHeader className="border-b bg-gradient-to-r from-background to-secondary/20">
        <div className="space-y-2">
          <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {roadmapData.title}
          </CardTitle>
          {roadmapData.description && <p className="text-sm text-muted-foreground">{roadmapData.description}</p>}
        </div>
      </CardHeader>

      <Tabs defaultValue="itinerary" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="itinerary" className="flex items-center space-x-2">
            <List className="h-4 w-4" />
            <span>Itinerary</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center space-x-2">
            <MapIcon className="h-4 w-4" />
            <span>Map</span>
          </TabsTrigger>
        </TabsList>

        <CardContent className="flex-1 overflow-hidden p-0">
          <TabsContent value="itinerary" className="h-full overflow-y-auto p-4 m-0 data-[state=inactive]:hidden">
            {roadmapData.days.length > 0 ? (
              <div className="space-y-4">
                {roadmapData.days.map((day, dayIndex) => (
                  <div
                    key={day.day}
                    className="border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up" // Changed to animate-slide-up
                    style={{ animationDelay: `${dayIndex * 100}ms`, animationDuration: "0.4s" }} // Adjusted delay and duration
                  >
                    <div
                      className="flex justify-between items-center p-4 cursor-pointer bg-gradient-to-r from-background to-secondary/10 hover:from-secondary/20 hover:to-secondary/30 transition-all duration-300"
                      onClick={() => toggleDayExpansion(day.day)}
                    >
                      <div className="flex flex-col space-y-1">
                        <h3 className="font-semibold text-lg">Day {day.day}</h3>
                        {day.date && (
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {formatDate(day.date)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {day.activities.length} activities
                        </div>
                        {expandedDays.includes(day.day) ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                        )}
                      </div>
                    </div>

                    {expandedDays.includes(day.day) && (
                      <div className="border-t bg-secondary/5 animate-slide-down" style={{ animationDuration: "0.3s" }}>
                        <div className="p-4 space-y-4">
                          <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                            {day.summary}
                          </p>
                          <div className="space-y-3">
                            {day.activities.map((activity, activityIndex) => (
                              <div
                                key={activityIndex}
                                className="bg-background border rounded-lg p-4 transition-all duration-300 hover:shadow-sm hover:border-primary/30 group animate-fade-in"
                                style={{ animationDelay: `${activityIndex * 75}ms`, animationDuration: "0.5s" }} // Staggered fade-in for activities
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium group-hover:text-primary transition-colors duration-200">
                                    {activity.title}
                                  </h4>
                                  <Star className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                </div>
                                {activity.description && (
                                  <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                                )}
                                <div className="flex flex-wrap gap-3 text-xs">
                                  {activity.time && (
                                    <div className="flex items-center text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {activity.time}
                                    </div>
                                  )}
                                  {activity.location && (
                                    <div className="flex items-center text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {activity.location}
                                    </div>
                                  )}
                                  <div className="flex items-center text-primary bg-primary/10 px-2 py-1 rounded-md cursor-pointer hover:bg-primary/20">
                                    <Navigation className="h-3 w-3 mr-1" />
                                    Get Directions
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-lg" />
                  <div className="relative bg-background border border-primary/20 rounded-full p-6">
                    <MapPin className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground">Your itinerary will appear here</p>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Start by describing your dream trip in the chat, and I'll create a personalized day-by-day plan for
                    you!
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="map" className="h-full data-[state=inactive]:hidden animate-fade-in">
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-secondary/20 to-background">
              <div className="text-center p-8 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-lg" />
                  <div className="relative bg-background border border-primary/20 rounded-full p-6">
                    <MapIcon className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-lg">Interactive Map View</p>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Your trip locations will be displayed on an interactive map here.
                    <br />
                    <span className="text-xs opacity-75">
                      (Map integration with Mapbox or Google Maps would be implemented here)
                    </span>
                  </p>
                </div>
                {roadmapData.days.length > 0 && (
                  <div className="mt-6 p-4 bg-secondary/30 rounded-lg border">
                    <p className="text-xs text-muted-foreground">
                      Map would show {roadmapData.days.reduce((acc, day) => acc + day.activities.length, 0)} locations
                      across {roadmapData.days.length} days
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
