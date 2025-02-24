import { Theme } from '@radix-ui/themes';
import { createRootRoute, Outlet } from '@tanstack/react-router';
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
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <Theme appearance="dark" accentColor="gold" scaling="105%" radius="small">
        <Outlet />
      </Theme>
      <TanStackRouterDevtools />
    </>
  ),
});
