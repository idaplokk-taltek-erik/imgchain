import { betterAuth } from './better_auth';
import { toNodeHandler } from 'better-auth/node';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { HttpHeader } from 'fastify/types/utils';

export type Headers = Record<
  HttpHeader,
  string | number | string[] | undefined
>;

function mapHeaders(headers: Headers) {
  const entries = Object.entries(headers);
  const map = new Map();
  for (const [headerKey, headerValue] of entries) {
    if (headerValue != null) {
      map.set(headerKey, headerValue);
    }
  }
  return map;
}

async function betterAuthPlugin(fastify: FastifyInstance) {
  fastify.decorate('auth', betterAuth);

  await fastify.register((fastify) => {
    const authHandler = toNodeHandler(betterAuth);

    fastify.addContentTypeParser(
      'application/json',
      /* c8 ignore next 3 */
      (_request, _payload, done) => {
        done(null, null);
      },
    );

    fastify.all('/api/auth/*', async (request, reply) => {
      reply.raw.setHeaders(mapHeaders(reply.getHeaders()));
      await authHandler(request.raw, reply.raw);
    });
  });
}

export const betterAuthFastify = fp(betterAuthPlugin, {
  fastify: '5.x',
  name: 'fastify-better-auth',
});
