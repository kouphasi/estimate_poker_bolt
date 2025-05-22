import { cleanup, render } from '@testing-library/react';
import { afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Custom render function that includes router
export function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);
  
  return render(ui, { wrapper: BrowserRouter });
}

// Export everything from RTL
export * from '@testing-library/react';