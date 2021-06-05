const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

require("dotenv").config({
    path: path.resolve(process.cwd(), ".env"),
});

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;
const movieIds = new Set();

const getMovieDetails = async (id) => {
    const url = `${API_URL}/movie/${id}?api_key=${API_KEY}`;

    const queryResponse = await fetch(url);
    return await queryResponse.json();
};

const getMovieCredits = async (id) => {
    const url = `${API_URL}/movie/${id}/credits?api_key=${API_KEY}`;

    const queryResponse = await fetch(url);
    return await queryResponse.json();
};

const writeMovieFile = (dir, id, data) => {
    const fullPath = path.resolve(__dirname, path.join("../mocks/", dir, `${id}.json`));
    fs.writeFileSync(fullPath, JSON.stringify(data), { encoding: "utf8" });
};

(async () => {
    const rawSource = fs.readFileSync(path.resolve(process.cwd(), "mocks/movie-discover.json"), { encoding: "utf8" });
    const source = JSON.parse(rawSource);

    ["highest_grossing", "highest_votes", "most_popular"].forEach((key) => {
        const { results } = source[key];

        if (Array.isArray(results) && results.length > 0) {
            results.forEach(({ id }) => {
                movieIds.add(id);
            });
        }
    });

    for (const id of movieIds) {
        try {
            console.log("Obtaining movie details for:", id);
            const movieData = await getMovieDetails(id);
            writeMovieFile("movies", id, movieData);

            console.log("Obtaining movie credits for:", id);
            const creditData = await getMovieCredits(id);
            writeMovieFile("movie-credits", id, creditData);
        } catch (e) {
            console.error(e);
        }
    }
})();

(async () => {
    const rawSource = fs.readFileSync(path.resolve(process.cwd(), "mocks/movie-search.json"), { encoding: "utf8" });
    const source = JSON.parse(rawSource);

    for (const movie of source) {
        const { id } = movie;
        try {
            console.log("Obtaining movie details for:", id);
            const movieData = await getMovieDetails(id);
            writeMovieFile("movies", id, movieData);

            console.log("Obtaining movie credits for:", id);
            const creditData = await getMovieCredits(id);
            writeMovieFile("movie-credits", id, creditData);
        } catch (e) {
            console.error(e);
        }
    }
})();
