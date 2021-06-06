import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import { UserInfo, UserService } from "../types";

class UserServiceImpl implements UserService {
    private readonly databaseFilename: string;
    private readonly databaseDriver;

    constructor(filename: string) {
        this.databaseFilename = filename;
        this.databaseDriver = sqlite3.Database;
    }

    /**
     * Simple authentication
     */
    async authenticate(username: string, password: string): Promise<UserInfo | null> {
        const db = await this.openDatabase();
        const result = (await db.get("SELECT id, first_name, username FROM user WHERE username=? AND password=?", username, password)) as UserInfo;

        return typeof result !== "undefined" && "id" in result ? result : null;
    }

    /**
     * Simple authorisation
     */
    async authorise(user_id: string, username: string) {
        const db = await this.openDatabase();
        const result = (await db.get("SELECT * FROM user WHERE id=? AND username=?", user_id, username)) as UserInfo;
        return typeof result !== "undefined" && "id" in result;
    }

    private async openDatabase() {
        return await open({
            filename: this.databaseFilename,
            driver: this.databaseDriver,
        });
    }
}

export default UserServiceImpl;
