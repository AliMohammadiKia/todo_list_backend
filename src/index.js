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
  // context: async ({ req }) => {
  //   const token = req.headers.authentication || "";
  //   const user = authenticate(token);

  //   if (!user)
  //     throw new GraphQLError("you must be logged in to query this schema", {
  //       extensions: {
  //         code: "UNAUTHENTICATED",
  //       },
  //     });

  //   return {
  //     user,
  //   };
  // },
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server);
  console.log(`server running at: ${url}`);
};

startServer();
