# Testing Documentation

This document outlines the testing approach for the Estimate Poker Bolt application.

## Testing Setup

We use the following technologies for testing:

- **Vitest**: Test runner optimized for Vite projects
- **React Testing Library**: For testing React components
- **@testing-library/jest-dom**: For additional DOM testing assertions

## Test Structure

Tests are organized following the same structure as the source code:

- Component tests are placed alongside the component files with a `.test.tsx` extension
- Helper utilities for testing are in `src/test/`

## Running Tests

To run tests, use the following npm scripts:

```bash
# Run tests once
npm test

# Run tests in watch mode (for development)
npm run test:watch
```

## Testing Patterns

### Component Tests

Component tests focus on:
- Correct rendering with different props and states
- User interactions (clicks, form inputs, etc.)
- State changes and side effects

### Page Tests

Page tests focus on:
- Correct rendering of page components
- Interaction with services (Supabase)
- Navigation and routing behavior

### Mocking

We use the following mocking strategies:

- **External Services**: Supabase client is mocked at the global level in `src/test/setup.ts`
- **React Router**: Navigation and route params are mocked for testing
- **Store**: Zustand store is mocked to provide predictable state

## Best Practices

When writing tests:

1. Focus on user behavior rather than implementation details
2. Use meaningful assertions that verify the component works as expected
3. Mock external dependencies to isolate the code being tested
4. Use descriptive test names that explain the expected behavior
5. Keep tests independent of each other

## Adding New Tests

When adding new tests:

1. Create a `.test.tsx` file next to the component you want to test
2. Import the necessary testing utilities
3. Mock any external dependencies
4. Write tests that cover the main functionality of the component
5. Run the tests to ensure they pass