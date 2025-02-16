import { createUserInput, user } from 'lib';
import { publicProcedure } from '../../api_trpc/trpc';
import { createUser } from '../../models/user_modal';

export const createUserHandler = publicProcedure
  .input(createUserInput)
  .output(user)

  .mutation(async ({ input }) => {
    const newUser = await createUser(input);
    if (!newUser) {
      throw new Error('Failed to create user!');
    }

    return newUser;
  });
