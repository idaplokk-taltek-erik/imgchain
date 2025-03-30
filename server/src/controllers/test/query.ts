import { z } from 'zod';
import { protectedProcedure } from '../../lib/trpc/trpc';

export const testQueryHandler = protectedProcedure
  .input(z.void().optional)
  .output(z.object({ success: z.boolean() }))

  .query(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
    };
  });
