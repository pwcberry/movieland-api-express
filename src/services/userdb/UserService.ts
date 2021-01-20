import * as sqlite3 from "sqlite3";
import { open } from "sqlite";

class UserService {
    private readonly databaseFilename: string;
    private readonly databaseDriver;

    constructor(filename: string) {
        this.databaseFilename = filename;
        this.databaseDriver = sqlite3.Database;
    }

    private async openDatabase() {
        return await open({
            filename: this.databaseFilename,
            driver: this.databaseDriver,
        });
    }
}

export default UserService;
