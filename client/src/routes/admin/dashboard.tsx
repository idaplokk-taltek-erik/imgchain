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
      <h2 className="mb-4">Admin Dashboard</h2>
      <Button onClick={() => navigate({ to: '/admin/user-list' })} className="ms-2">
        All users
      </Button>

      <Button onClick={() => navigate({ to: '/admin/proofs-by-user' })} className="ms-2">
        Uploads by user
      </Button>

{/*       <Button onClick={() => navigate({ to: '/admin/ban-user' })} className="ms-2">
        BAN/UNBAN
      </Button> */} {/* Ei tööta korrektselt hetkel */}
    </div>
  );
}
