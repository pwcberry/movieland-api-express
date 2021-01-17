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

export { movie, search, genres };
