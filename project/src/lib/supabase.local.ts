import { localDatabase } from './localDatabase';
import { Database } from './database.types';

// Export the local database instance with the same interface as Supabase
export const supabase = localDatabase;