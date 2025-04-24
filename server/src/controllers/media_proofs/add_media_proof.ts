import { ulid } from 'ulid';
import { z } from 'zod';
import { db } from '../../db/db';
import { env } from '../../lib/env';
import { protectedProcedure } from '../../lib/trpc/trpc';
import { MediaProofBase } from '../../schema/media_proof';

// Ühine funktsioon mõlemale handlerile
const insertFn = async ({
  ctx,
  input,
}: {
  ctx: { user: { id: string } };
  input: z.infer<typeof MediaProofBase>;
}) => {
  await db
    .insertInto('media_proofs')
    .values({
      ...input,
      id: ulid(),
      author_id: ctx.user.id,
      solana_signer: env.SOLANA_SIGNER_PUBLIC_KEY,
    })
    .onConflict((col) => col.doNothing())
    .execute();

  return { success: true };
};

// Reactis kasutamiseks (tavaline protectedProcedure)
export const addMediaProofHandler = protectedProcedure
  .meta({ description: 'Lisab uue kirje.' })
  .input(MediaProofBase)
  .output(z.object({ success: z.boolean() }))
  .mutation(insertFn);
