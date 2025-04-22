import { z } from 'zod';
import { db } from '../../db/db';
import { protectedProcedure } from '../../lib/trpc/trpc';
import { MediaProof } from '../../schema/media_proof';

export const getMediaProofsByTxQueryHandler = protectedProcedure
  .input(z.object({ solana_txid: z.string() }))
  .output(MediaProof.or(z.null()))

  .query(async ({ ctx, input }) => {
    return await db
      .selectFrom('media_proofs')
      .selectAll()
      .where('solana_txid', '=', input.solana_txid)
      .executeTakeFirst() ?? null;
  });
