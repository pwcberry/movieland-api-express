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
