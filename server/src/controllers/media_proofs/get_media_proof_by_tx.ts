import { z } from 'zod';
import { db } from '../../db/db';
import { protectedProcedure } from '../../lib/trpc/trpc';
import { MediaProof } from '../../schema/media_proof';

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
  .meta({ description: 'Solana tehingu ID alusel otsimine.' })
  .input(inputSchema)
  .output(MediaProof.or(z.null()))
  .query(queryFn);
