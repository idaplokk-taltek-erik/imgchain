import { z } from 'zod';
import { publicProcedure } from '../../api_trpc/trpc';
import { setCookie } from '../../lib/auth';

export const createLogoutHandler = publicProcedure
  .input(z.null().optional())
  .output(z.null().optional())

  .mutation(async ({ ctx }) => {
    try {
      setCookie(ctx.res, 'token', '', {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: -1,
      });
      return undefined;
    } catch (err) {
      console.error('Failed to logout', err);

      throw undefined;
    }
  });
