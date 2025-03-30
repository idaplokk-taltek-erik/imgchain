import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { LoginModal } from '../components/login_modal';
import AppLayout from '../components/layout';
// import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
/**
   <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/welcome" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
 */
export interface MyRouterContext {}

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
