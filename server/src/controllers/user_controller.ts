import { router } from '../api_trpc/trpc';
import { createUserHandler } from './user/create_user';
import { listUsersHandler } from './user/list_users';

export const userRouter = router({
  create: createUserHandler,
  list: listUsersHandler,
});
