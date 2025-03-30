import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { decodeSessionCookie } from '../lib/auth';

export async function createRequestContext({
  req,
  res,
}: CreateFastifyContextOptions) {
  const { user } = await decodeSessionCookie(req)
  return { req, res, user };
}

export type RequestContext = Awaited<ReturnType<typeof createRequestContext>>;
