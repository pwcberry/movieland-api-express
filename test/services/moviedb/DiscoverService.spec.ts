import fetch from "node-fetch";
import { DiscoverService } from "../../../src/services/moviedb";
import DISCOVER_RESULTS from "../../fixtures/discovery-results";

jest.mock("node-fetch");

describe("DiscoverService", () => {
    const API_URL = "https://movieland.api";
    const API_KEY = "a1b2c3d4";

    let mockedFetch: jest.Mock;

    beforeEach(() => {
        mockedFetch = (fetch as unknown) as jest.Mock;
        mockedFetch.mockResolvedValue({
            status: 200,
            async json() {
                return Promise.resolve(DISCOVER_RESULTS);
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getHighestGrossingFromPreviousYear", () => {
        it("should call the API with the sort by revenue from the previous year", async () => {
            expect.assertions(4);

            const service = new DiscoverService(API_URL, API_KEY);
            const result = await service.getHighestGrossingFromPreviousYear("2020-03-01");

            expect(result.page).toBe(1);
            expect(mockedFetch.mock.calls[0][0]).toContain(`api_key=${API_KEY}`);
            expect(mockedFetch.mock.calls[0][0]).toContain("sort_by=revenue.desc");
            expect(mockedFetch.mock.calls[0][0]).toContain("primary_release_date.gte=2020-03-01");
        });
    });

    describe("getHighestVotesFromPreviousYear", () => {
        it("should call the API with the sort by highest votes from the previous year", async () => {
            expect.assertions(4);

            const service = new DiscoverService(API_URL, API_KEY);
            const result = await service.getHighestVotesFromPreviousYear("2020-03-01");

            expect(result.page).toBe(1);
            expect(mockedFetch.mock.calls[0][0]).toContain(`api_key=${API_KEY}`);
            expect(mockedFetch.mock.calls[0][0]).toContain("sort_by=vote_average.desc");
            expect(mockedFetch.mock.calls[0][0]).toContain("vote_count.gte=10000");
        });
    });

    describe("getMostPopularFromPreviousYear", () => {
        it("should call the API with the sort by highest popular score from the previous year", async () => {
            expect.assertions(4);

            const service = new DiscoverService(API_URL, API_KEY);
            const result = await service.getMostPopularFromPreviousYear("2020-03-01");

            expect(result.page).toBe(1);
            expect(mockedFetch.mock.calls[0][0]).toContain(`api_key=${API_KEY}`);
            expect(mockedFetch.mock.calls[0][0]).toContain("sort_by=popularity.desc");
            expect(mockedFetch.mock.calls[0][0]).toContain("vote_count.gte=5000");
        });
    });
});
