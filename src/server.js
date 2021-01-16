require("dotenv").config();

const path = require("path");
const apollo = require("apollo-server-express");
const typeDefs = require("./typedefs");
const resolvers = require("./resolvers");
const express = require("express");

const app = express();
app.use(express.static(path.join(process.cwd(), "web")));

const server = new apollo.ApolloServer({
    typeDefs,
    resolvers
});
server.applyMiddleware({ app });

const serverPort = typeof process.env.PORT === "string" ? parseInt(process.env.PORT) : 4001;

app.listen(serverPort, () => console.log(`Application is running on port ${serverPort}.`));

console.log("API URL: ", process.env.API_URL);
