const apollo = require("apollo-server-express");

module.exports = apollo.gql`
type Credit {
    name: String
}

type Genre {
    id: Int
    name: String
}

type Actor {
    id: Int
    name: String
    character: String
}    

type Movie {
    id: Int!
    title: String!
    year: Int
    overview: String
    posterUrl: String
    directors: [Credit]
    writers: [Credit]
    cast: [Actor]
    genres: [Genre]
    releaseDate: String
    runtime: Int
}

type MovieSearchItem {
    id: Int!
    title: String!
    posterUrl: String
    overview: String
    releaseDate: String
    genres: [Int]
    detailUrl: String
}

type MovieSearchResults {
    page: Int
    totalCount: Int
    totalPages: Int
    results: [MovieSearchItem]
}

input MovieSearchRequest {
    query: String!
    page: Int
    year: Int
}

type Query {
    movie(id: Int!): Movie
    search(input: MovieSearchRequest!): MovieSearchResults
    genres: [Genre]
}
`;
