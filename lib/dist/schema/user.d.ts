import { z } from 'zod';
export declare const user: z.ZodObject<{
    id: z.ZodNumber;
    email: z.ZodString;
    created_at: z.ZodDate;
    updated_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    email: string;
    id: number;
    created_at: Date;
    updated_at: Date;
}, {
    email: string;
    id: number;
    created_at: Date;
    updated_at: Date;
}>;
export declare const createUserInput: z.ZodObject<{
    email: z.ZodString;
    password_hash: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password_hash: string;
}, {
    email: string;
    password_hash: string;
}>;
export type User = z.infer<typeof user>;
export type CreateUserInput = z.infer<typeof createUserInput>;
