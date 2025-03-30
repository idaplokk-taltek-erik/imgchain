# Veebiprogrammeerimine "Projekt"

## Starting the server

To launch the server, run:

```
cd ./server
npm install
npm start
```

To test the API use the genearted swagged docs at [localhost:3000/docs](http://localhost:3000/docs).

In order to request `user.list` the user has to the authenticated. Just perform the `auth.login` request with default data provided by swagger to test it out. Otherwise create a new user with `auth.register`.

Read more at [server/README.md](./server/README.md).

## Starting the UI

To launch the client, run:

```
cd ./client
npm install
npm run dev
```

Navigate to [http://localhost:4000/](http://localhost:4000/).

Read more at [client/README.md](./client/README.md).
