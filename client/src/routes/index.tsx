import { createFileRoute, redirect } from '@tanstack/react-router';
import { Button } from 'antd';

export const Route = createFileRoute('/')({
  component: Index,
  beforeLoad({ context, location }) {
    if (!context.user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
});

function Index() {
  return (
    <div>
      {' '}
      <div style={{ padding: 20 }}>
        <h1>Home Page</h1>
        <Button type="primary">Ant Design Button</Button>
      </div>
    </div>
  );
}

export default Index;
