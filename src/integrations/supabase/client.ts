import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ozqefcpfcqkqrzzaurgn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96cWVmY3BmY3FrcXJ6emF1cmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzMjkwMzIsImV4cCI6MjAzMzkwNTAzMn0.MGJMmzeKti0ss6oLYQJtgg0rMlzgy9y8ja95WhLCI8Q";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});