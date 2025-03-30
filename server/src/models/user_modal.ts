import { Insertable, Selectable } from 'kysely';
import { db } from '../db/db';
import { DB } from '../db/schema';
import { User } from '../schema/user';

export async function insertUser({
  email,
  password_hash,
}: Insertable<DB['user']>): Promise<User> {
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
    throw new Error('Failed to insert user');
  }

  return parsePublicUser(result);
}

export async function getUsers(): Promise<User[]> {
  const users = await db.selectFrom('user').selectAll().execute();

  return users.map(parsePublicUser);
}

export async function getUserByID(id: number): Promise<User | null> {
  const user = await db
    .selectFrom('user')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();

  return user ? parsePublicUser(user) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await db
    .selectFrom('user')
    .where('email', '=', email)
    .selectAll()
    .executeTakeFirst();

  return user ? parsePublicUser(user) : null;
}

function parsePublicUser(user: Selectable<DB['user']>): User {
  return {
    id: user.id,
    email: user.email,
    created_at: new Date(user.created_at),
    updated_at: new Date(user.updated_at),
  };
}
