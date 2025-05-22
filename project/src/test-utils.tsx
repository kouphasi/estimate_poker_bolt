import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

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