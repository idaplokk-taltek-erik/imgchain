import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export function createRequestContext({ req, res }: CreateFastifyContextOptions) {
  const user = { name: req.headers.username ?? 'anonymous' };
  return { req, res, user };
}

export type RequestContext = Awaited<ReturnType<typeof createRequestContext>>;
