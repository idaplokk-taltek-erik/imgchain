import { z } from 'zod';

export const MediaProofBase = z.object({
  file_name: z.string(),
  file_size: z.number(),
  hash: z.string(),
  mime_type: z.string(),
});
export type MediaProofBase = z.infer<typeof MediaProofBase>;

export const MediaProof = MediaProofBase.extend({
  author_id: z.string(),
  created_at: z.string().date(),
  id: z.string(),
  mime_type: z.string().or(z.null()),
  solana_signer: z.string(),
  solana_txid: z.string().or(z.null()),

})
export type MediaProof = z.infer<typeof MediaProof>;
