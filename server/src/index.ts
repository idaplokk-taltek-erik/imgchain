require('dotenv').config();
import 'zod-openapi/extend';

import fastify from 'fastify';
import { registerTRPCRoutes } from './lib/trpc/trpc_fastify';
import { betterAuthFastify } from './lib/auth/better_auth_fastify';
import { registerOpenApi } from './lib/api_docs/openapi_fastify';

const server = fastify({
  maxParamLength: 5000,
  logger: true,
});

(async () => {
  try {
    server.register(betterAuthFastify);
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
