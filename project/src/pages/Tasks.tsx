import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { Plus } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  description: string | null;
  is_completed: boolean;
  final_estimation: number | null;
}

export default function Tasks() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  async function fetchTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            name: newTaskName,
            description: newTaskDescription,
            project_id: projectId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTasks([data, ...tasks]);
      setShowNewTask(false);
      setNewTaskName('');
      setNewTaskDescription('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  const handleTaskClick = (taskId: string) => {
    navigate(`/projects/${projectId}/tasks/${taskId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loading size="lg" text="Loading tasks..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Tasks</h2>
          <Button 
            onClick={() => setShowNewTask(true)}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {showNewTask && (
          <Card className="border border-primary-soft shadow-orange-glow">
            <CardHeader>
              <CardTitle className="text-gray-900">Create New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Task Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-primary-soft shadow-sm focus:border-primary focus:ring focus:ring-primary/20 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-primary-soft shadow-sm focus:border-primary focus:ring focus:ring-primary/20 sm:text-sm"
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
                    Create Task
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewTask(false)}
                    className="border-primary-soft text-gray-700 hover:bg-primary-soft"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="hover-scale border border-primary-soft hover:shadow-orange-glow cursor-pointer"
              onClick={() => handleTaskClick(task.id)}
            >
              <CardHeader>
                <CardTitle className="text-gray-900">{task.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{task.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    task.is_completed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-primary-soft text-primary'
                  }`}>
                    {task.is_completed ? 'Completed' : 'In Progress'}
                  </span>
                  {task.final_estimation && (
                    <span className="text-sm font-medium text-primary">
                      Final: {task.final_estimation}h
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}