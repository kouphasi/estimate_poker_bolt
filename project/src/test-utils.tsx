import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      getSession: jest.fn().mockReturnValue(Promise.resolve({ 
        data: { session: null } 
      })),
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
  }
}));

// Mock zustand store
jest.mock('@/lib/store', () => ({
  useAuthStore: jest.fn().mockReturnValue({
    user: null,
    setUser: jest.fn(),
  }),
}));

// Wrap component with router for testing
export function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);
  
  return {
    ...render(ui, { wrapper: BrowserRouter }),
  };
}