import { gql } from "apollo-server";


export const typeDefs = gql `


    type User {
        _id: ID!
        email: String!
        mi_lista: [Movie]!
    }
    
    type Movie {
        _id: ID!
        title: String!
        length: Int!
        date: String!
        format: String!
    }
    
    type Query {

        me: User!
        getMovie(id: ID!): Movie
        getMovies(page: Int, size: Int):[Movie]!
    }

    type Mutation {

        register(email: String!, password: String!) : String!
        login(email: String!, password: String!) : String!
    
        addMovie(title: String!, length: Int!, date: String!, format: String!): Movie!
        deleteMovie(id: ID!): [Movie]!

        addMovieToUser(idMovie: ID!): User!
        remoteMovieFromUser(idMovie: ID!): User!

        updateMovie(id: ID!, title: String, length: Int, date: String, format: String): Movie!
    }
`