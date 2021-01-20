import { Genre, MovieFullDetailsResult, MovieSearchResult } from "../services/types";
import { MovieSearchInput, ResolverFunction } from "./types";

const movie: ResolverFunction<{ id: number }, MovieFullDetailsResult> = async (_, { id }, context): Promise<MovieFullDetailsResult> => {
    const service = context.services.movieService;
    const movieData = await service.getMovieDetails(id);
    const movieCreditsData = await service.getMovieCredits(id);

    return {
        movie: movieData,
        credits: movieCreditsData,
    };
};

const search: ResolverFunction<MovieSearchInput, MovieSearchResult> = async (_, { input: { query, page, year } }, context) => {
    const service = context.services.movieService;
    return await service.search(query, page, year);
};

const genres: ResolverFunction<unknown, Genre[]> = async (_, __, context) => {
    const service = context.services.movieService;
    return await service.getGenres();
};

const getDateAYearAgo = (date: Date) => {
    const result = new Date(date.getDate(), date.getMonth(), date.getFullYear() - 1);
    return result.toISOString().substring(0, 10);
};

const highestGross: ResolverFunction<unknown, MovieSearchResult> = async (_, __, context) => {
    const dateSince = getDateAYearAgo(new Date());
    const service = context.services.discoverService;
    return await service.getHighestGrossingFromPreviousYear(dateSince);
};

const highestVotes: ResolverFunction<unknown, MovieSearchResult> = async (_, __, context) => {
    const dateSince = getDateAYearAgo(new Date());
    const service = context.services.discoverService;
    return await service.getHighestVotesFromPreviousYear(dateSince);
};

const mostPopular: ResolverFunction<unknown, MovieSearchResult> = async (_, __, context) => {
    const dateSince = getDateAYearAgo(new Date());
    const service = context.services.discoverService;
    return await service.getMostPopularFromPreviousYear(dateSince);
};

export { movie, search, genres, highestGross, highestVotes, mostPopular };
