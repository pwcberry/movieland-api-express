const imageUrl = process.env.IMAGE_API_URL;

const transformMovie  = (movieData, movieCreditData) => {
    const data = {
        id: movieData.id,
        title: movieData.title,
        overview: movieData.overview,
        posterUrl: `${imageUrl}${movieData.poster_path}`,
        genres: movieData.genres,
        year: parseInt(movieData.release_date.substr(0, 4), 10),
        releaseDate: movieData.release_date,
        runtime: movieData.runtime
    };

    data.cast = movieCreditData.cast.map(credit => ({
        id: credit.id,
        name: credit.name,
        character: credit.character
    }));

    data.directors = movieCreditData.crew.filter(credit => credit.job === "Director").map(credit => ({
        name: credit.name
    }));

    data.writers = movieCreditData.crew.filter(credit => credit.job === "Screenplay").map(credit => ({
        name: credit.name
    }));

    return data;
};

const transformSearchResults = ({ page, total_results, total_pages, results }) => {
    return {
        page,
        totalCount: total_results,
        totalPages: total_pages,
        results: Array.isArray(results) ?
            results.map(item => ({
                id: item.id,
                title: item.title,
                posterUrl: `${imageUrl}${item.poster_path}`,
                overview: item.overview,
                releaseDate: item.release_date,
                genres: item.genre_ids,
                detailUrl: `/movie/${item.id}`
            })) : []
    };
};

module.exports = {
    transformMovie,
    transformSearchResults
};
