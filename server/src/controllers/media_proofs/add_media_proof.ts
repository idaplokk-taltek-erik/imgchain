import { z } from 'zod';
import { db } from '../../db/db';
import { MediaProofBase } from '../../schema/media_proof';
import { ulid } from 'ulid';
import { env } from '../../lib/env';
import {
  protectedProcedure,
  protectedOpenApiProcedure,
} from '../../lib/trpc/trpc';

// Ühine funktsioon mõlemale handlerile
const insertFn = async ({
  ctx,
  input,
}: {
  ctx: { user: { id: string } };
  input: z.infer<typeof MediaProofBase>;
}) => {
  await db
    .insertInto('media_proofs')
    .values({
      ...input,
      id: ulid(),
      author_id: ctx.user.id,
      solana_signer: env.SOLANA_SIGNER_PUBLIC_KEY,
    })
    .onConflict(col => col.doNothing())
    .execute();

  return { success: true };
};

// Reactis kasutamiseks (tavaline protectedProcedure)
export const addMediaProofHandler = protectedProcedure
.meta({
    openapi: {
      method: 'POST',
      path: '/media-proof/add',
      summary: 'Lisa uus kirje.',
      description: 'Salvestab metaandmed andmebaasi.',
      tags: ['Meediatõendid'],
    },
  })
  .input(MediaProofBase)
  .output(z.object({ success: z.boolean() }))
  .mutation(insertFn);

/* // Swagger UI jaoks (POST + OpenAPI meta)
export const addMediaProofOpenApiHandler = protectedOpenApiProcedure
  .meta({
    openapi: {
      method: 'POST',
      path: '/media-proof/add',
      summary: 'Lisa esialgsed andmed andmebaasi.',
      tags: ['media_proof'],
    },
  })
  .input(MediaProofBase)
  .output(z.object({ success: z.boolean() }))
  .mutation(insertFn); */
