"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/components/shared/Sidebar";
import { Trip } from "@/types";
import { PlusCircle, Plane, MapPin, Calendar, Clock, Star, Sparkles } from "lucide-react";
import { TripPromptInput } from "@/components/trip/TripPromptInput";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        router.push("/auth/login");
        return;
      }
      
      // Enhanced mock data for demonstration
      setTimeout(() => {
        setTrips([
          {
            id: "1",
            user_id: "user123",
            title: "Tokyo Food Adventure",
            description: "Exploring the best food spots in Tokyo with authentic ramen, sushi, and street food experiences",
            start_date: "2025-04-10",
            end_date: "2025-04-15",
            created_at: "2024-03-01T12:00:00Z",
            updated_at: "2024-03-01T12:00:00Z"
          },
          {
            id: "2",
            user_id: "user123",
            title: "Romantic Paris Weekend",
            description: "A romantic getaway in the city of lights with Seine river cruises, Eiffel Tower visits, and cozy cafes",
            start_date: "2025-05-20",
            end_date: "2025-05-22",
            created_at: "2024-03-05T14:30:00Z",
            updated_at: "2024-03-05T14:30:00Z"
          },
          {
            id: "3",
            user_id: "user123",
            title: "Costa Rica Adventure",
            description: "10-day eco-adventure through rainforests, volcanoes, and pristine beaches",
            start_date: "2025-06-15",
            end_date: "2025-06-25",
            created_at: "2024-03-10T09:15:00Z",
            updated_at: "2024-03-10T09:15:00Z"
          }
        ]);
        setIsLoading(false);
      }, 1000);
    };
    
    checkAuth();
  }, []);

  const getTripDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTimeUntilTrip = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Past trip";
    if (diffDays === 0) return "Today!";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months`;
    return `${Math.ceil(diffDays / 365)} years`;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 pt-16">
        <main className="container py-6 md:py-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
                Your Trips
              </h1>
              <p className="text-muted-foreground">
                Plan, manage and explore your travel itineraries with AI assistance
              </p>
            </div>
            
            <Card className="w-full lg:w-auto glass">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Create a new trip</h3>
                </div>
                <TripPromptInput />
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip, index) => (
                <Card 
                  key={trip.id} 
                  className={cn(
                    "overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-in border-primary/10",
                    "bg-gradient-to-br from-background to-secondary/20"
                  )}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardHeader className="pb-4 relative">
                    <div className="absolute top-4 right-4">
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                        {getTimeUntilTrip(trip.start_date!)}
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-200 pr-20">
                      {trip.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 leading-relaxed">
                      {trip.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-4 space-y-3">
                    {trip.start_date && trip.end_date && (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2 text-primary/60" />
                          <span>
                            {new Date(trip.start_date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} - {new Date(trip.end_date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2 text-primary/60" />
                          <span>{getTripDuration(trip.start_date, trip.end_date)} days</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">AI Optimized</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
                      onClick={() => router.push(`/roadmap?id=${trip.id}`)}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View Roadmap
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <Card className="flex flex-col items-center justify-center p-8 border-dashed border-2 cursor-pointer hover:bg-secondary/50 transition-all duration-300 hover:border-primary/30 group animate-slide-in"
                style={{ animationDelay: `${trips.length * 150}ms` }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-background border border-primary/20 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                    <PlusCircle className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <p className="font-medium text-center mt-4 group-hover:text-primary transition-colors duration-200">
                  Create New Trip
                </p>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Start planning your next adventure
                </p>
              </Card>
            </div>
          ) : (
            <Card className="flex flex-col items-center p-12 text-center animate-fade-in">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-background border-2 border-primary/20 rounded-full p-8">
                  <Plane className="h-16 w-16 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">No trips yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
                Start by creating your first trip itinerary. Our AI travel agent will help you plan the perfect getaway tailored to your preferences.
              </p>
              <Button 
                size="lg"
                onClick={() => router.push("/")}
                className="hover:scale-105 transition-transform duration-200"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Plan Your First Trip
              </Button>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}