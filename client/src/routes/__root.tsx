import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export interface MyRouterContext {
  test: true;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootRoute,
});

function RootRoute() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
