const typeDefs = `#graphql
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
  }
  type User {
    id: ID!
    username: String!
    password: String!
  }

  type Query {
    todos: [Todo!]!
    todo: Todo!
    users: [User!]!
    user: User!
  }

  # input InputTodo {
  #   id: ID
  #   title: String!
  #   completed: Boolean!
  # }
  # input InputUser {
  #   id: ID
  #   username: String!
  #   password: String!
  # }

  type Mutation {
    createTodo(title: String!): Todo!
    updateTodo(id: ID!, title: String, completed: Boolean): Todo!
    deleteTodo(id: ID!): Boolean!

    singIn(username: String!, password: String!): String! ### JWT
    signUp(username: String!, password: String!): String! ### JWT
    updateUser(id: ID!, username: String, password: String): User!
    deleteUser(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
