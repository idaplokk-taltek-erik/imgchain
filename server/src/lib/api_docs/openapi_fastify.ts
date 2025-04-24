import { FastifyInstance } from 'fastify';
import { appRouter } from '../../trpc_router';
import { betterAuth } from '../auth/better_auth';
import { renderTrpcPanel } from 'trpc-ui';

export function registerOpenApi(fastify: FastifyInstance) {
  fastify.get('/docs', async (_, reply) => {

    return reply.header('Content-Type', 'text/html').send(
      renderTrpcPanel(appRouter, {
        url: 'http://localhost:3000/trpc', // Base url of your trpc server
        meta: {
          title: 'Media proofs API',
          description:
            'This API allows checking if an image is registered in the SOLANA chain.',
        },
      }),
    );
  });


  fastify.get('/openapi-auth.json', async (_, reply) => {
    const betterAuthDocs = await betterAuth.api.generateOpenAPISchema();

    reply.send(betterAuthDocs);
  });

  // Serve Swagger UI
  fastify.get('/docs-auth', async (_, reply) => {
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
              url: '/openapi-auth.json',
              dom_id: '#swagger-ui',
            });
          };
        </script>
      </body>
      </html>
    `);
  });
}
