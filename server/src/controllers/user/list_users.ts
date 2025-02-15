import { user } from 'lib';
import { z } from 'zod';
import { publicProcedure } from '../../api_trpc/trpc';
import { getUsers } from '../../models/user_modal';

export const listUsersHandler = publicProcedure
  .meta({ openapi: { method: 'GET', path: '/users' } })

  .input(z.undefined())
  .output(z.array(user))

  .query(async () => {
    return await getUsers();
  });
