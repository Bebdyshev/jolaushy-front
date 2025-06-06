"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Sparkles } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

interface TripPromptInputProps {
  fullWidth?: boolean
  onPromptSubmit?: (prompt: string) => void
  className?: string
  isTransitioning?: boolean
}

const INITIAL_PLACEHOLDER = "Ask Marco"
const EXAMPLE_PROMPTS = [
  "5 day trip to Paris",
  "Weekend getaway in the mountains",
  "Family vacation to California",
  "Cultural tour of Tokyo",
  "Adventure in Costa Rica",
]
const TYPING_SPEED = 100
const DELETING_SPEED = 50
const DELAY_BETWEEN_PROMPTS = 2000

export function TripPromptInput({
  fullWidth = false,
  onPromptSubmit,
  className = "",
  isTransitioning = false,
}: TripPromptInputProps) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("")
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isDeletingPlaceholder, setIsDeletingPlaceholder] = useState(false)
  const [isUserInputting, setIsUserInputting] = useState(false)
  const placeholderTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isUserInputting) {
      if (placeholderTimeoutRef.current) {
        clearTimeout(placeholderTimeoutRef.current)
      }
      return
    }

    const currentFullPlaceholder =
      currentExampleIndex === -1 // Special case for "Ask marco" initially
        ? INITIAL_PLACEHOLDER
        : EXAMPLE_PROMPTS[currentExampleIndex % EXAMPLE_PROMPTS.length]

    if (!isDeletingPlaceholder) {
      // Typing
      if (currentCharIndex < currentFullPlaceholder.length) {
        placeholderTimeoutRef.current = setTimeout(() => {
          setDisplayedPlaceholder((prev) => prev + currentFullPlaceholder[currentCharIndex])
          setCurrentCharIndex((prev) => prev + 1)
        }, TYPING_SPEED)
      } else {
        placeholderTimeoutRef.current = setTimeout(() => {
          setIsDeletingPlaceholder(true)
        }, DELAY_BETWEEN_PROMPTS)
      }
    } else {
      // Deleting
      if (currentCharIndex > 0) {
        placeholderTimeoutRef.current = setTimeout(() => {
          setDisplayedPlaceholder((prev) => prev.slice(0, -1))
          setCurrentCharIndex((prev) => prev - 1)
        }, DELETING_SPEED)
      } else {
        setIsDeletingPlaceholder(false)
        if (currentExampleIndex === -1) {
          // Finished "Ask marco"
          setCurrentExampleIndex(0) // Start with first example
        } else {
          setCurrentExampleIndex((prev) => (prev + 1) % EXAMPLE_PROMPTS.length)
        }
      }
    }

    return () => {
      if (placeholderTimeoutRef.current) {
        clearTimeout(placeholderTimeoutRef.current)
      }
    }
  }, [currentCharIndex, currentExampleIndex, isDeletingPlaceholder, isUserInputting])

  // Initialize with "Ask marco"
  useEffect(() => {
    if (!isUserInputting) {
      setCurrentExampleIndex(-1) // Signal to start with INITIAL_PLACEHOLDER
      setCurrentCharIndex(0)
      setIsDeletingPlaceholder(false)
      setDisplayedPlaceholder("")
    }
  }, [isUserInputting])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setIsUserInputting(true) // Keep placeholder off during submission

    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      localStorage.setItem("pendingTripPrompt", prompt)
      router.push("/auth/login")
      // No setIsLoading(false) here as page will redirect
      return
    }

    if (onPromptSubmit) {
      onPromptSubmit(prompt)
    } else {
      router.push(`/roadmap?prompt=${encodeURIComponent(prompt)}`)
    }

    // For SPA-like transitions where the component might stay mounted
    // or if onPromptSubmit doesn't lead to unmount/redirect immediately:
    // setIsLoading(false);
    // However, in many cases, navigation will occur, so resetting isLoading might not be seen.
    // If it's a pure SPA transition without unmount, then:
    // setTimeout(() => setIsLoading(false), 1000); // Simulate processing
  }

  const handleFocus = () => {
    setIsUserInputting(true)
    setDisplayedPlaceholder("") // Clear animated placeholder on focus
  }

  const handleBlur = () => {
    if (!prompt) {
      setIsUserInputting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value)
    if (e.target.value) {
      setIsUserInputting(true) // User is actively typing
      setDisplayedPlaceholder("") // Ensure placeholder is cleared
    } else if (!document.hasFocus() || document.activeElement !== e.target) {
      // If input is cleared AND loses focus, allow animation to restart
      // This case is mostly handled by onBlur, but good for completeness
      setIsUserInputting(false)
    }
  }

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-in-out", // Base transition classes
        isLoading || isTransitioning
          ? "transform scale-95 opacity-75" // State when loading/transitioning
          : "transform scale-100 opacity-100", // Normal state
        className,
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col space-y-3 transition-all duration-500 mx-auto",
          fullWidth ? "w-full max-w-2xl" : "max-w-xl",
        )}
      >
        <div className="relative flex w-full items-center group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <Input
            type="text"
            placeholder={isUserInputting ? "" : displayedPlaceholder}
            value={prompt}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "pr-12 relative z-10 transition-all duration-300",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "hover:shadow-md",
            )}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 h-[calc(100%-0.5rem)] w-8 md:w-auto md:px-3", // Adjusted for better fit
              "hover:scale-105 active:scale-95",
              isLoading && "animate-pulse",
            )}
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? <Sparkles className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  )
}
