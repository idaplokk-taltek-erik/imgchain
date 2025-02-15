import { generateOpenApiDocument } from 'trpc-to-openapi';
import { appRouter } from './router';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Generated REST API from tRPC',
  version: '1.0.0',
  baseUrl: 'http://localhost:3000/rest/',
});

(openApiDocument as any).host = "localhost:3000/rest/"
