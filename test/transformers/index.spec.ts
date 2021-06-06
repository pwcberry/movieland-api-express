import { setGenres, setMovieCast, setMovieDirectors, setMovieWriters } from "../../src/transformers";
import { ResolverContext } from "../../src/resolvers/types";
import { DiscoverServiceImpl, MovieServiceImpl, PersonServiceImpl } from "../../src/services/moviedb";
import GENRES from "../fixtures/movie-genres";
import MOVIE_CREDITS from "../fixtures/movie-credits";
import { Genre } from "../../src/services/types";
import * as userdb from "../../src/services/userdb";

const API_URL = "https://api";
const API_KEY = "a1b2c3d4e5f6";

jest.mock("../../src/services/moviedb", () => {
    return {
        DiscoverServiceImpl: jest.fn().mockImplementation(),
        PersonServiceImpl: jest.fn().mockImplementation(),
        MovieServiceImpl: jest.fn().mockImplementation(),
    };
});

jest.mock("../../src/services/userdb", () => {
    return {
        UserRatingServiceImpl: jest.fn().mockImplementation(),
    };
});

describe("transformers", () => {
    describe("setGenres", () => {
        const mockContext: ResolverContext = {
            isAuthorised: jest.fn(),
            userId: "abcdef",
            services: {
                discoverService: new DiscoverServiceImpl(API_URL, API_KEY),
                movieService: new MovieServiceImpl(API_URL, API_KEY),
                personService: new PersonServiceImpl(API_URL, API_KEY),
                userRatingService: new userdb.UserRatingServiceImpl("fake.db"),
            },
        };

        it("should return an empty array when 'genres' and 'genre_ids' fields are not present", async () => {
            expect.assertions(1);

            const result = await setGenres({}, mockContext);

            expect(result).toHaveLength(0);
        });

        it("should return the array stored in the 'genres' field", async () => {
            expect.assertions(2);

            const result: Genre[] = await setGenres({ genres: GENRES }, mockContext);

            expect(result).toHaveLength(5);
            expect(result[0].name).toBe("Animation");
        });

        it("should return an array of mapped genres when 'genre_ids' field is present", async () => {
            expect.assertions(3);
            mockContext.services.movieService.getGenres = jest.fn().mockResolvedValue([GENRES[0], GENRES[4]]);

            const result = await setGenres({ genre_ids: [11, 43] }, mockContext);

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe("Animation");
            expect(result[1].name).toBe("Thriller");
        });
    });

    describe("setMovieDirectors", () => {
        it("should return the list of directors", () => {
            const result = setMovieDirectors(MOVIE_CREDITS);
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe("Anthony Russo");
            expect(result[0].job).toBe("Director");
        });

        it("should return an empty list if 'credits' are not defined", () => {
            const result = setMovieDirectors(undefined);
            expect(result).toHaveLength(0);
        });

        it("should return an empty list if no directors are in the crew", () => {
            const result = setMovieDirectors({ id: 1, cast: [], crew: [MOVIE_CREDITS.crew[0]] });
            expect(result).toHaveLength(0);
        });
    });

    describe("setMovieWriters", () => {
        it("should return the list of screenplay writers", () => {
            const result = setMovieWriters(MOVIE_CREDITS);
            expect(result).toHaveLength(1);
            expect(result[0].job).toBe("Writer");
        });

        it("should return an empty list if 'credits' are not defined", () => {
            const result = setMovieWriters(undefined);
            expect(result).toHaveLength(0);
        });

        it("should return an empty list if no screenplay writers are in the crew", () => {
            const result = setMovieDirectors({ id: 1, cast: [], crew: [MOVIE_CREDITS.crew[0]] });
            expect(result).toHaveLength(0);
        });
    });

    describe("setMovieCast", () => {
        it("should return the list of actors", () => {
            const result = setMovieCast(MOVIE_CREDITS);
            expect(result).toHaveLength(4);
            expect(result[3].name).toBe("Scarlett Johansson");
        });

        it("should return an empty list if 'credits' are not defined", () => {
            const result = setMovieCast(undefined);
            expect(result).toHaveLength(0);
        });

        it("should return an empty list if no screenplay writers are in the crew", () => {
            const result = setMovieCast({ id: 1, crew: [], cast: [] });
            expect(result).toHaveLength(0);
        });
    });
});
