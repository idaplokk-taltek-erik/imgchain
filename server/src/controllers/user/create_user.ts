import { publicProcedure } from '../../api_trpc/trpc';
import { createUser } from '../../models/user_modal';
import { createUserInput, user } from '../../schema/user';

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
