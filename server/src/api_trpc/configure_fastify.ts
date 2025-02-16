import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import { FastifyInstance } from 'fastify';
import { createRequestContext } from './context';
import openApiDoc from './openapi';
import { AppRouter, appRouter } from './router';

export async function registerTRPCRoutes(fastify: FastifyInstance) {
  fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: createRequestContext,
      onError({ path, error }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  });

  // Serve OpenAPI JSON
  fastify.get('/openapi.json', async (_, reply) => {
    reply.send(openApiDoc);
  });

  // Serve Swagger UI
  fastify.get('/docs', async (_, reply) => {
    reply.header('Content-Type', 'text/html');
    reply.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Swagger UI</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.min.js"></script>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: '/openapi.json',
            dom_id: '#swagger-ui',
          });
        };
      </script>
    </body>
    </html>
  `);
  });
}
