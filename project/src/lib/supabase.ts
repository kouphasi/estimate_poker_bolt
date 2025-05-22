// Choose between Supabase or local database based on environment variable
import { Database } from './database.types';

// Use local database implementation by default
import { supabase as localSupabase } from './supabase.local';

// Export the appropriate database client
export const supabase = localSupabase;