import { z } from 'zod';
import { db } from '../../db/db';
import { MediaProof } from '../../schema/media_proof';
import {
  protectedProcedure,
  protectedOpenApiProcedure,
} from '../../lib/trpc/trpc';

// Ühine funktsioon mõlemale handlerile
const queryFn = async ({ ctx }: { ctx: any }) => {
  return await db
    .selectFrom('media_proofs')
    .selectAll()
    .where('author_id', '=', ctx.user.id)
    .execute();
};

// Reactis kasutamiseks (tavaline protectedProcedure)
export const getUserMediaProofsQueryHandler = protectedProcedure
  .input(z.void().optional())
  .output(z.array(MediaProof))
  .query(queryFn);

// Swagger UI jaoks (POST + OpenAPI meta)
export const getUserMediaProofsOpenApiHandler = protectedOpenApiProcedure
  .meta({
    openapi: {
      method: 'POST',
      path: '/media-proof/user',
      summary: 'Kasutaja ID alusel otsimine.',
      tags: ['media_proof'],
    },
  })
  .input(z.object({ author_id: z.string() }))
  .output(z.array(MediaProof))
  .mutation(queryFn);