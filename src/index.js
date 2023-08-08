require("dotenv").config();

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
// const { authenticate } = require("./auth/auth");
// const { GraphQLError } = require("graphql");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server);
  console.log(`server running at: ${url}`);
};

startServer();
