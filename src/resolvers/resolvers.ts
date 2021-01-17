import { Genre, MovieFullDetailsResult, MovieSearchResult } from "../services/types";
import { setGenres, setImageUrl, setMovieCast, setMovieDirectors, setMovieWriters } from "../transformers";
import { ResolverContext } from "./types";

export default {
    MovieSearchResults: {
        page: (r: MovieSearchResult) => r.page,
        totalCount: (r: MovieSearchResult) => r.total_results,
        totalPages: (r: MovieSearchResult) => r.total_pages,
        results: (r: MovieSearchResult) => r.results.map((movie) => ({ movie })),
    },

    Movie: {
        id: (m: MovieFullDetailsResult) => m.movie.id,
        title: (m: MovieFullDetailsResult) => m.movie.title,
        releaseDate: (m: MovieFullDetailsResult) => m.movie.release_date,
        overview: (m: MovieFullDetailsResult) => m.movie.overview,
        posterUrl: (m: MovieFullDetailsResult) => setImageUrl(m.movie.poster_path),
        genres: (m: MovieFullDetailsResult, _: unknown, context: ResolverContext) => setGenres(m.movie, context),
        detailUrl: (m: MovieFullDetailsResult) => `/movie/${m.movie.id}`,
        directors: (m: MovieFullDetailsResult) => setMovieDirectors(m.credits),
        writers: (m: MovieFullDetailsResult) => setMovieWriters(m.credits),
        cast: (m: MovieFullDetailsResult) => setMovieCast(m.credits),
        runtime: (m: MovieFullDetailsResult) => m.movie.runtime,
        rating: (m: MovieFullDetailsResult) => m.movie.vote_average,
        popularity: (m: MovieFullDetailsResult) => m.movie.popularity,
    },

    Genre: {
        id: (g: Genre) => g.id,
        name: (g: Genre) => g.name,
    },
};
