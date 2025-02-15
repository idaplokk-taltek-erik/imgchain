import { userRouter } from '../controllers/user_controller';
import { router } from './trpc';

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
