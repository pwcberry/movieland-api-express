const path = require("path");
const express = require("express");
const apollo = require("apollo-server-express");
const typeDefs = require("./typedefs");
const resolvers = require("./resolvers");

function startWithApolloServer(app, port) {
    app.use(express.static(path.join(process.cwd(), "web")));

    const server = new apollo.ApolloServer({
        typeDefs,
        resolvers
    });
    server.applyMiddleware({ app });

    const serverPort = typeof port === "number" ? port : parseInt(process.env.PORT);

    app.listen(serverPort, () => console.log(`Application is running on port ${serverPort}.`));
}

function startWithWebpack(port, webpackDevMiddleware, webpackHotMiddleware) {
    const app = express();

    if (webpackDevMiddleware) {
        app.use(webpackDevMiddleware);
        app.use(webpackHotMiddleware);
    }

    startWithApolloServer(app, port);
}

function start(port) {
    const app = express();

    startWithApolloServer(app, port);
}

module.exports = {
    startWithWebpack,
    start
};
