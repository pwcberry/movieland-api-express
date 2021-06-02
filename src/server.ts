import * as dotenv from "dotenv";
dotenv.config();

import path from "path";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import * as routes from "./routes";
import getServices from "./services";
import * as userdb from "./services/userdb";

const apiUrl = process.env.API_URL as string;
const apiKey = process.env.API_KEY as string;
const useMock = process.env.USE_MOCK === "true";
const databaseFilename = path.resolve(process.env.DATABASE as string);
const mockPath = path.resolve(process.cwd(), "./mocks");

const app = express();
app.locals.userService = new userdb.UserService(databaseFilename);

app.use(cors());
app.use(cookieParser());
app.use(routes.userRouter);

// To set cookies for GraphQL playground, open the settings in the GraphQL editor and
// set "request.credentials" to "same-origin"
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: express.Request }) => {
        return {
            // This is really simple authorization...
            isAuthorised: async () => await routes.isAuthorised(req),
            userId: req.cookies["userid"],
            services: getServices(apiUrl, apiKey, databaseFilename, mockPath, useMock),
        };
    },
});
server.applyMiddleware({ app });

const serverPort = typeof process.env.PORT === "string" ? parseInt(process.env.PORT) : 4001;
app.listen(serverPort, () => console.log(`Application is running on port ${serverPort}.`));

console.log("API URL: ", process.env.API_URL);
