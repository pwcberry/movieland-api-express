import * as Query from "./query";
import * as Resolvers from "./resolvers";

export default {
    Query,
    ...Resolvers.default,
};
