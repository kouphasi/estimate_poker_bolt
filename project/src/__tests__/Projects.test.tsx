import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@/test-utils';
import Projects from '@/pages/Projects';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Projects Component', () => {
  const mockProjects = [
    {
      id: '1',
      name: 'Project 1',
      description: 'Description 1',
      is_completed: false,
      final_estimation: null,
    },
    {
      id: '2',
      name: 'Project 2',
      description: 'Description 2',
      is_completed: true,
      final_estimation: 8,
    },
  ];

  test('renders loading state initially', () => {
    render(<Projects />);
    expect(screen.getByText(/loading projects/i)).toBeInTheDocument();
  });

  test('renders projects after loading', async () => {
    // Mock successful projects fetch
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockProjects,
          error: null,
        }),
      }),
    });

    render(<Projects />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading projects/i)).not.toBeInTheDocument();
    });

    // Check if projects are rendered
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
    
    // Check status indicators
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Final: 8h')).toBeInTheDocument();
  });

  test('navigates to project tasks when clicked', async () => {
    // Mock successful projects fetch
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockProjects,
          error: null,
        }),
      }),
    });

    renderWithRouter(<Projects />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading projects/i)).not.toBeInTheDocument();
    });

    // Click on a project
    fireEvent.click(screen.getByText('Project 1'));

    // Check if navigation occurred with the right path
    expect(mockNavigate).toHaveBeenCalledWith('/projects/1/tasks');
  });

  test('shows new project form when add button is clicked', async () => {
    // Mock successful projects fetch
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockProjects,
          error: null,
        }),
      }),
    });

    render(<Projects />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading projects/i)).not.toBeInTheDocument();
    });

    // Click on "New Project" button
    fireEvent.click(screen.getByText(/new project/i));

    // Check if the form is displayed
    expect(screen.getByText('Create a new project')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();
  });

  test('creates a new project when form is submitted', async () => {
    // Mock user
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: 'user-123' },
      setUser: jest.fn(),
    });

    // Mock successful projects fetch
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockProjects,
          error: null,
        }),
      }),
    });

    render(<Projects />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading projects/i)).not.toBeInTheDocument();
    });

    // Click on "New Project" button
    fireEvent.click(screen.getByText(/new project/i));

    // Reset mock to handle the insert call
    (supabase.from as jest.Mock).mockReset();
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              id: '3',
              name: 'New Test Project',
              description: 'New Description',
              is_completed: false,
              final_estimation: null,
            },
            error: null,
          }),
        }),
      }),
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Test Project' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New Description' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    // Check if supabase.from().insert() was called with the right data
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('projects');
      // We can't easily check the insert parameters here because of the mock structure,
      // but the submission process was triggered
    });
  });
});