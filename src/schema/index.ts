import * as apollo from "apollo-server-express";

export default apollo.gql`
    type Credit {
      id: ID!
      name: String!
    }

    type Genre {
      id: ID!
      name: String!
    }

    type Actor {
      id: ID!
      name: String!
      character: String
    }

    type Movie {
      id: ID!
      title: String!
      releaseDate: String!
      overview: String
      posterUrl: String
      genres: [Genre]
      detailUrl: String
      directors: [Credit]
      writers: [Credit]
      cast: [Actor]
      runtime: Int
    }

    type MovieSearchResults {
      page: Int!
      totalCount: Int!
      totalPages: Int!
      results: [Movie!]!
    }

    input MovieSearchRequest {
      query: String!
      page: Int
      year: Int
    }

    type Query {
      movie(id: Int!): Movie
      search(input: MovieSearchRequest): MovieSearchResults
      genres: [Genre]
    }
`;
