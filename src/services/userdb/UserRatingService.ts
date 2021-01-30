import * as sqlite3 from "sqlite3";
import { open } from "sqlite";

export type UserRatingRow = {
    movie_id: number;
    rating: number;
    date_updated: string;
};

class UserRatingService {
    private readonly databaseFilename: string;
    private readonly databaseDriver;

    constructor(filename: string) {
        this.databaseFilename = filename;
        this.databaseDriver = sqlite3.Database;
    }

    async getRating(userId: string, movieId: number): Promise<UserRatingRow | null> {
        const db = await this.openDatabase();
        const result = (await db.get(
            "SELECT rating, date_updated FROM user_rating WHERE user_id=? AND movie_id=?",
            userId,
            movieId
        )) as UserRatingRow;

        return typeof result !== "undefined" && "rating" in result ? result : null;
    }

    async getRatedMovies(userId: string): Promise<UserRatingRow[]> {
        const db = await this.openDatabase();
        return (await db.all(
            "SELECT movie_id, rating, date_updated FROM user_rating WHERE user_id=? ORDER BY date_updated DESC",
            userId
        )) as UserRatingRow[];
    }

    async updateRating(userId: string, movieId: number, rating: number): Promise<boolean> {
        const db = await this.openDatabase();
        const row = (await db.get("SELECT rating FROM user_rating WHERE user_id=? AND movie_id=?", userId, movieId)) as UserRatingRow;

        if (typeof row !== "undefined") {
            const dateUpdated = new Date().toISOString();
            const result = await db.run(
                "UPDATE user_rating SET rating=?, date_updated=? WHERE user_id=? AND movie_id=?",
                rating,
                dateUpdated,
                userId,
                movieId
            );
            return result.changes === 1;
        }

        const result = await db.run("INSERT INTO user_rating (user_id, movie_id, rating) VALUES (?, ?, ?)", userId, movieId, rating);
        return result.changes === 1;
    }

    private async openDatabase() {
        return await open({
            filename: this.databaseFilename,
            driver: this.databaseDriver,
        });
    }
}

export default UserRatingService;
