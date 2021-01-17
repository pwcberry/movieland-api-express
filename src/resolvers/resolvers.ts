import { Genre, MovieFullDetailsResult, MovieSearchResult } from "../services/types";

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
        overview: (m: MovieFullDetailsResult) => m.movie.overview,
    },

    Genre: {
        id: (g: Genre) => g.id,
        name: (g: Genre) => g.name,
    },
};
