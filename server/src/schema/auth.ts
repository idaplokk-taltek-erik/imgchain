import { z } from 'zod';
import { fieldError } from './error';

export const loginInput = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginInput = z.infer<typeof loginInput>;

export const loginOutput = z.object({
  success: z.boolean(),
});
export type LoginOutput = z.infer<typeof loginOutput>;

export const registerInput = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type RegisterInput = z.infer<typeof registerInput>;

export const registerOutput = z.object({
  success: z.boolean(),
  errors: z.array(fieldError),
});
export type registerOutput = z.infer<typeof registerOutput>;
