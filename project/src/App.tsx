import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import Login from '@/pages/Login';
import Projects from '@/pages/Projects';
import Tasks from '@/pages/Tasks';
import TaskEstimation from '@/pages/TaskEstimation';
import ProjectLayout from '@/layouts/ProjectLayout';

function App() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/projects" />} />
        <Route
          path="/projects"
          element={user ? <ProjectLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Projects />} />
          <Route path=":projectId/tasks" element={<Tasks />} />
          <Route path=":projectId/tasks/:taskId" element={<TaskEstimation />} />
        </Route>
        <Route path="/estimation/:taskId" element={<TaskEstimation />} />
        <Route path="/" element={<Navigate to="/projects" />} />
      </Routes>
    </Router>
  );
}

export default App