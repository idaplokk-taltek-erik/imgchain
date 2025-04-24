import { Connection } from '@solana/web3.js';
import bs58 from 'bs58';

export async function checkMemoViaWeb3Devnet_TX_ID(signature, hash) {
  const connection = new Connection('https://api.devnet.solana.com');
  const expectedMemo = `MediaProof:${hash}`;
  const memoProgramId = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

  console.log(`Kontrollin Devnet tehingut: ${signature}`);
  console.log(`Otsin memo: ${expectedMemo}`);

  try {
    const tx = await connection.getTransaction(signature, { commitment: 'confirmed' });

    if (!tx || !tx.transaction || !tx.transaction.message) {
      console.warn('Tehing puudub või pole veel kinnitatud.');
      return { found: false };
    }

    const { instructions, accountKeys } = tx.transaction.message;

    for (const ix of instructions) {
      try {
        const programId = accountKeys[ix.programIdIndex]?.toBase58?.() || '(unknown)';
        const rawData = ix.data;

        if (programId === memoProgramId && rawData) {
          try {
            const memoBytes = bs58.decode(rawData);
            const memoText = new TextDecoder().decode(memoBytes);

            console.log(`Leitud memo sisu: ${memoText}`);

            if (memoText === expectedMemo) {
              return {
                found: true,
                signature,
                timestamp: tx.blockTime || null,
              };
            }
          } catch (err) {
            console.warn(`Memo dekodeerimise viga: ${err.message}`);
          }
        }
      } catch (err) {
        console.warn('Instruktsiooni viga:', err.message);
      }
    }

    return { found: false };
  } catch (err) {
    console.error('Devnet memo kontrolli viga:', err);
    return { found: false };
  }
}
