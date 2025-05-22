// Create a mock file to substitute for @/lib/supabase
import { jest } from '@jest/globals';

export const supabase = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    getSession: jest.fn().mockResolvedValue({ 
      data: { session: null } 
    }),
    onAuthStateChange: jest.fn().mockReturnValue({ 
      data: { subscription: { unsubscribe: jest.fn() } } 
    }),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  channel: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn().mockReturnThis(),
  removeChannel: jest.fn(),
};