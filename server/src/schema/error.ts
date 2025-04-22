import { z } from 'zod';

export const fieldError = z.object({
  field: z.string(),
  message: z.string(),
});

export type FieldError = z.infer<typeof fieldError>;
