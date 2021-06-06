import fs from "fs";
import path from "path";
import { Genre, MovieCreditsResult, MovieDetails, MovieResult, MovieSearchResult, MovieService } from "../../types";

export default class MovieServiceMock implements MovieService {
    constructor(private mockPath: string) {}

    async search(_: string, page = 1, year?: number): Promise<MovieSearchResult> {
        const searchResults = await this.getDataFromFile<MovieResult[]>("movie-genres.json");

        return Promise.resolve({
            page,
            total_pages: page,
            total_results: searchResults.length,
            results: year ? searchResults.filter((m) => m.release_date.includes(year.toString())) : searchResults,
        });
    }

    async getGenres(): Promise<Genre[]> {
        const genres = this.getDataFromFile<Genre[]>("movie-genres.json");
        return Promise.resolve(genres);
    }

    async getMovieDetails(id: number): Promise<MovieDetails> {
        const details = this.getDataFromFile<MovieDetails>(`movies/${id}.json`);
        return Promise.resolve(details);
    }

    async getMovieCredits(id: number): Promise<MovieCreditsResult> {
        const details = this.getDataFromFile<MovieCreditsResult>(`movies-credits/${id}.json`);
        return Promise.resolve(details);
    }

    private getDataFromFile<T>(file: string): T {
        const rawSource = fs.readFileSync(path.join(this.mockPath, file), { encoding: "utf8" });
        const source = JSON.parse(rawSource);
        return source as T;
    }
}
