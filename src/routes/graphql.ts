import { graphqlExpress } from "apollo-server-express";
import typeDefs from "../schema";
import resolvers from "../resolvers";
import express, { Express } from "express";
import { isAuthorised } from "./user";
import * as mock from "../services/moviedb/mocks";
import * as moviedb from "../services/moviedb";
import * as userdb from "../services/userdb";

type GraphQLConfigInput = {
    app: Express;
    apiUrl: string;
    apiKey: string;
    databasePath: string;
    mockPath: string;
    useMocks: boolean;
};

// To set cookies for GraphQL playground, open the settings in the GraphQL editor and
// set "request.credentials" to "same-origin"
const setGraphQLServer = (input: GraphQLConfigInput) => {
    const { app, apiUrl, apiKey, databasePath, mockPath, useMocks } = input;

    const movieService = useMocks ? new mock.MovieServiceMock(mockPath) : new moviedb.MovieServiceImpl(apiUrl, apiKey);
    const discoverService = useMocks ? new mock.DiscoverServiceMock(mockPath) : new moviedb.DiscoverServiceImpl(apiUrl, apiKey);

    // const server = new ApolloServer({
    //     typeDefs,
    //     resolvers,
    //     context: ({ req }: { req: express.Request }) => {
    //         return {
    //             // This is really simple authorization...
    //             isAuthorised: async () => await isAuthorised(req),
    //             userId: req.cookies["userid"],
    //             services: {
    //                 movieService,
    //                 discoverService,
    //                 personService: new moviedb.PersonServiceImpl(apiUrl, apiKey),
    //                 userRatingService: new userdb.UserRatingServiceImpl(databasePath),
    //             },
    //         };
    //     },
    // });
    server.applyMiddleware({ app });

    return graphqlExpress({
        typeDefs,
        resolvers,
        context: ({ req }: { req: express.Request }) => {
            return {
                // This is really simple authorization...
                isAuthorised: async () => await isAuthorised(req),
                userId: req.cookies["userid"],
                services: {
                    movieService,
                    discoverService,
                    personService: new moviedb.PersonServiceImpl(apiUrl, apiKey),
                    userRatingService: new userdb.UserRatingServiceImpl(databasePath),
                },
            };
        },
    });
};

export { setGraphQLServer };
