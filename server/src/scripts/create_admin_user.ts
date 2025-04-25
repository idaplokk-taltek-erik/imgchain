import { db } from '../db/db';


const params = process.argv.slice(2);

console.log(params);

const method = params[0];

if (method !== 'set') {
  throw new Error(
    'Supported options are "npm run scripts:admin set <user_id | user_email>"',
  );
}

// if (method !== 'set' && method !== 'add') {
//   throw new Error('Supported options are "npm run scripts:admin set <user_id>" and "npm run scripts:admin add <email> <password>');
// }

(async () => {
  if (method === 'set') {
    const userId = params[1];

    if (typeof userId !== 'string') {
      throw new Error('<user_id | user_email> must be a string');
    }

    const user = await db
      .selectFrom('user')
      .selectAll()
      .where((eb) =>
        eb.or([eb('user.id', '=', userId), eb('user.email', '=', userId)]),
      )
      .executeTakeFirst();

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    const result = await db
      .updateTable('user')
      .where('user.id', '=', user.id)
      .set('role', 'admin')
      .returningAll()
      .execute();

    console.log(JSON.stringify(result, null, 4));
  }
})();
