import 'zod-openapi/extend';
import './lib/env';

import fastifyStatic from '@fastify/static';
import fastify from 'fastify';
import path from 'path';
import { registerUploadImageRoute } from './controllers/media_proofs/upload_image';
import { registerOpenApi } from './lib/api_docs/openapi_fastify';
import { betterAuthFastify } from './lib/auth/better_auth_fastify';
import { registerTRPCRoutes } from './lib/trpc/trpc_fastify';

const server = fastify({
  maxParamLength: 5000,
  logger: true,
});

(async () => {
  try {
    server.register(fastifyStatic, {
      root: path.join(__dirname, '../uploads'),
      prefix: '/uploads/', // This means files will be accessible at /uploads/filename.ext
    });

    server.register(betterAuthFastify);

    registerUploadImageRoute(server);

    await registerTRPCRoutes(server);

    registerOpenApi(server);

    await server.listen({ port: 3000 });

    server.ready((err) => {
      if (err) throw err;
      console.log(`Server listening on port 3000`);
      console.log(server.printRoutes());
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
