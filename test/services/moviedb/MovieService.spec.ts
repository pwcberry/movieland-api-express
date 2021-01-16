import fetch from "node-fetch";
import { MovieService } from "../../../src/services/moviedb";
import MOVIE_SEARCH_RESULTS from "../../fixtures/search-results";
import MOVIE_DETAILS from "../../fixtures/movie-details";
import MOVIE_CREDITS_RESULTS from "../../fixtures/movie-credits";

jest.mock("node-fetch");

describe("MovieService", () => {
    const API_URL = "https://movieland.api";
    const API_KEY = "a1b2c3d4";

    describe("search", () => {
        let mockedFetch: jest.Mock;

        beforeEach(() => {
            mockedFetch = (fetch as unknown) as jest.Mock;

            mockedFetch.mockResolvedValue({
                status: 200,
                async json() {
                    return Promise.resolve(MOVIE_SEARCH_RESULTS);
                },
            });
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("should query movie API with search text", async () => {
            expect.assertions(6);
            const service = new MovieService(API_URL, API_KEY);

            const result = await service.search("avengers");

            expect(result.total_pages).toBe(8);
            expect(result.page).toBe(1);
            expect(result.results).toHaveLength(1);
            expect(mockedFetch.mock.calls[0][0]).toContain(API_KEY);
            expect(mockedFetch.mock.calls[0][0]).toContain(API_URL);
            expect(mockedFetch.mock.calls[0][0]).toContain("page=1");
        });

        it("should query movie API with a page number", async () => {
            expect.assertions(4);
            const service = new MovieService(API_URL, API_KEY);

            const result = await service.search("avengers", 2);

            expect(result.total_pages).toBe(8);
            expect(mockedFetch.mock.calls[0][0]).toContain(API_KEY);
            expect(mockedFetch.mock.calls[0][0]).toContain(API_URL);
            expect(mockedFetch.mock.calls[0][0]).toContain("page=2");
        });

        it("should query movie API with a page number and year", async () => {
            expect.assertions(5);
            const service = new MovieService(API_URL, API_KEY);

            const result = await service.search("avengers", 2, 2011);

            expect(result.results).toHaveLength(1);
            expect(mockedFetch.mock.calls[0][0]).toContain(API_KEY);
            expect(mockedFetch.mock.calls[0][0]).toContain(API_URL);
            expect(mockedFetch.mock.calls[0][0]).toContain("page=2");
            expect(mockedFetch.mock.calls[0][0]).toContain("year=2011");
        });
    });

    describe("getMovieDetails", () => {
        it("should return the details of a movie with a valid ID", async () => {
            expect.assertions(3);

            const mockedFetch = (fetch as unknown) as jest.Mock;
            mockedFetch.mockResolvedValue({
                status: 200,
                async json() {
                    return Promise.resolve(MOVIE_DETAILS);
                },
            });

            const service = new MovieService(API_URL, API_KEY);

            const result = await service.getMovieDetails(299536);

            expect(result.id).toBe(299536);
            expect(mockedFetch.mock.calls[0][0]).toContain("/movie/299536");
            expect(mockedFetch.mock.calls[0][0]).toContain(`api_key=${API_KEY}`);
        });
    });

    describe("getMovieCredits", () => {
        it("should return the credits for a movie with a valid ID", async () => {
            expect.assertions(5);

            const mockedFetch = (fetch as unknown) as jest.Mock;
            mockedFetch.mockResolvedValue({
                status: 200,
                async json() {
                    return Promise.resolve(MOVIE_CREDITS_RESULTS);
                },
            });

            const service = new MovieService(API_URL, API_KEY);

            const result = await service.getMovieCredits(299536);

            expect(result.id).toBe(299536);
            expect(result.crew).toHaveLength(3);
            expect(result.cast).toHaveLength(4);
            expect(mockedFetch.mock.calls[0][0]).toContain("/movie/299536/credits");
            expect(mockedFetch.mock.calls[0][0]).toContain(`api_key=${API_KEY}`);
        });
    });
});
