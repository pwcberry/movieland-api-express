const querystring = require("querystring");
const fetch = require("node-fetch");
const { MovieService } = require("movieland-node-api");
const { transformMovie, transformSearchResults } = require("../transformers");

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

const service = new MovieService(apiUrl, apiKey);

module.exports = {
    async movie(_, { id }) {
        const movieData = await service.getMovieDetails(id);
        const movieCreditsData = await service.getMovieCredits(id);

        return transformMovie(movieData, movieCreditsData);
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
