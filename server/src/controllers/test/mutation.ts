import { z } from 'zod';
import { protectedProcedure } from '../../lib/trpc/trpc';

export const testMutationHandler = protectedProcedure
  .input(z.void().optional)
  .output(z.object({ success: z.boolean() }))

  .mutation(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
    };
  });
