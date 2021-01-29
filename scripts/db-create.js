require("dotenv").config();
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

(async () => {
    const db = await open({
        filename: path.resolve(process.env.DATABASE),
        driver: sqlite3.Database,
    });

    await db.exec(`
CREATE TABLE user (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    location TEXT,
    date_added TEXT DEFAULT current_timestamp,
    date_updated TEXT DEFAULT current_timestamp
);`);
    await db.exec(`
INSERT INTO user (id, first_name, last_name, username, password, location)
    VALUES (
    '133cd11a-f6b3-426c-9129-a0370efdee25',
    'Peter',
    NULL,
    'peter@email.com',
    'password',
    'Melbourne'
);`);
    await db.exec(`
CREATE TABLE user_rating (
   user_id TEXT REFERENCES user (id) ON DELETE CASCADE,
   movie_id INTEGER,
   rating INTEGER,
   date_added TEXT DEFAULT current_timestamp,
   date_updated TEXT DEFAULT current_timestamp
);`);

    await db.close();
})();
