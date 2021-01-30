import { Genre, MovieFullDetailsResult, MovieSearchResult } from "../services/types";
import { MovieSearchInput, ResolverFunction } from "./types";

const movie: ResolverFunction<{ id: number }, MovieFullDetailsResult> = async (_, { id }, context): Promise<MovieFullDetailsResult> => {
    const service = context.services.movieService;
    const movieData = await service.getMovieDetails(id);
    const movieCreditsData = await service.getMovieCredits(id);

    const authorised = await context.isAuthorised();
    if (authorised) {
        const userRating = await context.services.userRatingService.getRating(<string>context.userId, id);
        if (userRating) {
            movieData.user_rating = userRating.rating;
            movieData.user_rating_updated = userRating.date_updated;
        }
    }

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

const userLastRatings: ResolverFunction<unknown, MovieSearchResult> = async (_, __, context) => {
    const authorised = await context.isAuthorised();
    if (!authorised) {
        throw new Error("Unauthorised");
    }

    const ratings = await context.services.userRatingService.getRatedMovies(<string>context.userId);
    if (ratings.length === 0) {
        return {
            page: 1,
            total_results: 0,
            total_pages: 0,
            results: [],
        };
    }

    const limit = ratings.length > 5 ? 5 : ratings.length;
    const results = await Promise.all(
        ratings.slice(0, limit).map(async (userRating) => {
            const movie = await context.services.movieService.getMovieDetails(userRating.movie_id);
            movie.user_rating = userRating.rating;
            movie.user_rating_updated = userRating.date_updated;
            return movie;
        })
    );

    return {
        page: 1,
        total_results: limit,
        total_pages: 1,
        results,
    };
};

export { movie, search, genres, highestGross, highestVotes, mostPopular, userLastRatings };
