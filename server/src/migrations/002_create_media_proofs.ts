import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS media_proofs (
      id TEXT NOT NULL PRIMARY KEY,
      hash TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      author_id TEXT NOT NULL,        -- Meie süsteemi kasutajatunnus
      solana_signer TEXT NOT NULL,    -- Solana tehingu algataja
      solana_txid TEXT,               -- Solana tehingu ID (Signer solscan-is nt.)
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('media_proofs').execute();
}
