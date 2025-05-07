import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useSession } from '../lib/auth_client';
import { Alert, Card } from 'antd';
import { LoginForm } from '../components/login_form';
import AppLayout from '../components/layout';

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
});

function RouteComponent() {
  const session = useSession();

  if (session.isPending) {
    return 'Loading...';
  }

  if (!session.data) {
    return (
      <Card style={{ padding: '10em 3em' }}>
        <LoginForm />
      </Card>
    );
  }

  if (session.data.user.role !== 'admin') {
    return (
      <AppLayout>
        <Alert type="warning" message="Page not found" />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
