import { AppRouter } from '../../../server/src/trpc_router';

import { createTRPCClient, httpBatchLink } from '@trpc/client';

// @ts-expect-error oops trpcs
export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:4000/trpc',
    }),
  ],
});
