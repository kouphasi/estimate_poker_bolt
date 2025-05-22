import { localDatabase } from './localDatabase';
// Database type is imported but used indirectly in the implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Database } from './database.types';

// Export the local database instance with the same interface as Supabase
export const supabase = localDatabase;