const querystring = require("querystring");
const fetch = require("node-fetch");
const { transformMovie, transformSearchResults } = require("../transformers");

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

module.exports = {
    async movie(_, { id }) {
        const movieResponse = await fetch(`${apiUrl}/movie/${id}?api_key=${apiKey}`);
        const movieData = await movieResponse.json();

        const movieCreditsResponse = await fetch(`${apiUrl}/movie/${id}/credits?api_key=${apiKey}`);
        const movieCreditData = await movieCreditsResponse.json();

        return transformMovie(movieData, movieCreditData);
    },

    async search(_, { input: { query, page, year } }) {
        // REF: https://developers.themoviedb.org/3/search/search-movies
        const apiQueryParams = querystring.stringify({
            api_key: apiKey,
            language: "en-US",
            include_adult: false,
            query,
            page: parseInt(page) || 1,
            year
        });

        // console.log("searchUrl:\n", `${apiUrl}/search/movie?${apiQueryParams}`);

        const searchResponse = await fetch(`${apiUrl}/search/movie?${apiQueryParams}`);
        const searchResultData = await searchResponse.json();
        // const file = fs.readFileSync(path.join(__dirname, "data/moviedb.json"), { encoding: "utf8" });
        // const searchResultData = JSON.parse(file);
        return transformSearchResults(searchResultData);
    },

    async genres() {
        console.log("genreUrl:\n", `${apiUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`);

        const queryResponse = await fetch(`${apiUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`);
        const queryData = await queryResponse.json();
        return queryData.genres;
    }
};
