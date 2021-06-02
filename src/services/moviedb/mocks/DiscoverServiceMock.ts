import fs from "fs";
import path from "path";
import { MovieSearchResult } from "../../types";

export default class DiscoverServiceMock {
    constructor(private mockPath: string) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getHighestGrossingFromPreviousYear(_: string): Promise<MovieSearchResult> {
        const data = this.getDataFromFile("highest_grossing");
        return Promise.resolve(data);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getHighestVotesFromPreviousYear(_: string): Promise<MovieSearchResult> {
        const data = this.getDataFromFile("highest_votes");
        return Promise.resolve(data);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getMostPopularFromPreviousYear(_: string): Promise<MovieSearchResult> {
        const data = this.getDataFromFile("most_popular");
        return Promise.resolve(data);
    }

    private getDataFromFile(key: string): MovieSearchResult {
        const rawSource = fs.readFileSync(path.join(this.mockPath, "movie-discover.json"), { encoding: "utf8" });
        const source = JSON.parse(rawSource);
        return source[key] as unknown as MovieSearchResult;
    }
}
