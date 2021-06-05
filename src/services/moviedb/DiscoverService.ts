import querystring from "querystring";
import fetch from "node-fetch";
import { DiscoverService, MovieSearchResult } from "../types";

class DiscoverServiceImpl implements DiscoverService {
    private readonly apiUrl: string;
    private readonly apiKey: string;

    constructor(apiUrl: string, apiKey: string) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    async getHighestGrossingFromPreviousYear(sinceReleaseDate: string): Promise<MovieSearchResult> {
        const apiQueryParams = this.setQueryParameters("revenue.desc", sinceReleaseDate);
        return await this.runQuery(apiQueryParams);
    }

    async getHighestVotesFromPreviousYear(sinceReleaseDate: string): Promise<MovieSearchResult> {
        const apiQueryParams = this.setQueryParameters("vote_average.desc", sinceReleaseDate, 10000);
        return await this.runQuery(apiQueryParams);
    }

    async getMostPopularFromPreviousYear(sinceReleaseDate: string): Promise<MovieSearchResult> {
        const apiQueryParams = this.setQueryParameters("popularity.desc", sinceReleaseDate, 5000);
        return await this.runQuery(apiQueryParams);
    }

    private async runQuery(apiQueryParams: string): Promise<MovieSearchResult> {
        const apiResponse = await fetch(`${this.apiUrl}/discover/movie?${apiQueryParams}`);
        return await apiResponse.json();
    }

    private setQueryParameters(sortBy: string, sinceReleaseDate: string, voteCount?: number): string {
        return querystring.stringify({
            api_key: this.apiKey,
            region: "US",
            with_original_language: "en",
            include_adult: false,
            sort_by: sortBy,
            "primary_release_date.gte": sinceReleaseDate,
            "vote_count.gte": voteCount,
        });
    }
}

export default DiscoverServiceImpl;
