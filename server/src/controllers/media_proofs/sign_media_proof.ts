import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from '../../db/db';
import { env } from '../../lib/env';
import {
  protectedOpenApiProcedure,
  protectedProcedure,
} from '../../lib/trpc/trpc';
import { MediaProof } from '../../schema/media_proof';

const connection = new Connection(env.SOLANA_RPC_URL, 'confirmed');
const MEMO_PROGRAM_ID = new PublicKey(env.SOLANA_MEMO_PROGRAM_ID);
const fromKeypair = Keypair.fromSecretKey(
  new Uint8Array(env.SOLANA_SECRET_KEY_ARRAY),
);
const publicKey = fromKeypair.publicKey;

const inputSchema = z.object({ hash: z.string() });

// Ühine funktsioon mõlemale handlerile
const signAndStore = async ({ input }: { input: { hash: string } }) => {
  const mediaProof = await db
    .selectFrom('media_proofs')
    .selectAll()
    .where('hash', '=', input.hash)
    .executeTakeFirst();

  if (!mediaProof) {
    throw new TRPCError({
      message: 'Ei eksisteeri sellist pilti/andmeid.',
      code: 'BAD_REQUEST',
    });
  }
  if (mediaProof.solana_txid) {
    throw new TRPCError({
      message: 'See pilt on juba registreeritud.',
      code: 'BAD_REQUEST',
    });
  }
  try {
    const solana_txid = await signHashInSolana(input.hash);
    const result = await db
      .updateTable('media_proofs')
      .set({ solana_txid })
      .where('hash', '=', input.hash)
      .returningAll()
      .executeTakeFirst();

    return result!;
  } catch (err: unknown) {
    throw new TRPCError({
      message: err instanceof Error ? err.message : `${err}`,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
};

// Reactis kasutamiseks (tavaline protectedProcedure)
export const signMediaProofHandler = protectedProcedure
  .meta({
    description: 'Salvesta pildi tehingu id.',
  })
  .input(inputSchema)
  .output(MediaProof)
  .query(signAndStore);

export async function signHashInSolana(hash: string): Promise<string> {
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
