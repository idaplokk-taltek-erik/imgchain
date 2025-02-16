import { z } from 'zod';
import { publicProcedure } from '../../api_trpc/trpc';
import { getUsers } from '../../models/user_modal';
import { user } from '../../schema/user';

export const listUsersHandler = publicProcedure
  .input(z.undefined())
  .output(z.array(user))

  .query(async () => {
    const users = await getUsers();

    users.push({
      id: 1,
      email: 'asd@mail.com',
      created_at: new Date(),
      updated_at: new Date(),
    });

    console.log(JSON.stringify(users));


    return users;
  });
