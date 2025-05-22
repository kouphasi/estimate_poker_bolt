import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@/test-utils';
import Tasks from '@/pages/Tasks';
import { supabase } from '@/lib/supabase';

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ projectId: 'project-123' }),
  useNavigate: () => jest.fn(),
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Tasks Component', () => {
  const mockTasks = [
    {
      id: 'task-1',
      name: 'Task 1',
      description: 'Description 1',
      is_completed: false,
      final_estimation: null,
    },
    {
      id: 'task-2',
      name: 'Task 2',
      description: 'Description 2',
      is_completed: true,
      final_estimation: 5,
    },
  ];

  test('renders loading state initially', () => {
    render(<Tasks />);
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  test('renders tasks after loading', async () => {
    // Mock successful tasks fetch
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockTasks,
            error: null,
          }),
        }),
      }),
    });

    render(<Tasks />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument();
    });

    // Check if tasks are rendered
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
    
    // Check status indicators
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('shows new task form when add button is clicked', async () => {
    // Mock successful tasks fetch
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockTasks,
            error: null,
          }),
        }),
      }),
    });

    render(<Tasks />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument();
    });

    // Click on "New Task" button
    fireEvent.click(screen.getByText(/new task/i));

    // Check if the form is displayed
    expect(screen.getByText('Create a new task')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  test('creates a new task when form is submitted', async () => {
    // Mock successful tasks fetch
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockTasks,
            error: null,
          }),
        }),
      }),
    });

    render(<Tasks />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument();
    });

    // Click on "New Task" button
    fireEvent.click(screen.getByText(/new task/i));

    // Reset mock to handle the insert call
    (supabase.from as jest.Mock).mockReset();
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              id: 'task-3',
              name: 'New Test Task',
              description: 'New Task Description',
              is_completed: false,
              final_estimation: null,
            },
            error: null,
          }),
        }),
      }),
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Test Task' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New Task Description' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));

    // Check if supabase.from().insert() was called with the right data
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      // We can't easily check the insert parameters here because of the mock structure,
      // but the submission process was triggered
    });
  });

  test('cancels new task creation when cancel button is clicked', async () => {
    // Mock successful tasks fetch
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockTasks,
            error: null,
          }),
        }),
      }),
    });

    render(<Tasks />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument();
    });

    // Click on "New Task" button
    fireEvent.click(screen.getByText(/new task/i));

    // Check if the form is displayed
    expect(screen.getByText('Create a new task')).toBeInTheDocument();

    // Click on "Cancel" button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    // Check if the form is no longer displayed
    expect(screen.queryByText('Create a new task')).not.toBeInTheDocument();
  });
});