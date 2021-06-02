import fs from "fs";
import path from "path";
import { Genre, MovieCreditsResult, MovieDetails } from "../../types";

export default class MovieServiceMock {
    constructor(private mockPath: string) {}

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
