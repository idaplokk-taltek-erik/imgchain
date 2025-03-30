import bcrypt from 'bcryptjs';
import { publicProcedure } from '../../api_trpc/trpc';
import { db } from '../../db/db';
import { encodeSessionCookie, setCookie } from '../../lib/auth';
import { loginInput, loginOutput } from '../../schema/auth';

export const createLoginHandler = publicProcedure
  .input(loginInput)
  .output(loginOutput)

  .mutation(async ({ input, ctx }) => {
    const user = await db
      .selectFrom('user')
      .where('email', '=', input.email)
      .select(['password_hash', 'id'])
      .executeTakeFirst();

    // TODO sleep for some time so that login endpoint could not be used for finding already existing users
    // it can be determined from response time if user was found and the bcrypt used vs if the user was not found
    if (!user || !(await bcrypt.compare(input.password, user.password_hash))) {
      return {
        success: false,
      };
    }

    const token = encodeSessionCookie({
      user_id: user.id,
    });

    setCookie(ctx.res, 'token', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });

    return {
      success: true,
    };
  });
