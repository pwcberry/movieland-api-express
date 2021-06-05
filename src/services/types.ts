export type NullableString = string | null;
export type NullableNumber = number | null;

export type Genre = {
    id: number;
    name: string;
};

export interface MovieGenre {
    genre_ids?: number[];
    genres?: Genre[];
}

export interface MovieResult {
    id: number;
    genre_ids: number[];
    backdrop_path: string;
    original_language: string;
    original_title: string;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    popularity: number;
    vote_average: number;
    vote_count: number;
    user_rating?: number;
    user_rating_updated?: string;
}

export type MovieSearchResult = {
    page: number;
    total_pages: number;
    total_results: number;
    results: MovieResult[];
};

export type ProductionCompany = {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
};

export type SpokenLanguage = {
    english_name: string;
    iso_639_1: string;
    name: string;
};

export interface MovieDetails extends MovieResult {
    budget: number;
    genres: Genre[];
    homepage: string;
    imdb_id: string;
    production_companies: ProductionCompany[];
    production_countries: { name: string }[];
    revenue: number;
    runtime: number;
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
}

export type MovieCredit = {
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    credit_id: string;
    cast_id?: number;
    character?: string;
    order?: number;
    job?: string;
    department?: string;
};

export type MovieCreditsResult = {
    id: number;
    cast: MovieCredit[];
    crew: MovieCredit[];
};

export type PersonDetails = {
    id: number;
    birthday: string;
    deathday: NullableString;
    name: string;
    also_known_as: string[];
    gender: number;
    biography: string;
    popularity: number;
    place_of_birth: NullableString;
    profile_path: NullableString;
    imdb_id: string;
    homepage: NullableString;
};

export type MovieFullDetailsResult = {
    movie: MovieDetails;
    credits: MovieCreditsResult;
};

export interface MovieService {
    /**
     * Retrieve movies that match the text of a given query.
     *
     * @param query The text to search for in a movie title
     * @param page The requested page of the results
     * @param year Filter to the year movies were released
     */
    search(query: string, page?: number, year?: number): Promise<MovieSearchResult>;

    /**
     * Get the current set of movie genres available from the API.
     */
    getGenres(): Promise<Genre[]>;

    /**
     * Get the details for a movie with the specified ID.
     */
    getMovieDetails(id: number): Promise<MovieDetails>;

    /**
     * Get the credits for a movie with the specified ID.
     */
    getMovieCredits(id: number): Promise<MovieCreditsResult>;
}

export interface DiscoverService {
    getHighestGrossingFromPreviousYear(sinceReleaseDate: string): Promise<MovieSearchResult>;

    getHighestVotesFromPreviousYear(sinceReleaseDate: string): Promise<MovieSearchResult>;

    getMostPopularFromPreviousYear(sinceReleaseDate: string): Promise<MovieSearchResult>;
}

export interface PersonService {
    getPerson(id: number): Promise<PersonDetails>;
}

export type UserInfo = {
    id: string;
    first_name: string;
    username: string;
};

export interface UserService {
    /**
     * Simple authentication
     */
    authenticate(username: string, password: string): Promise<UserInfo | null>;

    /**
     * Simple authorisation
     */
    authorise(user_id: string, username: string): Promise<boolean>;
}

export type UserRatingInfo = {
    movie_id: number;
    rating: number;
    date_updated: string;
};

export interface UserRatingService {
    getRating(userId: string, movieId: number): Promise<UserRatingInfo | null>;

    getRatedMovies(userId: string): Promise<UserRatingInfo[]>;

    updateRating(userId: string, movieId: number, rating: number): Promise<boolean>;
}
