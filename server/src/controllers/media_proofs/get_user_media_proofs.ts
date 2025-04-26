import { z } from 'zod';
import { db } from '../../db/db';
import { adminProcedure } from '../../lib/trpc/trpc';
import { MediaProof } from '../../schema/media_proof';

export const getMediaProofsByAuthorQueryHandler = adminProcedure
  .meta({
    description: 'Kasutaja alusel otsimine. Ligipääs nõuab privileege!',
  })
  .input(
    z
      .string()
      .describe(
        'author_id, e.g. user@user.ee (EuOelwL92zwfw3sRbCswRH5Q0Zhasiyk); admin@admin.ee (ipK9W8smUti9Ei4SaIL5QsP2gk4t4c7a); test@test.ee (SFKT1ahJ7ZAN41Ay41V9QF5aroRt90du)',
      ),
  )
  .output(z.array(MediaProof))
  .query(async ({ ctx, input }) => {
    return await db
      .selectFrom('media_proofs')
      .selectAll()
      .where('author_id', '=', input)
      .execute();
  });
