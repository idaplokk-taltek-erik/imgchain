import { z } from 'zod';

export const fieldError = z.object({
  field: z.string(),
  message: z.string(),
});

export type FieldUser = z.infer<typeof fieldError>;
