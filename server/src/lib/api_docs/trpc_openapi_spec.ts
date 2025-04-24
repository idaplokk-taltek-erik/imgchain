import { createDocument } from 'zod-openapi';

import { appRouter } from '../../trpc_router';

const paths: Record<string, any> = {};
const toProcess = Object.entries(appRouter._def.procedures);

for (const [name, procedureUntyped] of toProcess) {
  if (!('_def' in procedureUntyped)) {
    toProcess.push(...(Object.entries(procedureUntyped) as any));
    continue;
  }

  const procedure: any = procedureUntyped;
  const method = procedure._def.type === 'mutation' ? 'post' : 'get';
  const path = `/trpc/${name}`;

  paths[path] = {
    [method]: {
      summary: `tRPC procedure: ${name}`,
      operationId: name,
      ...(method === 'post'
        ? {
            requestBody:
              procedure._def.inputs.length > 0
                ? {
                    content: {
                      'application/json': {
                        schema: procedure._def.inputs[0],
                      },
                    },
                  }
                : undefined,
          }
        : {
            parameters:
              procedure._def.inputs.length > 0
                ? Object.entries(procedure._def.inputs[0].shape ?? {}).map(
                    ([key, schema]) => ({
                      name: key,
                      in: 'query',
                      required: (schema as any).isRequired ?? true,
                      schema: (schema as any)._def,
                      description: `Query parameter for ${key}`,
                    }),
                  )
                : [],
          }),
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: procedure._def.output || { type: 'object' },
            },
          },
        },
      },
    },
  };
}

export const openApiDocsTRPC = createDocument({
  openapi: '3.1.0',
  info: {
    title: 'Media Proof API',
    version: '1.0.0',
    description:
      'API meediafailide räside turvaliseks salvestamiseks, kontrollimiseks ja Solana plokiahelas allkirjastamiseks.',
  },
  paths,
});

// https://github.com/better-auth/better-auth/issues/1153
// const authSchema = (await auth.api.generateOpenAPISchema()) as Swagger.SwaggerV3;

// const mergeResult = merge([
//   {
//     oas: honoSpecs,
//   },
//   {
//     oas: authSchema,
//     pathModification: {
//       prepend: "/api/auth",
//     },
//   },
// ]);
