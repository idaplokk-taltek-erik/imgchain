import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { LoginModal } from '../components/login_modal';
import AppLayout from '../components/layout';

export interface MyRouterContext {
  test: true
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootRoute,
});

function RootRoute() {
  return (
    <AppLayout>
      <Outlet />
      <LoginModal />
      <TanStackRouterDevtools />
    </AppLayout>
  );
}
