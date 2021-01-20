import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NullableNumber } from "../types";

type UserRatingRow = {
    id: number;
    user_id: number;
    movie_id: number;
    rating: number;
};

class UserRatingService {
    private readonly databaseFilename: string;
    private readonly databaseDriver;

    constructor(filename: string) {
        this.databaseFilename = filename;
        this.databaseDriver = sqlite3.Database;
    }

    async getRating(userId: number, movieId: number): Promise<NullableNumber> {
        const db = await this.openDatabase();
        const result = (await db.get("SELECT rating FROM user_ratings WHERE user_id=? AND movie_id=?", userId, movieId)) as UserRatingRow[];

        return result.length > 0 ? result[0].rating : null;
    }

    async updateRating(userId: number, movieId: number, rating: number): Promise<boolean> {
        const db = await this.openDatabase();
        const row = (await db.get("SELECT rating FROM user_ratings WHERE user_id=? AND movie_id=?", userId, movieId)) as UserRatingRow[];

        if (row.length > 0) {
            const result = await db.run("UPDATE user_ratings SET rating=? WHERE user_id=? AND movie_id=?", rating, userId, movieId);
            return result.changes === 1;
        }

        const result = await db.run("INSERT INTO user_ratings (user_id, movie_id, rating) VALUES (?, ?, ?)", userId, movieId, rating);
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
