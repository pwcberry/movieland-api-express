import querystring from "querystring";
import fetch from "node-fetch";
import { Genre, MovieCreditsResult, MovieDetails, MovieSearchResult } from "../types";

let genreCache = new Set<Genre>();

class MovieService {
    private readonly apiUrl: string;
    private readonly apiKey: string;

    constructor(apiUrl: string, apiKey: string) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    /**
     * Retrieve movies that match the text of a given query.
     *
     * @param query The text to search for in a movie title
     * @param page The requested page of the results
     * @param year Filter to the year movies were released
     */
    async search(query: string, page = 1, year?: number): Promise<MovieSearchResult> {
        // REF: https://developers.themoviedb.org/3/search/search-movies
        const apiQueryParams = querystring.stringify({
            api_key: this.apiKey,
            language: "en-US",
            include_adult: false,
            query,
            page,
            year,
        });

        const searchResponse = await fetch(`${this.apiUrl}/search/movie?${apiQueryParams}`);
        return await searchResponse.json();
    }

    /**
     * Get the current set of movie genres available from the API.
     */
    async getGenres(): Promise<Genre[]> {
        const url = `${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}&language=en-US`;

        if (genreCache.size === 0) {
            const queryResponse = await fetch(url);
            const queryData = await queryResponse.json();

            if ("genres" in queryData) {
                genreCache = new Set(queryData.genres);
                return queryData.genres;
            }
        }

        return Promise.resolve(Array.from(genreCache.values()));
    }

    /**
     * Get the details for a movie with the specified ID.
     */
    async getMovieDetails(id: number): Promise<MovieDetails> {
        const url = `${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`;

        const queryResponse = await fetch(url);
        return await queryResponse.json();
    }

    /**
     * Get the credits for a movie with the specified ID.
     */
    async getMovieCredits(id: number): Promise<MovieCreditsResult> {
        const url = `${this.apiUrl}/movie/${id}/credits?api_key=${this.apiKey}`;

        const queryResponse = await fetch(url);
        return await queryResponse.json();
    }
}

export default MovieService;
