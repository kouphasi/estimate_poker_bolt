import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '@/pages/Login';
import { supabase } from '@/lib/supabase';

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Login Component', () => {
  test('renders the login form', () => {
    render(<Login />);
    
    // Check for elements in the form
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('handles email and password input changes', () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Simulate typing in the email field
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
    
    // Simulate typing in the password field
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput).toHaveValue('password123');
  });

  test('handles sign in submission', async () => {
    // Mock successful sign in
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    render(<Login />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify that signInWithPassword was called with the right params
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  test('handles sign up button click', async () => {
    // Mock successful sign up
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    render(<Login />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    // Click sign up button
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Verify that signUp was called with the right params
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  test('displays error message when sign in fails', async () => {
    // Mock failed sign in
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Invalid login credentials' },
    });

    render(<Login />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong-password' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials')).toBeInTheDocument();
    });
  });
});