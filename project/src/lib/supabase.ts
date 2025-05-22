// Choose between Supabase or local database based on environment variable
// Database type is imported but used indirectly in the implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Database } from './database.types';

// Use local database implementation by default
import { supabase as localSupabase } from './supabase.local';

// Export the appropriate database client
export const supabase = localSupabase;