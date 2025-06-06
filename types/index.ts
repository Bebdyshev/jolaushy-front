export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Trip = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Day = {
  id: string;
  trip_id: string;
  day_number: number;
  date: string | null;
  summary: string;
  created_at: string;
};

export type Activity = {
  id: string;
  day_id: string;
  title: string;
  description: string;
  location: string;
  time_start: string | null;
  time_end: string | null;
  notes: string | null;
  coordinates: [number, number] | null;
  created_at: string;
};

export type Message = {
  id: string;
  trip_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
};

export type MapLocation = {
  id: string;
  name: string;
  coordinates: [number, number];
};