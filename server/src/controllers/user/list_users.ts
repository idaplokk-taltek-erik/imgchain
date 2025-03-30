import { z } from 'zod';
import { protectedProcedure } from '../../api_trpc/trpc';
import { getUsers } from '../../models/user_modal';
import { user } from '../../schema/user';

export const listUsersHandler = protectedProcedure
  .input(z.undefined().optional)
  .output(z.array(user))

  .query(async () => {
    const users = await getUsers();

    return users;
  });
