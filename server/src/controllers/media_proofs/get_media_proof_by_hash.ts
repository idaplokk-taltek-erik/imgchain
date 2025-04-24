import { z } from 'zod';
import { db } from '../../db/db';
import { protectedProcedure } from '../../lib/trpc/trpc';
import { MediaProof } from '../../schema/media_proof';

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
  .meta({ description: 'Räsikoodi alusel otsimine.' })
  .input(inputSchema)
  .output(MediaProof.or(z.null()))
  .query(queryFn);
