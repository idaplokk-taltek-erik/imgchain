import { z } from 'zod';

export const user = z.object({
  id: z.number(),
  email: z.string().email(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const createUserInput = z.object({
  email: z.string().email(),
  password_hash: z.string(),
});

export type User = z.infer<typeof user>;
export type CreateUserInput = z.infer<typeof createUserInput>;
