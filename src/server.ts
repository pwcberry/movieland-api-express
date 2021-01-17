import * as dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "apollo-server-express";
import express from "express";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import * as moviedb from "./services/moviedb";

const apiUrl = process.env.API_URL as string;
const apiKey = process.env.API_KEY as string;

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        services: {
            movieService: new moviedb.MovieService(apiUrl, apiKey),
            discoverService: new moviedb.DiscoverService(apiUrl, apiKey),
            personService: new moviedb.PersonService(apiUrl, apiKey),
        },
    },
});
server.applyMiddleware({ app });

const serverPort = typeof process.env.PORT === "string" ? parseInt(process.env.PORT) : 4001;
app.listen(serverPort, () => console.log(`Application is running on port ${serverPort}.`));

console.log("API URL: ", process.env.API_URL);
