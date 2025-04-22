import { z } from 'zod';
import { db } from '../../db/db';
import { protectedProcedure } from '../../lib/trpc/trpc';
import { MediaProof } from '../../schema/media_proof';

export const getMediaProofsByHashQueryHandler = protectedProcedure
  .input(z.object({ hash: z.string() }))
  .output(MediaProof.or(z.null()))

  .query(async ({ ctx, input }) => {
    const result =
      (await db
        .selectFrom('media_proofs')
        .selectAll()
        .where('hash', '=', input.hash)
        .executeTakeFirst()) ?? null;

    return result;
  });
