import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { publicProcedure } from '../lib/trpc/trpc';

export const loginHandler = publicProcedure
  .input(z.object({ email: z.string(), password: z.string() }))
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const response = await fetch(
      'http://localhost:3000/api/auth/sign-in/email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: ctx.req.headers.cookie || '',
        },
        body: JSON.stringify({
          email: input.email,
          password: input.password,
        }),
      },
    );

    // Forward the cookie manually
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      ctx.res.header('Set-Cookie', setCookie);
    }

    if (!response.ok) {
      throw new TRPCError({
        message: 'Failed to log in',
        code: 'BAD_REQUEST',
      });
    }

    return null;
  });

export const logoutHandler = publicProcedure
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    await fetch('http://localhost:3000/api/auth/sign-out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: ctx.req.headers.cookie || '',
      },
      body: JSON.stringify({}),
    });

    return null;
  });
