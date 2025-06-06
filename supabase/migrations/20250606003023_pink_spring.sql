/*
  # Initial Schema for Wanderlust AI

  1. New Tables
    - `profiles`: User profile information
    - `trips`: Trip details
    - `days`: Each day in a trip itinerary
    - `activities`: Activities for each day
    - `messages`: Chat messages between user and AI

  2. Security
    - Enable RLS on all tables
    - Add policies to allow users to access only their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create days table
CREATE TABLE IF NOT EXISTS days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  date DATE,
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  time_start TIME,
  time_end TIME,
  notes TEXT,
  coordinates POINT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create trigger for updating the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_trips_updated_at
BEFORE UPDATE ON trips
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE days ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles: Users can only read and update their own profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trips: Users can CRUD their own trips
CREATE POLICY "Users can view their own trips"
  ON trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
  ON trips FOR DELETE
  USING (auth.uid() = user_id);

-- Days: Users can CRUD days in their own trips
CREATE POLICY "Users can view days of their own trips"
  ON days FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = days.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert days to their own trips"
  ON days FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = days.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update days of their own trips"
  ON days FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = days.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete days from their own trips"
  ON days FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = days.trip_id AND trips.user_id = auth.uid()
  ));

-- Activities: Users can CRUD activities in their own trips
CREATE POLICY "Users can view activities of their own trips"
  ON activities FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM days
    JOIN trips ON trips.id = days.trip_id
    WHERE days.id = activities.day_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert activities to their own trips"
  ON activities FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM days
    JOIN trips ON trips.id = days.trip_id
    WHERE days.id = activities.day_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update activities of their own trips"
  ON activities FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM days
    JOIN trips ON trips.id = days.trip_id
    WHERE days.id = activities.day_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete activities from their own trips"
  ON activities FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM days
    JOIN trips ON trips.id = days.trip_id
    WHERE days.id = activities.day_id AND trips.user_id = auth.uid()
  ));

-- Messages: Users can CRUD messages in their own trips
CREATE POLICY "Users can view messages of their own trips"
  ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = messages.trip_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert messages to their own trips"
  ON messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = messages.trip_id AND trips.user_id = auth.uid()
  ));

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();