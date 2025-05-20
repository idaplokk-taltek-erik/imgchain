import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from 'react-bootstrap';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <Button onClick={() => navigate({ to: '/admin/user-list' })} className="ms-2">
        Vaata kasutajaid
      </Button>

      <Button onClick={() => navigate({ to: '/admin/media-by-author' })} className="ms-2">
        Vaata meedia tehinguid
      </Button>
    </div>
  );
}
