import { z } from 'zod';
import { db } from '../../db/db';
import { protectedProcedure } from '../../lib/trpc/trpc';
import { env } from '../../lib/env';

const solanaSignerPublicKey = 'asdf';

export const signMediaProofHandler = protectedProcedure
  .input(z.object({ hash: z.string() }))
  .output(z.object({ success: z.boolean() }))

  .mutation(async ({ ctx, input }) => {
    const mediaProof = await db
      .selectFrom('media_proofs')
      .where('hash', '=', input.hash)
      .executeTakeFirst();

    if (!mediaProof) {
      return { success: false };
    }

    console.log("Signing with", env.SOLANA_SECRET_KEY_ARRAY);

    return {
      success: true,
    };
  });
