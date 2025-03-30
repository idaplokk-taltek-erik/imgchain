import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { betterAuth } from '../auth/better_auth';

export async function createRequestContext({
  req,
  res,
}: CreateFastifyContextOptions) {
  const sessionAndUser = await betterAuth.api.getSession({
    headers: req.raw.headers as any,
  });

  return {
    req,
    res,
    user: sessionAndUser?.user ?? null,
    session: sessionAndUser?.session ?? null,
  };
}

export type RequestContext = Awaited<ReturnType<typeof createRequestContext>>;
