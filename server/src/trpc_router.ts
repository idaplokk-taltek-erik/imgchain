import { testQueryHandler } from './controllers/test/query';
import { testMutationHandler } from './controllers/test/mutation';
import { router } from './lib/trpc/trpc';

export const appRouter = router({
  test: router({
    query: testQueryHandler,
    mutation: testMutationHandler,
  }),
});

export type AppRouter = typeof appRouter;
