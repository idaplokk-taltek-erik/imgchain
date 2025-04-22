import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('media_proofs')
    .addColumn('image_url', 'text', (col) => col)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('media_proofs')
    .dropColumn('image_url')
    .execute();
}
