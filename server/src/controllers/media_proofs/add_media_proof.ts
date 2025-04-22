import { z } from 'zod';
import { db } from '../../db/db';
import { protectedProcedure } from '../../lib/trpc/trpc';
import { MediaProofBase } from '../../schema/media_proof';
import { ulid } from 'ulid';
import { env } from '../../lib/env';

export const addMediaProofHandler = protectedProcedure
  .input(MediaProofBase)
  .output(z.object({ success: z.boolean() }))

  .mutation(async ({ ctx, input }) => {
    const insertedMediaProof = await db
      .insertInto('media_proofs')
      .values({
        ...input,
        id: ulid(),
        author_id: ctx.user.id,
        solana_signer: env.SOLANA_SIGNER_PUBLIC_KEY,
      })
      .onConflict(col => col.doNothing())
      .execute();

    return {
      success: true,
    };
  });
