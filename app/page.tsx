"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { TripPromptInput } from "@/components/trip/TripPromptInput";
import { MapPin, Plane, Calendar, MessageSquare, Users, Sparkles, Star, Globe, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.05),transparent_50%)] pointer-events-none" />
          
          <div className="container flex flex-col items-center justify-center px-4 py-24 md:py-32 text-center relative z-10">
            <div className="animate-fade-in space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse" />
                <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-2xl mx-auto gradient-text">
                  Your AI Travel Planner for the Perfect Trip
                </h1>
              </div>
              
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Chat with our AI travel agent to build personalized day-by-day travel roadmaps tailored to your preferences and dreams.
              </p>
              
              <div className="mt-10 w-full max-w">
                <TripPromptInput fullWidth={true} />
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span>Worldwide</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>Instant Planning</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to your perfect trip
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <MessageSquare className="h-12 w-12" />,
                  title: "Chat with AI",
                  description: "Describe your dream trip and preferences in a natural conversation with our intelligent travel agent.",
                  color: "from-blue-500/20 to-blue-600/20"
                },
                {
                  icon: <Plane className="h-12 w-12" />,
                  title: "Get a Personalized Roadmap",
                  description: "Receive a detailed day-by-day itinerary with activities, attractions, and dining recommendations.",
                  color: "from-green-500/20 to-green-600/20"
                },
                {
                  icon: <Calendar className="h-12 w-12" />,
                  title: "Refine Your Plan",
                  description: "Adjust and customize your itinerary until it's perfect for your travel style and preferences.",
                  color: "from-purple-500/20 to-purple-600/20"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="group bg-background p-8 rounded-2xl border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 w-fit group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/90 dark:from-background dark:to-background text-primary-foreground dark:text-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(0,0,0,0.2),transparent_50%)] pointer-events-none" />
          
          <div className="container px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-foreground">Ready to Plan Your Dream Trip?</h2>
              <p className="text-lg text-primary-foreground/90 dark:text-foreground/90 leading-relaxed">
                Our AI travel agent is ready to help you create the perfect itinerary tailored to your preferences, budget, and travel style.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="hover:scale-105 transition-transform duration-200"
                  asChild
                >
                  <Link href="#top">Start Planning Now</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="
                    bg-black text-white dark:border-black
                    hover:bg-black hover:text-white hover:border-black
                    dark:bg-white dark:text-black border-white
                    dark:hover:bg-white dark:hover:text-black dark:hover:border-white
                    hover:scale-105 transition-all duration-200
                  "
                  asChild
                >
                  <Link href="/auth/signup">Create Free Account</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-primary-foreground/80 dark:text-foreground pt-8">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 dark:text-foreground" />
                  <span>10,000+ Happy Travelers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 dark:text-foreground" />
                  <span>195+ Countries</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-secondary/20">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <Plane className="h-6 w-6 mr-2 text-primary" />
                <span className="font-bold text-lg">Wanderlust AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your intelligent travel companion for planning perfect trips around the world.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">API</Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">About</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Careers</Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Help Center</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Marco AI. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}