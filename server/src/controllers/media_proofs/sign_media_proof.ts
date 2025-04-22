import { z } from 'zod';
import { db } from '../../db/db';
import { env } from '../../lib/env';
import { protectedProcedure } from '../../lib/trpc/trpc';

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

export const signMediaProofHandler = protectedProcedure
  .input(z.object({ hash: z.string() }))
  .output(
    z.object({
      success: z.boolean(),
      error_message: z.string().optional(),
      solana_txid: z.string().optional(),
    }),
  )

  .mutation(async ({ ctx, input }) => {
    const mediaProof = await db
      .selectFrom('media_proofs')
      .selectAll()
      .where('hash', '=', input.hash)
      .executeTakeFirst();

    console.log({ mediaProof });

    if (!mediaProof) {
      return { success: false, error_message: 'Media proof does not exist' };
    }

    try {
      const solana_txid = await signHashInSolana(input.hash);
      const result = await db
        .updateTable('media_proofs')
        .set({
          solana_txid,
        })
        .where('hash', '=', input.hash)
        .executeTakeFirst();

      return {
        success: true,
        solana_txid,
      };
    } catch (err: unknown) {
      return {
        success: false,
        error_message: err instanceof Error ? err.message : `${err}`,
      };
    }
  });

export async function signHashInSolana(hash: string): Promise<string> {
  const connection = new Connection(env.SOLANA_RPC_URL, 'confirmed');
  const MEMO_PROGRAM_ID = new PublicKey(env.SOLANA_MEMO_PROGRAM_ID);

  const fromKeypair = Keypair.fromSecretKey(
    new Uint8Array(env.SOLANA_SECRET_KEY_ARRAY),
  );
  const publicKey = fromKeypair.publicKey;

  const memoString = `MediaProof:${hash}`;

  const memoInstruction = new TransactionInstruction({
    keys: [],
    programId: MEMO_PROGRAM_ID,
    data: new TextEncoder().encode(memoString) as any,
  });

  const transaction = new Transaction().add(memoInstruction);
  transaction.feePayer = publicKey;

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  transaction.sign(fromKeypair);

  const txid = await connection.sendRawTransaction(transaction.serialize());
  await connection.confirmTransaction(txid, 'confirmed');

  return txid;
}
