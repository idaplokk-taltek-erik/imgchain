import { z } from 'zod';
import { db } from '../../db/db';
import { MediaProof } from '../../schema/media_proof';
import {
  protectedProcedure,
  protectedOpenApiProcedure,
} from '../../lib/trpc/trpc';

const inputSchema = z.object({ solana_txid: z.string() });

// Ühine funktsioon mõlemale handlerile
const queryFn = async ({ input }: { input: { solana_txid: string } }) => {
  return (
    (await db
      .selectFrom('media_proofs')
      .selectAll()
      .where('solana_txid', '=', input.solana_txid)
      .executeTakeFirst()) ?? null
  );
};

// Reactis kasutamiseks (tavaline protectedProcedure)
export const getMediaProofsByTxQueryHandler = protectedProcedure
  .input(inputSchema)
  .output(MediaProof.or(z.null()))
  .query(queryFn);

// Swagger UI jaoks (POST + OpenAPI meta)
export const getMediaProofsByTxOpenApiHandler = protectedOpenApiProcedure
  .meta({
    openapi: {
      method: 'POST',
      path: '/media-proof/by-tx',
      summary: 'Solana tehingu ID alusel otsimine.',
      tags: ['media_proof'],
    },
  })
  .input(inputSchema)
  .output(MediaProof.or(z.null()))
  .mutation(queryFn);