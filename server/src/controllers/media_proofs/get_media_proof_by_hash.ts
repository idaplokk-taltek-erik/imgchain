import { z } from 'zod';
import { db } from '../../db/db';
import { MediaProof } from '../../schema/media_proof';
import {
  protectedProcedure,
  protectedOpenApiProcedure,
} from '../../lib/trpc/trpc';

const inputSchema = z.object({ hash: z.string() });

// Ühine funktsioon mõlemale handlerile
const queryFn = async ({ input }: { input: { hash: string } }) => {
  const result = await db
    .selectFrom('media_proofs')
    .selectAll()
    .where('hash', '=', input.hash)
    .executeTakeFirst();

  return result ?? null;
};

// Reactis kasutamiseks (tavaline protectedProcedure)
export const getMediaProofsByHashQueryHandler = protectedProcedure
  .input(inputSchema)
  .output(MediaProof.or(z.null()))
  .query(queryFn);

// Swagger UI jaoks (POST + OpenAPI meta)
export const getMediaProofsByHashOpenApiHandler = protectedOpenApiProcedure
  .meta({
    openapi: {
      method: 'POST',
      path: '/media-proof/by-hash',
      summary: 'Räsikoodi alusel otsimine.',
      tags: ['media_proof'],
    },
  })
  .input(inputSchema)
  .output(MediaProof.or(z.null()))
  .mutation(queryFn);
