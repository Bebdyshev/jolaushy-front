import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";

// Initialize Supabase client using environment variables
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Mock AI response generation
function generateAIResponse(userMessage: string, tripContext: any) {
  // In a real implementation, this would call an AI service
  // This is just a mock implementation
  
  if (userMessage.toLowerCase().includes("hotel")) {
    return {
      message: "I've found several hotels that would be perfect for your trip. Would you like luxury options or more budget-friendly accommodations?",
      updatedRoadmap: {
        ...tripContext,
        days: [
          ...(tripContext?.days || []),
          {
            day_number: (tripContext?.days?.length || 0) + 1,
            date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            summary: "Hotel check-in and exploring the area",
            activities: [
              {
                title: "Check-in at hotel",
                time: "15:00",
                location: "City Center Hotel",
                coordinates: [139.7673068, 35.6809591]
              }
            ]
          }
        ]
      }
    };
  } else if (userMessage.toLowerCase().includes("restaurant") || userMessage.toLowerCase().includes("food")) {
    return {
      message: "I've added some fantastic local restaurants to your itinerary. These places are known for their authentic cuisine and great atmosphere!",
      updatedRoadmap: {
        ...tripContext,
        days: [
          ...(tripContext?.days || []),
          {
            day_number: (tripContext?.days?.length || 0) + 1,
            date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            summary: "Culinary exploration day",
            activities: [
              {
                title: "Breakfast at local cafe",
                time: "09:00",
                location: "Morning Brew Cafe",
                coordinates: [139.7673068, 35.6809591]
              },
              {
                title: "Food tour",
                time: "13:00",
                location: "City Center",
                coordinates: [139.7673068, 35.6809591]
              },
              {
                title: "Dinner at recommended restaurant",
                time: "19:00",
                location: "Traditional Restaurant",
                coordinates: [139.7673068, 35.6809591]
              }
            ]
          }
        ]
      }
    };
  } else {
    // Default response
    return {
      message: "I've considered your preferences and updated your travel itinerary. Is there anything specific you'd like to modify or any other activities you'd like to add?",
      updatedRoadmap: {
        ...tripContext,
        days: [
          ...(tripContext?.days || []),
          {
            day_number: (tripContext?.days?.length || 0) + 1,
            date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            summary: "Exploring the highlights",
            activities: [
              {
                title: "Visit main attractions",
                time: "10:00",
                location: "City Center",
                coordinates: [139.7673068, 35.6809591]
              },
              {
                title: "Lunch break",
                time: "13:00",
                location: "Local Cafe",
                coordinates: [139.7673068, 35.6809591]
              },
              {
                title: "Shopping and relaxation",
                time: "15:00",
                location: "Shopping District",
                coordinates: [139.7673068, 35.6809591]
              }
            ]
          }
        ]
      }
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 200,
    });
  }
  
  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    
    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    
    const body = await req.json();
    const { message, tripId, tripContext } = body;
    
    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    // Generate AI response (mock function)
    const response = generateAIResponse(message, tripContext || {});
    
    // In a real implementation, you would store the message and response in the database
    if (tripId) {
      // Save the user message
      await supabaseClient.from("messages").insert({
        trip_id: tripId,
        content: message,
        role: "user"
      });
      
      // Save the AI response
      await supabaseClient.from("messages").insert({
        trip_id: tripId,
        content: response.message,
        role: "assistant"
      });
      
      // Update or create the roadmap data
      // This would be more complex in a real implementation
      // involving updating the days and activities tables
    }
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});