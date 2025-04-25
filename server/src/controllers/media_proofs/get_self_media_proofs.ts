import { z } from 'zod';
import { db } from '../../db/db';
import { protectedProcedure } from '../../lib/trpc/trpc';
import { MediaProof } from '../../schema/media_proof';

export const getSelfMediaProofsQueryHandler = protectedProcedure
  .meta({
    description: 'Sisse logitud kasutaja alusel otsimine.',
  })
  .output(z.array(MediaProof))
  .query(async ({ ctx }) => {
    return await db
      .selectFrom('media_proofs')
      .selectAll()
      .where('author_id', '=', ctx.user.id)
      .execute();
  });
