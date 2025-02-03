import { Outlet } from 'react-router-dom';

export default function ProjectLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Outlet />
    </div>
  );
}