import { MovieRatingInput, ResolverFunction } from "./types";

const setRating: ResolverFunction<MovieRatingInput, boolean> = async (_, { id, rating }: MovieRatingInput, context) => {
    const authorised = await context.isAuthorised();
    if (!authorised) {
        throw new Error("Unauthorised");
    }

    return await context.services.userRatingService.updateRating(<string>context.userId, id, rating);
};

export { setRating };
