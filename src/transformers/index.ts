import { Genre, MovieCreditsResult, MovieGenre } from "../services/types";
import { Actor, Credit, ResolverContext } from "../resolvers/types";

const imageUrl = process.env.IMAGE_API_URL;

export const setImageUrl = (posterPath: string) => `${imageUrl}${posterPath}`;

export const setGenres = async (movie: MovieGenre, context: ResolverContext) => {
    if ("genres" in movie) {
        return movie.genres;
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
              .filter((credit) => credit.known_for_department === "Directing")
              .map((credit) => ({
                  id: credit.id,
                  name: credit.name,
                  department: "Directing",
              }))
        : [];

export const setMovieWriters = (credits: MovieCreditsResult | undefined): Credit[] =>
    typeof credits !== "undefined"
        ? credits.crew
              .filter((credit) => credit.known_for_department === "Writing")
              .map((credit) => ({
                  id: credit.id,
                  name: credit.name,
                  department: "Writing",
              }))
        : [];

export const setMovieCast = (credits: MovieCreditsResult | undefined): Actor[] =>
    typeof credits !== "undefined"
        ? credits.crew
              .filter((credit) => credit.known_for_department === "Acting")
              .map((credit) => ({
                  id: credit.id,
                  name: credit.name,
                  originalName: credit.original_name,
                  character: credit.character,
                  order: credit.order,
                  profileUrl: `/person/${credit.id}`,
              }))
        : [];
