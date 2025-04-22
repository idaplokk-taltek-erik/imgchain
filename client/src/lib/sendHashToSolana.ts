import {
  Keypair,
  Connection,
  Transaction,
  TransactionInstruction,
  PublicKey,
} from '@solana/web3.js';

const connection = new Connection(import.meta.env.VITE_SOLANA_RPC_URL, 'confirmed');
const MEMO_PROGRAM_ID = new PublicKey(import.meta.env.VITE_MEMO_PROGRAM_ID);
const secret = JSON.parse(import.meta.env.VITE_SECRET_KEY_ARRAY);


export const fromKeypair = Keypair.fromSecretKey(new Uint8Array(secret));
export const publicKey = fromKeypair.publicKey;

export async function sendHashToSolana(hash: string) {
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
