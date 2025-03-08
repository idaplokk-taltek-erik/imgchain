import { z } from 'zod';
import { publicProcedure } from '../../api_trpc/trpc';
import { createUser, getUserByEmail } from '../../models/user_modal';
import { fieldError } from '../../schema/error';
import { createUserInput } from '../../schema/user';

export const createUserHandler = publicProcedure
  .input(createUserInput)
  .output(z.array(fieldError))

  .mutation(async ({ input }) => {
    const existingUser = await getUserByEmail(input.email);


    if (existingUser && existingUser.password_hash !== input.password_hash) {
      return [{ field: 'password', message: 'Invalid password!' }];
    }

    const newUser = await createUser(input);

    if (!newUser) {
      return [{ field: 'email', message: 'Email already in use!' }];
    }

    return [];
  });
