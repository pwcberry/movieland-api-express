import * as apollo from "apollo-server-express";

export default apollo.gql`
    type Credit {
      id: ID!
      name: String!
      job: String
    }

    type Genre {
      id: ID!
      name: String!
    }

    type Actor {
      id: ID!
      name: String!
      character: String
      profileUrl: String
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
      rating: Float
      popularity: Float
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
      highestGross: MovieSearchResults
      highestVotes: MovieSearchResults
      mostPopular: MovieSearchResults
    }
`;
