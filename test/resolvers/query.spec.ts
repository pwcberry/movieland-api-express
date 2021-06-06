import * as sqlite from "sqlite";
import { UserRatingServiceImpl } from "../../src/services/userdb";
import { userLastRatings } from "../../src/resolvers/query";
import { ResolverContext } from "../../src/resolvers/types";
import { DiscoverServiceImpl, MovieServiceImpl, PersonServiceImpl } from "../../src/services/moviedb";

jest.mock("sqlite");
jest.mock("sqlite3");

const mockContext = (authorised: boolean, userId: string): ResolverContext => {
    return {
        isAuthorised: async () => authorised,
        userId,
        services: {
            discoverService: <DiscoverServiceImpl>(jest.fn() as unknown),
            movieService: <MovieServiceImpl>({
                getMovieDetails: jest.fn().mockResolvedValue({}),
            } as unknown),
            personService: <PersonServiceImpl>(jest.fn() as unknown),
            userRatingService: new UserRatingServiceImpl("database.db"),
        },
    };
};

interface MockDatabase {
    all: jest.Mock;
}

const mockDatabase = jest.fn((db: MockDatabase) => {
    (sqlite.open as jest.Mock).mockResolvedValue(db);
});

describe("query", () => {
    describe("userLastRatings", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should throw an error when not authorised", async () => {
            expect.assertions(1);

            const context = mockContext(false, "");

            await expect(userLastRatings({}, {}, context)).rejects.toThrow(new Error("Unauthorised"));
        });

        it("should return no results when authorised and no ratings", async () => {
            expect.assertions(4);

            mockDatabase({
                all: jest.fn().mockResolvedValue([]),
            });

            const context = mockContext(true, "a1b2c3d4e5f6");

            const result = await userLastRatings({}, {}, context);

            expect(result.total_results).toBe(0);
            expect(result.total_pages).toBe(0);
            expect(result.results).toHaveLength(0);
            expect(result.page).toBe(1);
        });

        it("should return ratings when authorized and ratings are in the database", async () => {
            expect.assertions(4);
            mockDatabase({
                all: jest.fn().mockResolvedValue([
                    {
                        movie_id: 495764,
                    },
                    {
                        movie_id: 38700,
                    },
                ]),
            });

            const context = mockContext(true, "d4e5f6a1b2c3");

            const result = await userLastRatings({}, {}, context);
            expect(result.total_results).toBe(2);
            expect(result.total_pages).toBe(1);
            expect(result.results).toHaveLength(2);
            expect(result.page).toBe(1);
        });

        it("should return limit of 5 ratings when authorized and ratings are in the database", async () => {
            expect.assertions(4);
            mockDatabase({
                all: jest.fn().mockResolvedValue([
                    {
                        movie_id: 495764,
                    },
                    {
                        movie_id: 38700,
                    },
                    {
                        movie_id: 399532,
                    },
                    {
                        movie_id: 181821,
                    },
                    {
                        movie_id: 429161,
                    },
                    {
                        movie_id: 299531,
                    },
                ]),
            });

            const context = mockContext(true, "a1b2d4e5f6c3");

            const result = await userLastRatings({}, {}, context);
            expect(result.total_results).toBe(5);
            expect(result.total_pages).toBe(1);
            expect(result.results).toHaveLength(5);
            expect(result.page).toBe(1);
        });
    });
});
