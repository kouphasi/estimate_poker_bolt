import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { EstimationDeck } from '@/components/estimation-deck';
import { Eye, EyeOff, Share2 } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  description: string | null;
  show_estimations: boolean;
  estimation_url: string;
  final_estimation: number | null;
}

interface Estimation {
  id: string;
  user_id: string;
  estimation: number;
  is_custom: boolean;
}

export default function TaskEstimation() {
  const { taskId } = useParams();
  const { user } = useAuthStore();
  const [task, setTask] = useState<Task | null>(null);
  const [estimations, setEstimations] = useState<Estimation[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchTask();
    const subscription = setupRealtimeSubscription();
    return () => {
      subscription();
    };
  }, [taskId]);

  async function fetchTask() {
    try {
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('*, projects!inner(*)')
        .eq('id', taskId)
        .single();

      if (taskError) throw taskError;
      
      setTask(taskData);
      setIsOwner(taskData.projects.user_id === user?.id);

      const { data: estimationsData, error: estimationsError } = await supabase
        .from('estimations')
        .select('*')
        .eq('task_id', taskId);

      if (estimationsError) throw estimationsError;
      
      setEstimations(estimationsData || []);
      
      const myEstimation = estimationsData?.find(e => e.user_id === user?.id);
      if (myEstimation) {
        const value = myEstimation.estimation;
        setSelectedValue(value >= 1 ? `${value}d` : `${value * 8}h`);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  }

  function setupRealtimeSubscription() {
    const estimationsSubscription = supabase
      .channel('estimations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'estimations',
          filter: `task_id=eq.${taskId}`,
        },
        () => {
          fetchTask();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(estimationsSubscription);
    };
  }

  const handleEstimationSelect = async (value: string) => {
    if (!user || !taskId || !value) return;

    try {
      let numericValue: number;
      
      if (value.endsWith('d')) {
        numericValue = parseFloat(value.slice(0, -1));
      } else if (value.endsWith('h')) {
        numericValue = parseFloat(value.slice(0, -1)) / 8;
      } else {
        console.error('Invalid estimation format');
        return;
      }

      if (isNaN(numericValue)) {
        console.error('Invalid estimation value');
        return;
      }

      const { error } = await supabase
        .from('estimations')
        .upsert({
          task_id: taskId,
          user_id: user.id,
          estimation: numericValue,
          is_custom: !['1h', '2h', '4h', '8h', '1d', '1.5d', '2d', '3d'].includes(value),
        }, {
          onConflict: 'task_id,user_id'
        });

      if (error) throw error;
      setSelectedValue(value);
    } catch (error) {
      console.error('Error submitting estimation:', error);
    }
  };

  const toggleShowEstimations = async () => {
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ show_estimations: !task.show_estimations })
        .eq('id', task.id);

      if (error) throw error;
      setTask({ ...task, show_estimations: !task.show_estimations });
    } catch (error) {
      console.error('Error toggling estimations visibility:', error);
    }
  };

  const copyEstimationUrl = () => {
    if (!task) return;
    const url = `${window.location.origin}/estimation/${task.estimation_url}`;
    navigator.clipboard.writeText(url);
    alert('Estimation URL copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loading size="lg" text="Loading estimation..." />
      </div>
    );
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{task.name}</h1>
          {task.description && (
            <p className="text-gray-600">{task.description}</p>
          )}
        </div>

        {isOwner && (
          <div className="flex gap-2 mb-8">
            <Button onClick={toggleShowEstimations}>
              {task.show_estimations ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Estimations
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show Estimations
                </>
              )}
            </Button>
            <Button variant="outline" onClick={copyEstimationUrl}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        )}

        <div className="mb-8">
          <EstimationDeck
            selectedValue={selectedValue}
            onSelect={handleEstimationSelect}
          />
        </div>

        {(task.show_estimations || isOwner) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {estimations.map((estimation) => (
              <Card key={estimation.id} className="p-4">
                <div className="text-lg font-medium">
                  {estimation.estimation}d
                </div>
                <div className="text-sm text-gray-500">
                  {estimation.user_id === user?.id ? 'Your estimation' : 'Team member'}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}