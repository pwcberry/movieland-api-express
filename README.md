# Movieland - On Express and GraphQL

A Node.js Express server that exposes a GraphQL API for Movieland front-ends.

## Getting started

Install on your computer:

```bash
npm install
```

You will need a [TMDB](https://themoviedb.org) API key to access the movie data. You will also need to
find the URLs for the API and images. When you have those, store them in a `.env` file.

```bash
API_KEY=<TMDB API key>
API_URL=<TMBD API base URL>
IMAGE_API_URL=<TMBD image base URL>
AVATAR_API_URL=<TMBD avatar base URL>
DATABASE=<resolvable path to local SQLITE database>
```

The database is used to store user data. You initialise the database by running the script:

```bash
node scripts/db-create.js
```

## Running the app server

To start the server and to watch file changes:

```bash
npm run dev
```

To view the GraphQL playground, visit `http://localhost:4001/graphql`. This is the same path the front-end will need
to communicate with this server.

You can also specify the port for this server by adding a `PORT` value to the `.env` file.

To run the server without file watching:

```bash
npm start
```

## Development

Run eslint:

```bash
npm run lint
```

Run tests:

```bash
npm test
```
