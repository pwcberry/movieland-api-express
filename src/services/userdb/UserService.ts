import * as sqlite3 from "sqlite3";
import { open } from "sqlite";

type UserRow = {
    id: string;
    first_name: string;
    username: string;
};

class UserService {
    private readonly databaseFilename: string;
    private readonly databaseDriver;

    constructor(filename: string) {
        this.databaseFilename = filename;
        this.databaseDriver = sqlite3.Database;
    }

    /**
     * Simple authentication
     */
    public async authenticate(username: string, password: string) {
        const db = await this.openDatabase();
        const result = (await db.get("SELECT id, first_name, username FROM user WHERE username=? AND password=?", username, password)) as UserRow[];

        return result.length > 1 ? result[0] : null;
    }

    /**
     * Simple authorization
     */
    public async authorize(user_id: string, username: string) {
        const db = await this.openDatabase();
        const result = (await db.get("SELECT * FROM user WHERE id=? AND username=?", user_id, username)) as UserRow[];
        return result.length === 1;
    }

    private async openDatabase() {
        return await open({
            filename: this.databaseFilename,
            driver: this.databaseDriver,
        });
    }
}

export default UserService;
