import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://itpgtkeedmqsnczfmcow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cGd0a2VlZG1xc25jemZtY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMzIyNzEsImV4cCI6MjA0OTcwODI3MX0.vkoN3LxaZp5LpysRd79NKLAlfRA3_63FBhUP4fOAIXI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});