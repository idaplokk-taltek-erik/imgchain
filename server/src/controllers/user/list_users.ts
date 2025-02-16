import { user } from 'lib';
import { z } from 'zod';
import { publicProcedure } from '../../api_trpc/trpc';
import { getUsers } from '../../models/user_modal';

export const listUsersHandler = publicProcedure
  .input(z.any())
  .output(z.array(user))

  .query(async () => {
    return await getUsers();
  });
