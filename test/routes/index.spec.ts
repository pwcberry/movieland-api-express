import * as sqlite from "sqlite";
import * as express from "express";
import { isAuthorised } from "../../src/routes";
import { UserService } from "../../src/services/userdb";

jest.mock("sqlite");
jest.mock("sqlite3");

const mockRequest = () => {
    const req = <express.Request>{
        cookies: {},
    };

    req.app = <express.Application>({
        locals: {
            userService: new UserService("database.db"),
        },
    } as unknown);

    return req;
};

interface MockDatabase {
    get: jest.Mock;
}

const mockDatabase = jest.fn((db: MockDatabase) => {
    (sqlite.open as jest.Mock).mockResolvedValue(db);
});

describe("UserRouter", () => {
    describe("isAuthorised", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return false when cookies are not present", async () => {
            expect.assertions(1);

            const req = mockRequest();
            const result = await isAuthorised(req);

            expect(result).toBe(false);
        });

        it("should return false when cookies are present but values are not in the database", async () => {
            expect.assertions(1);

            const req = mockRequest();
            req.cookies = {
                userid: "a1b2c3d4e5f6",
                username: "stevie@email.com",
            };

            const db = {
                get: jest.fn().mockResolvedValue(undefined),
            };
            mockDatabase(db);

            const result = await isAuthorised(req);

            expect(result).toBe(false);
        });

        it("should return true when cookies are present and values are in the database", async () => {
            expect.assertions(1);

            const user_id = "a1b2c3d4e5f6";
            const user_email = "stevie@email.com";

            const req = mockRequest();
            req.cookies = {
                userid: user_id,
                username: user_email,
            };

            const db = {
                get: jest.fn().mockResolvedValue({
                    id: user_id,
                    username: user_email,
                    first_name: "Stevie",
                }),
            };
            mockDatabase(db);

            const result = await isAuthorised(req);

            expect(result).toBe(true);
        });
    });
});
