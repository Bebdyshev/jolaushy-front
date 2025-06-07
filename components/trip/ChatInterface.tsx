"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Plane } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import type { Message } from "@/types"
import { cn } from "@/lib/utils"
// TripPromptInput is no longer needed here

type ChatInterfaceProps = {
  initialPrompt?: string
  onUpdateRoadmap?: (data: any) => void
  onGenerationStart?: () => void
  onGenerationComplete?: () => void
}

export function ChatInterface({
  initialPrompt,
  onUpdateRoadmap,
  onGenerationStart,
  onGenerationComplete,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // isTransitioning and showChat are no longer needed for the initial prompt display
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      // Ensure initial prompt is processed only once
      handleInitialPrompt(initialPrompt)
    }
  }, [initialPrompt])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInitialPrompt = async (prompt: string) => {
    onGenerationStart?.()

    const userMessage: Message = {
      id: Date.now().toString(),
      trip_id: "initial",
      content: prompt,
      role: "user",
      created_at: new Date().toISOString(),
    }

    setMessages([userMessage])
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        trip_id: "initial",
        content: `Perfect! I'm creating a personalized itinerary for "${prompt}". I've analyzed your preferences and found some amazing experiences. What dates were you thinking of traveling?`,
        role: "assistant",
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)

      // Generate mock roadmap data
      if (onUpdateRoadmap) {
        const destination = prompt.includes("Tokyo")
          ? "Tokyo"
          : prompt.includes("Paris")
            ? "Paris"
            : prompt.includes("Costa Rica")
              ? "Costa Rica"
              : prompt.includes("California")
                ? "California"
                : "Your Destination"

        const mockRoadmap = {
          title: `${destination} Adventure`,
          description: `A personalized ${destination.toLowerCase()} experience`,
          days: [
            {
              day: 1,
              date: "2025-04-15",
              summary: "Arrival and First Impressions",
              activities: [
                {
                  title: "Airport Transfer & Hotel Check-in",
                  time: "14:00",
                  location: "City Center Hotel",
                  description: "Settle in and get oriented",
                  coordinates:
                    destination === "Tokyo"
                      ? [139.7525, 35.6846]
                      : destination === "Paris"
                        ? [2.3522, 48.8566]
                        : [-84.0907, 9.7489],
                },
                {
                  title: "Welcome Dinner",
                  time: "19:00",
                  location: "Local Restaurant",
                  description: "Taste authentic local cuisine",
                  coordinates:
                    destination === "Tokyo"
                      ? [139.7675, 35.6762]
                      : destination === "Paris"
                        ? [2.3387, 48.8606]
                        : [-84.0807, 9.7389],
                },
              ],
            },
            // ... (other days remain the same)
          ],
          map: {
            center:
              destination === "Tokyo"
                ? [139.7525, 35.6846]
                : destination === "Paris"
                  ? [2.3522, 48.8566]
                  : [-84.0907, 9.7489],
            zoom: 12,
          },
        }

        onUpdateRoadmap(mockRoadmap)
      }

      onGenerationComplete?.()
    }, 2500) // Slightly reduced delay as the UI transition is simpler now
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      trip_id: "chat",
      content: input,
      role: "user",
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = [
        "Great choice! I've updated your itinerary to include more local experiences. The roadmap now features authentic restaurants and hidden gems that locals love.",
        "Perfect! I've added some exciting activities based on your preferences. Your trip now includes both must-see attractions and off-the-beaten-path discoveries.",
        "Excellent suggestion! I've incorporated your feedback and enhanced the itinerary with personalized recommendations that match your travel style.",
        "Wonderful! Your updated itinerary now includes the experiences you mentioned, plus some surprise additions I think you'll love.",
      ]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        trip_id: "chat",
        content: responses[Math.floor(Math.random() * responses.length)],
        role: "assistant",
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
      // ... (roadmap update logic for follow-up messages can remain)
    }, 1500)
  }

  return (
    <div className={cn("flex flex-col h-full transition-all duration-700 ease-in-out opacity-100")}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn("flex animate-slide-in", message.role === "user" ? "justify-end" : "justify-start")}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl p-4 transition-all duration-300 hover:shadow-md",
                message.role === "user"
                  ? "bg-primary text-primary-foreground ml-4"
                  : "bg-secondary/80 backdrop-blur-sm mr-4",
              )}
            >
              {message.role === "assistant" && (
                <div className="flex items-center space-x-2 mb-3">
                  <Avatar className="h-7 w-7 bg-primary/10 border border-primary/20">
                    <Plane className="h-4 w-4 text-primary" />
                  </Avatar>
                  <span className="font-medium text-sm">Wanderlust AI</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading &&
          messages.length > 0 && ( // Show loading indicator only if there are messages
            <div className="flex justify-start animate-slide-in">
              <div className="max-w-[85%] rounded-2xl p-4 bg-secondary/80 backdrop-blur-sm mr-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-7 w-7 bg-primary/10 border border-primary/20">
                    <Plane className="h-4 w-4 text-primary" />
                  </Avatar>
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        {isLoading &&
          messages.length === 0 &&
          !initialPrompt && ( // Placeholder if loading but no messages and no initial prompt yet
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              Loading chat...
            </div>
          )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="border-t bg-background/80 backdrop-blur-sm p-4 flex space-x-3 animate-slide-up"
      >
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Ask anything about your trip..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="pr-4 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className="transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
