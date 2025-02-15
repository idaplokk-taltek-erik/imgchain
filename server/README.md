# Veebiprogrammeerimine: Server

The API layer leverages (tRPC)[https://trpc.io/docs/] to seamlessly synchronize API definitions between the client and server, eliminating the need for manual duplication of code.

For the database, we use sqlite and Kysely as our ORM. SQLite for ease of use for experimentation purposes. Kysely functions more like a query engine, providing strong type-safety without the overhead and complications of a traditional ORM.

## Starting the server

To launch the server, run:

```
npm install
npm start
```

To test the API:

```sh
curl http://localhost:3000/trpc/user.list
```

## Adding a database migration

- Copy the latest migration file into the [src/migrations](src/migrations) folder.
- Adjust the migration file as needed.
- Execute `npm run db:migrate` to update the database

After the migration runs, the schema and interfaces for your database tables in [src/db/schema.d.ts](src/db/schema.d.ts) will automatically be updated.
