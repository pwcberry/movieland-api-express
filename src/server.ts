import * as dotenv from "dotenv";
dotenv.config();

import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { setGraphQLServer, userRouter } from "./routes";
import * as userdb from "./services/userdb";

const apiUrl = process.env.API_URL as string;
const apiKey = process.env.API_KEY as string;
const useMocks = process.env.USE_MOCK === "true";
const databasePath = path.resolve(process.env.DATABASE as string);
const mockPath = path.resolve(process.cwd(), "./mocks");

const app = express();
app.locals.userService = new userdb.UserServiceImpl(databasePath);

app.use(cors());
app.use(cookieParser());
app.use(userRouter);

setGraphQLServer({
    app,
    apiKey,
    apiUrl,
    databasePath,
    mockPath,
    useMocks,
});

const serverPort = process.env.PORT ? parseInt(process.env.PORT) : 4001;
app.listen(serverPort, () => console.log(`Application is running on port ${serverPort}.`));

console.log("API URL: ", process.env.API_URL);
