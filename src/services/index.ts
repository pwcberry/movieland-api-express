import * as moviedb from "./moviedb";
import * as mock from "./moviedb/mocks";
import * as userdb from "./userdb";

export default function getServices(apiUrl: string, apiKey: string, databasePath: string, mockPath: string, useMocks: boolean) {
    const movieService = useMocks ? new mock.MovieServiceMock(mockPath) : new moviedb.MovieService(apiUrl, apiKey);

    const discoverService = useMocks ? new mock.DiscoverServiceMock(mockPath) : new moviedb.DiscoverService(apiUrl, apiKey);

    return {
        movieService,
        discoverService,
        personService: new moviedb.PersonService(apiUrl, apiKey),
        userRatingService: new userdb.UserRatingService(databasePath),
    };
}
