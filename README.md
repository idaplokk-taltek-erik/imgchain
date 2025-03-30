# Veebiprogrammeerimine "Projekt"

## Starting the server

To launch the server, run:

```sh
cd ./server
npm install
npm start
```

To test the API navigate to authentication swagger docs

- Go to [localhost:3000/docs-auth](http://localhost:3000/docs-auth), and peform the `/sign-in/email` with the following body
  ```json
  {
    "email": "admin@admin.ee",
    "password": "12341234"
  }
  ```
  Use `/get-session` to see how the authenticated user/session looks like.
- Go to [localhost:3000/docs](http://localhost:3000/docs), and test out the application specific methods/routes. The API endpoints specified in there are behind authentication, so logged out users cannot access them.

Read more at [server/README.md](./server/README.md).

## Starting the UI

To launch the client, run:

```sh
cd ./client
npm install
npm run dev
```

Navigate to [http://localhost:4000/](http://localhost:4000/).

Read more at [client/README.md](./client/README.md).
