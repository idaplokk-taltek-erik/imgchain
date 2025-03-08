import { Insertable, Selectable } from 'kysely';
import { db } from '../db/db';
import { DB } from '../db/schema';
import { User } from '../schema/user';

export async function createUser({
  email,
  password_hash,
}: Insertable<DB['user']>): Promise<User | undefined> {
  const result = await db
    .insertInto('user')
    .values({
      email,
      password_hash,
    })
    .returningAll()
    .onConflict((oc) => oc.column('email').doNothing())
    .executeTakeFirst();

  if (!result) {
    return result;
  }

  return parseDates(result);
}

export async function getUsers(): Promise<User[]> {
  const users = await db.selectFrom('user').selectAll().execute();

  return users.map(parseDates);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await db
    .selectFrom('user')
    .where('email', '==', email)
    .selectAll()
    .executeTakeFirst();

  return user ? parseDates(user) : null;
}

function parseDates(user: Selectable<DB['user']>): User {
  return {
    ...user,
    id: user.id,
    created_at: new Date(user.created_at),
    updated_at: new Date(user.updated_at),
  };
}
