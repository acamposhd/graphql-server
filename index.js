import { ApolloServer, gql, UserInputError } from "apollo-server";
import { v1 as uuid } from "uuid";
import axios from "axios";

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
  enum YesNo {
    YES
    NO
  }
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
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(name: String!, phone: String!): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: async (root, args) => {
      const { data: personsFromApi } = await axios.get(
        "http://localhost:3000/persons"
      );
      if (!args.phone) return personsFromApi;

      const byPhone = (person) =>
        args.phone === "YES" ? person.phone : !person.phone;

      return persons.filter(byPhone);
    },
    findPerson: (root, args) => {
      const { name } = args;
      return persons.find((person) => person.name === name);
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((person) => person.name === args.name)) {
        throw new UserInputError("Name must be unique ", {
          invalidArgs: args.name,
        });
      }
      const person = { ...args, id: uuid() };
      persons.push(person);
      return person;
    },
    editNumber: (root, args) => {
      const personIdx = persons.findIndex(
        (person) => person.name === args.name
      );
      const person = persons[personIdx];
      if (personIdx === -1) return null;
      const updatedPerson = { ...person, phone: args.phone };
      persons[personIdx] = updatedPerson;
      return updatedPerson;
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
