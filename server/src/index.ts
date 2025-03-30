require('dotenv').config();
import 'zod-openapi/extend';

import fastify from 'fastify';
import { registerTRPCRoutes } from './api_trpc/configure_fastify';

const server = fastify({
  maxParamLength: 5000,
  logger: true,
});

(async () => {
  try {
    await registerTRPCRoutes(server);

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
