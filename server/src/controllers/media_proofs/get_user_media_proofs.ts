import { z } from 'zod';
import { db } from '../../db/db';
import { protectedProcedure } from '../../lib/trpc/trpc';
import { MediaProof } from '../../schema/media_proof';

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
  .meta({
    description: 'Sisse logitud kasutaja alusel otsimine.',
  })
  .output(z.array(MediaProof))
  .query(queryFn);
