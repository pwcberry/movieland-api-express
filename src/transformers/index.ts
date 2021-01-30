/* eslint @typescript-eslint/indent: "off" */
// Switched off lint rule to allow for preferred format of functions

import { Genre, MovieCreditsResult, MovieGenre } from "../services/types";
import { Actor, Credit, ResolverContext } from "../resolvers/types";

const imageUrl = process.env.IMAGE_API_URL;

export const setImageUrl = (posterPath: string) => `${imageUrl}${posterPath}`;

export const setGenres = async (movie: MovieGenre, context: ResolverContext): Promise<Genre[]> => {
    if ("genres" in movie) {
        return movie.genres as Genre[];
    }

    if ("genre_ids" in movie) {
        const {
            services: { movieService },
        } = context;
        const genres = await movieService.getGenres();

        return genres.reduce((ls, g) => {
            if (movie.genre_ids?.includes(g.id)) {
                ls.push(g);
            }
            return ls;
        }, [] as Genre[]);
    }

    return [];
};

export const setMovieDirectors = (credits: MovieCreditsResult | undefined): Credit[] =>
    typeof credits !== "undefined"
        ? credits.crew
              .filter((credit) => credit.department === "Directing" && credit.job === "Director")
              .map((credit) => ({
                  id: credit.id,
                  name: credit.name,
                  job: "Director",
              }))
        : [];

export const setMovieWriters = (credits: MovieCreditsResult | undefined): Credit[] =>
    typeof credits !== "undefined"
        ? credits.crew
              .filter((credit) => credit.department === "Writing" && credit.job === "Screenplay")
              .map((credit) => ({
                  id: credit.id,
                  name: credit.name,
                  job: "Writer",
              }))
        : [];

export const setMovieCast = (credits: MovieCreditsResult | undefined): Actor[] =>
    typeof credits !== "undefined"
        ? credits.cast
              .filter((credit) => credit.known_for_department === "Acting" && typeof credit.cast_id === "number")
              .map((credit) => ({
                  id: credit.id,
                  name: credit.name,
                  originalName: credit.original_name,
                  character: credit.character,
                  order: credit.order,
                  profileUrl: `/person/${credit.id}`,
              }))
        : [];
