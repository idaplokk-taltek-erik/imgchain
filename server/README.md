# Veebiprogrammeerimine: Server

## API

The goal is to test out how different technologies work. Would like to find a way which allows types for the API interface to defined in one place and the server + consumers can write the programs for that interface.

The API layer leverages (tRPC)[https://trpc.io/docs/] to seamlessly synchronize API definitions between the client and server (is promising), eliminating the need for manual duplication of code.

I tried adding openapi docs generated directly from the trpc schema. It was quite painful, I went through several libraries like zod-to-openapi (deprecated), trpc-openapi (deprecated), now trpc-to-openapi (have to descibe openapi manually by adding some meta with REST endpoints, also fails to start randomly after some other dep install). In the end I went with `zod-openapi` and creatad a script that goes through the tRPC definitions and adds them to the OpenAPI spec manually. And then I found package trpc-ui, wasted 1h at least. But using some guys library always feels wrong.

The client code can simply import the definitions for server directory without problems.

I tried to setup protobuf/grpc, but somehow the tooling is not great. The proto definition and typescript schema library zod are not tightly coupled, change in one is not automatically reflected in the other. `protoc` needs to be a global package?

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

## Database

For the database, we use sqlite and Kysely as our ORM. SQLite for ease of use for experimentation purposes. Kysely functions more like a query engine, providing strong type-safety without the overhead and complications of a traditional ORM.

## Adding a database migration

- Copy the latest migration file into the [src/migrations](src/migrations) folder.
- Adjust the migration file as needed.
- Execute `npm run db:migrate` to update the database

After the migration runs, the schema and interfaces for your database tables in [src/db/schema.d.ts](src/db/schema.d.ts) will automatically be updated.
