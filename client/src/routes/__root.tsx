import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { User } from '../../../server/src/schema/user';
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
export interface MyRouterContext {
  // The ReturnType of your useAuth hook or the value of your AuthContext
  user: User;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
