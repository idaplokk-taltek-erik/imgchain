import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import { FastifyInstance } from 'fastify';
import { createRequestContext } from './context';
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

  // // @ts-ignore
  // fastify.register(fastifySwagger, {
  //   swagger: openApiDocument,
  // });

  // // @ts-ignore
  // fastify.register(fastifySwaggerUi, {
  //   routePrefix: '/docs',
  //   staticCSP: true,
  //   exposeRoute: true,
  //   uiConfig: {
  //     docExpansion: 'list',
  //   },
  // });

  // return new Promise((resolve, reject) => {
  //   fastifyTRPCOpenApiPlugin(
  //     fastify,
  //     {
  //       basePath: '/rest',
  //       router: appRouter,
  //       createContext: createRequestContext,
  //       onError({ path, error }) {
  //         // report to error monitoring
  //         console.error(
  //           `Error in fastifyTRPCOpenApiPlugin on path '${path}':`,
  //           error,
  //         );
  //       },
  //     },
  //     (err) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(undefined);
  //       }
  //     },
  //   );
  // });
}
