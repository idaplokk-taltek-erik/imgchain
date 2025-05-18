import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from 'react-bootstrap';

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <Button onClick={() => navigate({ to: '/admin/media-by-author' })}>
        Vaata meedia tehinguid
      </Button>
    </div>
  );
}