import * as Query from "./query";
import * as Mutation from "./mutation";
import * as Resolvers from "./resolvers";

export default {
    Query,
    Mutation,
    ...Resolvers.default,
};
