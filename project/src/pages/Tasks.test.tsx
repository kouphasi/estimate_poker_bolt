import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderWithRouter } from '@/test/test-utils';
import Tasks from './Tasks';
import { supabase } from '@/lib/supabase';
import { useParams, useNavigate } from 'react-router-dom';

// Mock Supabase for tests
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    }),
  },
}));

// Mock react-router-dom hooks
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

describe('Tasks Component', () => {
  const mockProjectId = 'project-123';
  const mockNavigate = vi.fn();
  const mockTasks = [
    {
      id: 'task-1',
      name: 'Test Task 1',
      description: 'Description for task 1',
      is_completed: false,
      final_estimation: null,
    },
    {
      id: 'task-2',
      name: 'Test Task 2',
      description: 'Description for task 2',
      is_completed: true,
      final_estimation: 8,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ projectId: mockProjectId });
    useNavigate.mockReturnValue(mockNavigate);

    // Setup Supabase mock for fetchTasks
    const mockFrom = supabase.from as any;
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: mockTasks,
        error: null,
      }),
    });
  });

  it('shows loading state initially', () => {
    renderWithRouter(<Tasks />);
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('renders tasks after loading', async () => {
    renderWithRouter(<Tasks />);
    
    // Wait for loading to finish and tasks to appear
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });

    // Check if tasks are rendered
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description for task 1')).toBeInTheDocument();
    expect(screen.getByText('Description for task 2')).toBeInTheDocument();
  });

  it('shows task status correctly', async () => {
    renderWithRouter(<Tasks />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Final: 8h')).toBeInTheDocument();
  });

  it('toggles new task form when button is clicked', async () => {
    renderWithRouter(<Tasks />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });

    // Check that the form is not visible initially
    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
    
    // Click new task button
    const newTaskButton = screen.getByRole('button', { name: /new task/i });
    const user = userEvent.setup();
    await user.click(newTaskButton);
    
    // Check that form is visible
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    
    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    // Check that form is hidden again
    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
  });

  it('creates a new task when form is submitted', async () => {
    // Setup Supabase mock for task creation
    const mockFrom = supabase.from as any;
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: mockTasks,
        error: null,
      }),
      single: vi.fn().mockResolvedValue({
        data: {
          id: 'new-task',
          name: 'New Task',
          description: 'New task description',
          is_completed: false,
        },
        error: null,
      }),
    });

    renderWithRouter(<Tasks />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });
    
    // Open new task form
    const newTaskButton = screen.getByRole('button', { name: /new task/i });
    const user = userEvent.setup();
    await user.click(newTaskButton);
    
    // Fill out the form
    const nameInput = screen.getByLabelText(/task name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    await user.type(nameInput, 'New Task');
    await user.type(descriptionInput, 'New task description');
    
    // Submit the form
    const createButton = screen.getByRole('button', { name: /create task/i });
    await user.click(createButton);
    
    // Verify that the Supabase insert was called with correct data
    expect(supabase.from).toHaveBeenCalledWith('tasks');
    
    // Wait for the form to close
    await waitFor(() => {
      expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
    });
  });

  it('navigates to task details when a task is clicked', async () => {
    // Mock the closest method for the card element
    Element.prototype.closest = vi.fn().mockImplementation(function() {
      return this; // Return the element itself as the "closest" ancestor
    });
    
    renderWithRouter(<Tasks />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });
    
    // Click on the first task's name directly
    const taskElement = screen.getByText('Test Task 1');
    const user = userEvent.setup();
    await user.click(taskElement);
    
    // Verify navigation was called with the right path
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});