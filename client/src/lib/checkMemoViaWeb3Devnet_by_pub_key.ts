import { Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58'; // Memode dekrüpteerimine

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function checkMemoViaWeb3Devnet_by_pub_key(signerAddress: string, hash: string) {
  const connection = new Connection('https://api.devnet.solana.com');
  const publicKey = new PublicKey(signerAddress);
  const expectedMemo = `MediaProof:${hash}`;
  const memoProgramId = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

  console.log(`Kontrollin Devnet tehinguid aadressilt/autorilt: ${signerAddress}`);
  console.log(`Otsin memo: ${expectedMemo}`);

  try {
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 1000 }); // siin piiranguks 1000 - tasulise API-ga saaks rohkem ja kiiremini
    console.log(`Leitud kirjeid: ${signatures.length}`);

    for (const sig of signatures) {
      await delay(100); // throttle API-päringuid
      const tx = await connection.getTransaction(sig.signature, { commitment: 'confirmed' });

      if (!tx || !tx.transaction || !tx.transaction.message) continue;

      const { instructions, accountKeys } = tx.transaction.message;

      for (const ix of instructions) {
        try {
          const programId = accountKeys[ix.programIdIndex]?.toBase58?.() || '(unknown)';
          const rawData = ix.data;
          //console.log(`Instruktsioon: programId=${programId}, rawData=${rawData}`);

          if (programId === memoProgramId && rawData) {
            try {
              const memoBytes = bs58.decode(rawData);
              const memoText = new TextDecoder().decode(memoBytes);

              console.log(`Memo sisu: ${memoText}`);

              if (memoText === expectedMemo) {
                return {
                  found: true,
                  signature: sig.signature,
                  timestamp: sig.blockTime || null,
                };
              }
            } catch (err: any) {
              console.warn(`Memo dekodeerimise viga: ${err.message}`);
            }
          }
        } catch (err: any) {
          console.warn('Instruktsiooni viga:', err.message);
        }
      }
    }

    return { found: false };
  } catch (err) {
    console.error('Devnet memo kontrolli viga:', err);
    return { found: false };
  }
}
