# Veebiprogrammeerimine: lib

This folder contains shared types and functions used by both the client and server. The goal is to make API input and output types easily accessible across both applications.

Since the client and server have separate bundles and node_modules directories, TypeScript does not allow importing files from outside the designated project scope.

To address this, this folder is packaged and built separately.

## Sharing the library between client and server

```sh
npm install
npm run build
cd ../client
npm install ../client
cd ../server
npm install ../server
```
