import { createLoginHandler } from '../controllers/auth/login';
import { createLogoutHandler } from '../controllers/auth/logout';
import { createRegisterHandler } from '../controllers/auth/register';
import { listUsersHandler } from '../controllers/user/list_users';
import { router } from './trpc';

export const appRouter = router({
  user: router({
    list: listUsersHandler,
  }),
  auth: router({
    register: createRegisterHandler,
    login: createLoginHandler,
    logout: createLogoutHandler,
  }),
});



export type AppRouter = typeof appRouter;
