import bcrypt from 'bcryptjs';
import { publicProcedure } from '../../api_trpc/trpc';
import { encodeSessionCookie, setCookie } from '../../lib/auth';
import { getUserByEmail, insertUser } from '../../models/user_modal';
import { registerInput, registerOutput } from '../../schema/auth';

export const createRegisterHandler = publicProcedure
  .input(registerInput)
  .output(registerOutput)

  .mutation(async ({ input, ctx }) => {
    const existingUser = await getUserByEmail(input.email);

    if (existingUser) {
      return {
        success: false,
        errors: [{ field: 'email', message: 'Email already in use!' }],
      };
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    try {
      const newUser = await insertUser({
        email: input.email,
        password_hash: hashedPassword,
      });

      const token = encodeSessionCookie({
        user_id: newUser.id,
      });

      setCookie(ctx.res, 'token', token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 14, // 14 days
      });
    } catch (err) {
      console.error(err);

      return {
        success: false,
        errors: [{ field: 'unknown', message: 'Internal Server Error' }],
      };
    }

    return {
      success: true,
      errors: [],
    };
  });
