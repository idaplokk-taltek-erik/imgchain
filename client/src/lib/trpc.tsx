import { createTRPCReact } from '@trpc/react-query';
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

// @ts-expect-error oops trpcs
export const trpcHooks = createTRPCReact<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:4000/trpc',
    }),
  ],
});