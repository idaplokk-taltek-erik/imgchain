import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Card } from 'antd';
import AppLayout from '../components/layout';
import { LoginForm } from '../components/login_form';
import { useSession } from '../lib/auth_client';

export const Route = createFileRoute('/_authenticated')({
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

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
