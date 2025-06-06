"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  Loader2, 
  Plane,
  Sparkles,
  MessageCircle
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { TripPromptInput } from "@/components/trip/TripPromptInput";

type ChatInterfaceProps = {
  initialPrompt?: string;
  onUpdateRoadmap?: (data: any) => void;
  onGenerationStart?: () => void;
  onGenerationComplete?: () => void;
};

export function ChatInterface({ 
  initialPrompt, 
  onUpdateRoadmap, 
  onGenerationStart,
  onGenerationComplete 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      handleInitialPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInitialPrompt = async (prompt: string) => {
    setIsTransitioning(true);
    onGenerationStart?.();
    
    // Delay to show transition animation
    setTimeout(() => {
      setShowChat(true);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        trip_id: "initial",
        content: prompt,
        role: "user",
        created_at: new Date().toISOString(),
      };

      setMessages([userMessage]);
      setIsLoading(true);
    }, 500);

    // Simulate AI response after a delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        trip_id: "initial",
        content: `Perfect! I'm creating a personalized itinerary for "${prompt}". I've analyzed your preferences and found some amazing experiences. What dates were you thinking of traveling?`,
        role: "assistant",
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      
      // Generate mock roadmap data
      if (onUpdateRoadmap) {
        const destination = prompt.includes('Tokyo') ? 'Tokyo' : 
                          prompt.includes('Paris') ? 'Paris' : 
                          prompt.includes('Costa Rica') ? 'Costa Rica' :
                          prompt.includes('California') ? 'California' : 'Your Destination';
        
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
                  coordinates: destination === 'Tokyo' ? [139.7525, 35.6846] : 
                              destination === 'Paris' ? [2.3522, 48.8566] :
                              [-84.0907, 9.7489]
                },
                {
                  title: "Welcome Dinner",
                  time: "19:00",
                  location: "Local Restaurant",
                  description: "Taste authentic local cuisine",
                  coordinates: destination === 'Tokyo' ? [139.7675, 35.6762] : 
                              destination === 'Paris' ? [2.3387, 48.8606] :
                              [-84.0807, 9.7389]
                }
              ]
            },
            {
              day: 2,
              date: "2025-04-16",
              summary: "Cultural Immersion",
              activities: [
                {
                  title: "Morning Cultural Tour",
                  time: "09:00",
                  location: "Historic District",
                  description: "Explore local history and culture",
                  coordinates: destination === 'Tokyo' ? [139.7638, 35.6762] : 
                              destination === 'Paris' ? [2.3488, 48.8534] :
                              [-84.0707, 9.7289]
                },
                {
                  title: "Traditional Lunch Experience",
                  time: "13:00",
                  location: "Traditional Restaurant",
                  description: "Authentic local dining experience",
                  coordinates: destination === 'Tokyo' ? [139.7575, 35.6695] : 
                              destination === 'Paris' ? [2.3422, 48.8588] :
                              [-84.0607, 9.7189]
                },
                {
                  title: "Sunset Viewpoint",
                  time: "18:00",
                  location: "Scenic Overlook",
                  description: "Perfect photo opportunity",
                  coordinates: destination === 'Tokyo' ? [139.7454, 35.6586] : 
                              destination === 'Paris' ? [2.2945, 48.8584] :
                              [-84.0507, 9.7089]
                }
              ]
            },
            {
              day: 3,
              date: "2025-04-17",
              summary: "Adventure & Exploration",
              activities: [
                {
                  title: "Adventure Activity",
                  time: "10:00",
                  location: "Adventure Center",
                  description: "Thrilling outdoor experience",
                  coordinates: destination === 'Tokyo' ? [139.7311, 35.6895] : 
                              destination === 'Paris' ? [2.3376, 48.8738] :
                              [-84.0407, 9.6989]
                },
                {
                  title: "Local Market Visit",
                  time: "15:00",
                  location: "Central Market",
                  description: "Shop for local crafts and souvenirs",
                  coordinates: destination === 'Tokyo' ? [139.7711, 35.6711] : 
                              destination === 'Paris' ? [2.3476, 48.8638] :
                              [-84.0307, 9.6889]
                }
              ]
            }
          ],
          map: {
            center: destination === 'Tokyo' ? [139.7525, 35.6846] : 
                   destination === 'Paris' ? [2.3522, 48.8566] :
                   [-84.0907, 9.7489],
            zoom: 12
          }
        };
        
        onUpdateRoadmap(mockRoadmap);
      }
      
      onGenerationComplete?.();
    }, 3000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      trip_id: "chat",
      content: input,
      role: "user",
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = [
        "Great choice! I've updated your itinerary to include more local experiences. The roadmap now features authentic restaurants and hidden gems that locals love.",
        "Perfect! I've added some exciting activities based on your preferences. Your trip now includes both must-see attractions and off-the-beaten-path discoveries.",
        "Excellent suggestion! I've incorporated your feedback and enhanced the itinerary with personalized recommendations that match your travel style.",
        "Wonderful! Your updated itinerary now includes the experiences you mentioned, plus some surprise additions I think you'll love."
      ];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        trip_id: "chat",
        content: responses[Math.floor(Math.random() * responses.length)],
        role: "assistant",
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      
      // Update roadmap with new activity
      if (onUpdateRoadmap) {
        const newActivity = {
          title: input.includes('food') || input.includes('restaurant') ? "Culinary Experience" :
                 input.includes('museum') || input.includes('art') ? "Cultural Visit" :
                 input.includes('park') || input.includes('nature') ? "Nature Exploration" :
                 "Custom Activity",
          time: "16:00",
          location: "Recommended Spot",
          description: `Based on your interest in: ${input}`,
          coordinates: [139.7625 + Math.random() * 0.02, 35.6746 + Math.random() * 0.02]
        };
        
        // This would update the existing roadmap data
        // For demo purposes, we'll trigger a small update
      }
    }, 1500);
  };

  const handlePromptSubmit = (prompt: string) => {
    handleInitialPrompt(prompt);
  };

  return (
    <div className={cn(
      "flex flex-col h-full transition-all duration-700 ease-in-out",
      showChat ? "opacity-100" : "opacity-100"
    )}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!showChat ? (
          <div className="flex flex-col items-center justify-center h-full space-y-8 text-center">
            <div className="space-y-4 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-background border-2 border-primary/20 rounded-full p-6">
                  <MessageCircle className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Your AI Travel Agent
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Describe your dream trip and I'll create a personalized itinerary just for you
                </p>
              </div>
            </div>
            <div className="w-full max-w-md">
              <TripPromptInput 
                fullWidth={true} 
                onPromptSubmit={handlePromptSubmit}
                isTransitioning={isTransitioning}
              />
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex animate-slide-in",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl p-4 transition-all duration-300 hover:shadow-md",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-4"
                      : "bg-secondary/80 backdrop-blur-sm mr-4"
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
            {isLoading && (
              <div className="flex justify-start animate-slide-in">
                <div className="max-w-[85%] rounded-2xl p-4 bg-secondary/80 backdrop-blur-sm mr-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-7 w-7 bg-primary/10 border border-primary/20">
                      <Plane className="h-4 w-4 text-primary" />
                    </Avatar>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {showChat && (
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
      )}
    </div>
  );
}