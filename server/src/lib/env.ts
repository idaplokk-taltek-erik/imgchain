require('dotenv').config();

import { z } from "zod";

export const env = z.object({
  SOLANA_SECRET_KEY_ARRAY: z.array(z.number()),
  SOLANA_MEMO_PROGRAM_ID: z.string(),
  SOLANA_RPC_URL: z.string(),
  SOLANA_SIGNER_PUBLIC_KEY: z.string(),

  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),

  GOOGLE_AUTH_CLIENT_ID: z.string(),
  GOOGLE_AUTH_CLIENT_SECRET: z.string(),
}).parse({
  SOLANA_SECRET_KEY_ARRAY: JSON.parse(process.env.SOLANA_SECRET_KEY_ARRAY ?? 'null'),
  SOLANA_MEMO_PROGRAM_ID: process.env.SOLANA_MEMO_PROGRAM_ID,
  SOLANA_SIGNER_PUBLIC_KEY: process.env.SOLANA_SIGNER_PUBLIC_KEY,
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,

  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  
  GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID,
  GOOGLE_AUTH_CLIENT_SECRET: process.env.GOOGLE_AUTH_CLIENT_SECRET,
})