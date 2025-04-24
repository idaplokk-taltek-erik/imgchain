import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

// .openapi() toetus kõigile Zod skeemidele
extendZodWithOpenApi(z);

// Esialgse info skeem (POST /media-proof/add jaoks)
export const MediaProofBase = z
  .object({
    file_name: z.string(),
    file_size: z.number(),
    hash: z.string(),
    mime_type: z.string(),
  })
  .openapi({
    example: {
      file_name: 'foto.jpg',
      file_size: 123456,
      hash: 'abc123...',
      mime_type: 'image/jpeg',
    },
  });

export type MediaProofBase = z.infer<typeof MediaProofBase>;

// Täielik skeem koos andmebaasi ja plokiahela väljadega
export const MediaProof = MediaProofBase.extend({
  author_id: z.string(),
  created_at: z.string(),
  id: z.string(),
  mime_type: z.string().or(z.null()),
  solana_signer: z.string(),
  solana_txid: z.string().or(z.null()),
  image_url: z.string().or(z.null()),
}).openapi({
  example: {
    file_name: 'foto.jpg',
    file_size: 123456,
    hash: 'abc123...',
    mime_type: 'image/jpeg',
    author_id: 'ipK9W8smUti9Ei4SaIL5QsP2gk4t4c7a',
    created_at: '2025-04-24 12:00:00',
    id: '01JSM4Q8GEWT7E5W8PSZ1PVNJQ',
    solana_signer: '8bcELpz8LADEHZYPP5dc7resDKZsnYREh8bXhqS2VbDT',
    solana_txid: '4D66AfghFS6g7e7rzLLqYaPHf6LNXcfyzwqNUPLpKhNHEDGW6tDExQ...',
    image_url: '/uploads/foto.jpg',
  },
});

export type MediaProof = z.infer<typeof MediaProof>;

