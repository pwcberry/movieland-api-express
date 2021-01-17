export type NullableString = string | null;

export type Genre = {
    id: number;
    name: string;
};

export type MovieResult = {
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
};

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

export type MovieDetails = {
    id: number;
    backdrop_path: string;
    budget: number;
    genres: Genre[];
    homepage: string;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: ProductionCompany[];
    production_countries: { name: string }[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    title: string;
    vote_average: number;
    vote_count: number;
};

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
