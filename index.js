import { gql } from "apollo-server";
import { ApolloServer } from "apollo-server";
const persons = [
  {
    name: "Beto",
    phone: "123456789",
    street: "Huachichil",
    city: "Aguascalientes",
    id: "3d345345-3454-11d3-bv54-5b54ba45c431",
  },
  {
    name: "Sofia",
    phone: "8734583848",
    street: "Merlot",
    city: "Celaya",
    id: "2d345345-3454-12d3-bv54-3b54ba45c431",
  },
  {
    name: "Melanie",
    phone: "78978978978",
    street: "Montebello",
    city: "Aguascalientes",
    id: "4d345345-3454-11d3-bv54-5b54ba45c431",
  },
];

const typeDefs = gql`
  type Address {
    street: String!
    city: String!
  }
  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => {
      const { name } = args;
      return persons.find((person) => person.name === name);
    },
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
