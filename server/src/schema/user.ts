import { z } from 'zod';

export const user = z.object({
  id: z.number(),
  email: z.string().email(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type User = z.infer<typeof user>;
