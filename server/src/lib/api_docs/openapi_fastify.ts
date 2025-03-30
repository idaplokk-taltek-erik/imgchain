import { FastifyInstance } from 'fastify';
import { betterAuth } from '../auth/better_auth';
import { openApiDocsTRPC } from './trpc_openapi_spec';

export function registerOpenApi(fastify: FastifyInstance) {
  fastify.get('/openapi.json', async (_, reply) => {
    reply.send(openApiDocsTRPC);
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
