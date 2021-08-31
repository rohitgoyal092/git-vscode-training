const { gql } = require("apollo-server");

/**
 * Type Definitions for our Schema using the SDL.
 */
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    pets: [Pet]!
  }

  type Pet {
    id: ID!
    type: PetType!
    name: String!
    owner: User!
    img: String!
    createdAt: Int!
  }

  input PetEditInputType {
    id: ID!
    type: PetType!
    name: String!
  }

  input NewPetInput {
    name: String!
    type: PetType!
  }

  input PetsInput {
    type: PetType
  }

  type Query {
    user: User!
    pets(input: PetsInput): [Pet]!
    pet(id: ID!): Pet!
  }

  type Mutation {
    addPet(input: NewPetInput!): Pet!
    deletePet(id: ID!): Pet!
    editPet(pet: PetEditInputType!): Pet!
  }
`;

module.exports = typeDefs;
