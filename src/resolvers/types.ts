import { IResolvers, IResolverObject } from "apollo-server-express";
import { MovieService, DiscoverService, PersonService } from "../services/moviedb";
import { Genre, MovieFullDetailsResult, MovieSearchResult } from "../services/types";

// Define the type for the resolver "root" or "source".
// For these top-level resolvers, the "root" is defined in the configuration passed into the
// `ApolloServer` constructor as "rootValue". However, in the application currently, "rootValue" is not defined.
// If "rootValue" needs a definition, this type alias will have to be redefined.
declare type QueryRoot = unknown;

export interface ResolverContext {
    services: {
        discoverService: DiscoverService;
        movieService: MovieService;
        personService: PersonService;
    };
}

export type MovieSearchInput = {
    input: { query: string; page?: number; year?: number };
};

export type ResolverFunction<TVariables, TResult> = (root: QueryRoot, variables: TVariables, context: ResolverContext) => Promise<TResult>;

interface QueryResolvers extends IResolverObject<QueryRoot, ResolverContext> {
    movie: ResolverFunction<{ id: number }, MovieFullDetailsResult>;
    search: ResolverFunction<MovieSearchInput, MovieSearchResult>;
    genres: ResolverFunction<unknown, Genre[]>;
}

// type parameters are <TSource, TContext>
export interface Resolvers extends IResolvers<QueryRoot, ResolverContext> {
    Query: QueryResolvers;
}

export type Credit = {
    id: number;
    department: string;
    name: string;
};

export type Actor = {
    id: number;
    name: string;
    originalName: string;
    character?: string;
    order?: number;
    profileUrl: string;
};
